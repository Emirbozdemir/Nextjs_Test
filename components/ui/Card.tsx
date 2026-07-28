import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`
        rounded-3xl
        border border-white/80
        bg-white/90
        p-6
        shadow-[0_12px_35px_-18px_rgba(15,23,42,0.25)]
        backdrop-blur-sm
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-[0_20px_45px_-20px_rgba(15,23,42,0.3)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
