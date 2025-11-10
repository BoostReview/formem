export const alignmentClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const

export type Alignment = "left" | "center" | "right"

export function getAlignment(block: { align?: unknown; alignment?: unknown; [key: string]: unknown }, defaultAlign: Alignment = "left"): Alignment {
  return (block.align as Alignment) || (block.alignment as Alignment) || defaultAlign
}

