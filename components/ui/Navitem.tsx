import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface NavItemProps {
  title: string;
  href: string;
  icon: LucideIcon;
}

export default function NavItem({
  title,
  href,
  icon: Icon,
}: NavItemProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition-all duration-200 hover:bg-slate-800 hover:text-white"
    >
      <Icon size={20} />

      <span>{title}</span>
    </Link>
  );
}