import type { AnchorHTMLAttributes, ReactNode } from "react";

type NativeLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

export function NativeLink({ children, href, ...props }: NativeLinkProps) {
  return <a href={href} {...props}>{children}</a>;
}
