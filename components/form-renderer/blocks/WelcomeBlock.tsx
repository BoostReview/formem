"use client";

import type { FormBlock } from "@/types";

interface WelcomeBlockProps {
  block: FormBlock;
  value?: unknown;
  onChange: (value: unknown) => void;
}

export function WelcomeBlock({ block }: WelcomeBlockProps) {
  const title: string = (typeof block.label === 'string' ? block.label : (typeof block.title === 'string' ? block.title : "Bienvenue !")) || "Bienvenue !";
  const description: string = (typeof block.description === 'string' ? block.description : "") || "";

  return (
    <div className="text-center space-y-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-slate-100">
        {title}
      </h1>
      {description && (
        <p className="text-base sm:text-lg text-gray-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

