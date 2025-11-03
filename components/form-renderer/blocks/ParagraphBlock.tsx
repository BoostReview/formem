import type { FormBlock } from "@/types";

interface ParagraphBlockProps {
  block: FormBlock;
  value?: unknown;
  onChange: (value: unknown) => void;
}

export function ParagraphBlock({ block }: ParagraphBlockProps) {
  return (
    <p className="text-base sm:text-lg text-gray-600 dark:text-slate-300 leading-relaxed">
      {block.label || ""}
    </p>
  );
}

