import type { FormBlock } from "@/types";
import { cn } from "@/lib/utils";

interface HeadingBlockProps {
  block: FormBlock;
  value?: unknown;
  onChange: (value: unknown) => void;
}

export function HeadingBlock({ block }: HeadingBlockProps) {
  const level = (block.level as "h1" | "h2" | "h3") || "h2"
  const align = (block.align as "left" | "center" | "right") || "left"
  const HeadingTag = level

  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }

  return (
    <div className="w-full">
      <HeadingTag
        className={cn(
          "font-semibold text-gray-900 dark:text-slate-100 mb-3 leading-tight tracking-tight block",
          level === "h1" && "text-3xl sm:text-4xl",
          level === "h2" && "text-2xl sm:text-3xl",
          level === "h3" && "text-xl sm:text-2xl",
          alignmentClasses[align]
        )}
      >
        {block.label || "Titre"}
      </HeadingTag>
    </div>
  );
}

