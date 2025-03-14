'use client';

export interface DropdownMenuItemProps {
  id: string;
  label: string;
}

export interface DropdownMenuProps {
  title: string;
  items: DropdownMenuItemProps[];
}

export function DropdownMenu({ title, items }: DropdownMenuProps) {
  return (
    <div>
      <div>{title}</div>

      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.label}</li>
        ))}
      </ul>
    </div>
  );
}
