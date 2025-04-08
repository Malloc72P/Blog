export interface DividerProps {
  height?: number;
  color?: string;
}

export function Divider({ height = 1, color = 'bg-gray-200' }: DividerProps) {
  return <div className={color} style={{ height }}></div>;
}
