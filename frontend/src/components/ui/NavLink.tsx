import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  className = "",
  onClick,
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`transition-colors duration-200 ease-out font-medium text-sm cursor-pointer ${
        isActive
          ? "text-[#D4AF37] font-bold"
          : "text-secondaryText hover:text-primaryText"
      } ${className}`}
    >
      {children}
    </Link>
  );
};
export default NavLink;
