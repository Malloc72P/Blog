export interface DividerProps {
  height?: number;
}

export function Divider({ height = 1 }: DividerProps) {
  return <div className="bg-gray-200" style={{ height }}></div>;
}
