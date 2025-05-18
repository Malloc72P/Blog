import { PropsWithChildren } from "react";

export interface MyHeaderProps extends PropsWithChildren {
  descList?: string[];
}

export function MyHeader({ children, descList = [] }: MyHeaderProps) {
  return (
    <div className="mb-5 border-b border-gray-300">
      <h3 className="text-2xl font-bold">{children}</h3>

      <ul className="pl-5 list-disc py-2">
        {descList.map((v, i) => (
          <li key={i}>{v}</li>
        ))}
      </ul>
    </div>
  );
}
