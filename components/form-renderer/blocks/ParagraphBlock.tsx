import type { FormBlock } from "@/types";
import { cn } from "@/lib/utils";

interface ParagraphBlockProps {
  block: FormBlock;
  value?: unknown;
  onChange: (value: unknown) => void;
}

export function ParagraphBlock({ block }: ParagraphBlockProps) {
  const align = (block.align as "left" | "center" | "right") || "left"
  
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }

  return (
    <p className={cn(
      "text-base sm:text-lg text-gray-600 dark:text-slate-300 leading-relaxed block",
      alignmentClasses[align]
    )}>
      {block.label || ""}
    </p>
  );
}

