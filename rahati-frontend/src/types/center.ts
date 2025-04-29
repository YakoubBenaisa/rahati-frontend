export interface Center {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCenterInput {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
}

export interface UpdateCenterInput extends Partial<CreateCenterInput> {}
