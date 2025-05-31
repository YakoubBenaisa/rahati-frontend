import React from 'react';
import classNames from 'classnames';

// Table component
interface TableProps {
  children: React.ReactNode;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
}

const Table: React.FC<TableProps> & {
  Header: typeof TableHeader;
  Body: typeof TableBody;
  Row: typeof TableRow;
  HeaderCell: typeof TableHeaderCell;
  Cell: typeof TableCell;
} = ({
  children,
  className = '',
  striped = true,
  hoverable = true,
  bordered = false,
  compact = false,
}) => {
  return (
    <div className="overflow-x-auto">
      <table
        className={classNames(
          'min-w-full divide-y divide-[var(--color-border)]',
          {
            'border border-[var(--color-border)]': bordered,
          },
          className
        )}
      >
        {children}
      </table>
    </div>
  );
};

// Table Header component
interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  className = '',
}) => {
  return (
    <thead className={classNames('bg-[var(--color-bg-secondary)]', className)}>
      {children}
    </thead>
  );
};

// Table Body component
interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

const TableBody: React.FC<TableBodyProps> = ({ children, className = '' }) => {
  return (
    <tbody
      className={classNames(
        'bg-[var(--color-bg-primary)] divide-y divide-[var(--color-border)]',
        className
      )}
    >
      {children}
    </tbody>
  );
};

// Table Row component
interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isClickable?: boolean;
}

const TableRow: React.FC<TableRowProps> = ({
  children,
  className = '',
  onClick,
  isClickable = false,
}) => {
  return (
    <tr
      className={classNames(
        {
          'hover:bg-[var(--color-bg-secondary)] cursor-pointer': isClickable || onClick,
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

// Table Header Cell component
interface TableHeaderCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

const TableHeaderCell: React.FC<TableHeaderCellProps> = ({
  children,
  className = '',
  align = 'left',
  width,
}) => {
  return (
    <th
      scope="col"
      className={classNames(
        'px-6 py-3 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider',
        {
          'text-left': align === 'left',
          'text-center': align === 'center',
          'text-right': align === 'right',
        },
        className
      )}
      style={width ? { width } : undefined}
    >
      {children}
    </th>
  );
};

// Table Cell component
interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

const TableCell: React.FC<TableCellProps> = ({
  children,
  className = '',
  align = 'left',
}) => {
  return (
    <td
      className={classNames(
        'px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]',
        {
          'text-left': align === 'left',
          'text-center': align === 'center',
          'text-right': align === 'right',
        },
        className
      )}
    >
      {children}
    </td>
  );
};

// Assign subcomponents to Table
Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.HeaderCell = TableHeaderCell;
Table.Cell = TableCell;

export default Table;
