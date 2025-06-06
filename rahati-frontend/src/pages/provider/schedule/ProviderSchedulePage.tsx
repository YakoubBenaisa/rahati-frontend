import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../../layouts';
import { Card, Button, Alert, Select, Input } from '../../../components/ui';
import { useAuth } from '../../../hooks';
import { motion } from 'framer-motion';
import { scheduleAPI } from '../../../services/api';

interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

const ProviderSchedulePage: React.FC = () => {
  const { user } = useAuth('Provider');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<TimeSlot[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('17:00');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Days of the week
  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  // Default schedule for all days
  const defaultSchedule: TimeSlot[] = daysOfWeek.map(day => ({
    day,
    startTime: '09:00',
    endTime: '17:00',
    isAvailable: false
  }));

  // Fetch provider schedule data
  useEffect(() => {
    if (!user?.id) return;

    const fetchSchedule = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await scheduleAPI.getProviderSchedule(user.id);
        const scheduleData = response.data.data || response.data;

        // Transform API data to our TimeSlot format
        // If the API doesn't return data for all days, create default entries
        const daysData = scheduleData || [];

        // Create a map of existing days
        const daysMap = daysData.reduce((acc: Record<string, TimeSlot>, item: any) => {
          acc[item.day] = {
            day: item.day,
            startTime: item.start_time || '09:00',
            endTime: item.end_time || '17:00',
            isAvailable: item.is_available || false
          };
          return acc;
        }, {});

        // Ensure all days of the week are included
        const fullSchedule = daysOfWeek.map(day => {
          if (daysMap[day]) {
            return daysMap[day];
          }

          // Default values for days not in the API response
          return {
            day,
            startTime: '09:00',
            endTime: '17:00',
            isAvailable: false
          };
        });

        setSchedule(fullSchedule);
      } catch (err: any) {
        console.error('Error fetching provider schedule:', err);
        setError(err.response?.data?.message || 'Failed to load schedule. Please try again.');

        // Use default schedule if API call fails
        setSchedule(defaultSchedule);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [user, daysOfWeek, defaultSchedule]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) return;

    // Validate times
    if (startTime >= endTime) {
      setError('End time must be after start time');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Prepare time slot data
      const timeSlotData = {
        start_time: startTime,
        end_time: endTime,
        is_available: true
      };

      // Update time slot in API
      await scheduleAPI.updateProviderAvailability(user.id, selectedDay, timeSlotData);

      // Update local state
      if (isEditing && editingIndex !== null) {
        // Update existing time slot
        const updatedSchedule = [...schedule];
        updatedSchedule[editingIndex] = {
          day: selectedDay,
          startTime,
          endTime,
          isAvailable: true
        };
        setSchedule(updatedSchedule);
      } else {
        // Check if day already exists
        const existingDayIndex = schedule.findIndex(slot => slot.day === selectedDay);

        if (existingDayIndex !== -1) {
          // Update existing day
          const updatedSchedule = [...schedule];
          updatedSchedule[existingDayIndex] = {
            day: selectedDay,
            startTime,
            endTime,
            isAvailable: true
          };
          setSchedule(updatedSchedule);
        } else {
          // Add new day
          setSchedule([
            ...schedule,
            {
              day: selectedDay,
              startTime,
              endTime,
              isAvailable: true
            }
          ]);
        }
      }

      setSuccess(`Schedule for ${selectedDay} updated successfully`);
      resetForm();
    } catch (err: any) {
      console.error('Error updating time slot:', err);
      setError(err.response?.data?.message || 'Failed to update schedule. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle availability for a day
  const toggleAvailability = async (index: number) => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const slot = schedule[index];
      const newAvailability = !slot.isAvailable;

      // Update availability in API
      await scheduleAPI.updateProviderAvailability(user.id, slot.day, {
        is_available: newAvailability
      });

      // Update local state
      const updatedSchedule = [...schedule];
      updatedSchedule[index].isAvailable = newAvailability;
      setSchedule(updatedSchedule);

      setSuccess(`Availability for ${slot.day} ${newAvailability ? 'enabled' : 'disabled'} successfully`);
    } catch (err: any) {
      console.error('Error updating availability:', err);
      setError(err.response?.data?.message || 'Failed to update availability. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Edit a time slot
  const editTimeSlot = (index: number) => {
    const slot = schedule[index];
    setSelectedDay(slot.day);
    setStartTime(slot.startTime);
    setEndTime(slot.endTime);
    setIsEditing(true);
    setEditingIndex(index);
  };

  // Reset form
  const resetForm = () => {
    setSelectedDay('Monday');
    setStartTime('09:00');
    setEndTime('17:00');
    setIsEditing(false);
    setEditingIndex(null);
  };

  // Save entire schedule
  const saveSchedule = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      // Transform schedule data to API format
      const scheduleData = schedule.map(slot => ({
        day: slot.day,
        start_time: slot.startTime,
        end_time: slot.endTime,
        is_available: slot.isAvailable
      }));

      // Send schedule data to API
      await scheduleAPI.updateProviderSchedule(user.id, { schedule: scheduleData });

      setSuccess('Schedule saved successfully');
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error saving schedule:', err);
      setError(err.response?.data?.message || 'Failed to save schedule. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900">Manage Your Schedule</h1>
          <p className="mt-2 text-gray-600">
            Set your availability and working hours for appointments.
          </p>
        </motion.div>

        {error && (
          <Alert
            variant="error"
            message={error}
            onClose={() => setError(null)}
            className="mb-6"
          />
        )}

        {success && (
          <Alert
            variant="success"
            message={success}
            onClose={() => setSuccess(null)}
            className="mb-6"
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Schedule Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card title={isEditing ? "Edit Time Slot" : "Add Time Slot"}>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Select
                    label="Day of Week"
                    name="day"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    options={daysOfWeek.map(day => ({ value: day, label: day }))}
                    disabled={isEditing}
                  />
                </div>

                <div className="mb-4">
                  <Input
                    label="Start Time"
                    type="time"
                    name="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                <div className="mb-6">
                  <Input
                    label="End Time"
                    type="time"
                    name="endTime"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    isLoading={isLoading}
                  >
                    {isEditing ? 'Update' : 'Add'}
                  </Button>

                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          </motion.div>

          {/* Schedule Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card title="Your Weekly Schedule">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : schedule.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No schedule set</h3>
                  <p className="mt-1 text-sm text-gray-500">Add your availability to get started.</p>
                </div>
              ) : (
                <div className="overflow-hidden bg-white">
                  <ul className="divide-y divide-gray-200">
                    {schedule.map((slot, index) => (
                      <li key={slot.day} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                              slot.isAvailable
                                ? 'bg-green-100 text-green-600'
                                : 'bg-red-100 text-red-600'
                            }`}>
                              {slot.day.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{slot.day}</div>
                              <div className="text-sm text-gray-500">
                                {slot.isAvailable
                                  ? `${slot.startTime} - ${slot.endTime}`
                                  : 'Not Available'}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant={slot.isAvailable ? "danger" : "primary"}
                              onClick={() => toggleAvailability(index)}
                            >
                              {slot.isAvailable ? 'Set Unavailable' : 'Set Available'}
                            </Button>
                            {slot.isAvailable && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => editTimeSlot(index)}
                              >
                                Edit
                              </Button>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6">
                <Button
                  variant="primary"
                  onClick={saveSchedule}
                  isLoading={isLoading}
                  fullWidth
                >
                  Save Schedule
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProviderSchedulePage;
