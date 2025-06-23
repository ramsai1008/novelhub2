import React from "react";

interface CardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export default function Card({ title, description, children }: CardProps) {
  return (
    <div className="bg-white dark:bg-zinc-800 text-black dark:text-white p-6 rounded-2xl shadow-md transition-colors duration-300">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4">{description}</p>
      {children}
    </div>
  );
}
