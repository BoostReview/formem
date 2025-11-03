import type { FormBlock } from "@/types";

interface HeadingBlockProps {
  block: FormBlock;
  value?: unknown;
  onChange: (value: unknown) => void;
}

export function HeadingBlock({ block }: HeadingBlockProps) {
  return (
    <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-slate-100 mb-3 leading-tight tracking-tight">
      {block.label || "Titre"}
    </h2>
  );
}

