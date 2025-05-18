import Link from "next/link";
import { ComponentProps } from "react";

export function MyLink(props: ComponentProps<typeof Link>) {
  return <Link className="hover:underline" {...props}></Link>;
}
