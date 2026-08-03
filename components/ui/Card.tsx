import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`
        rounded-[1.75rem]
        border border-stone-200/80
        bg-[#fffefb]/85
        p-6
        shadow-[0_18px_50px_-28px_rgba(41,54,47,0.2)]
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-emerald-200
        hover:shadow-[0_25px_55px_-28px_rgba(13,148,136,0.24)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
