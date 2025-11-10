"use client"

import * as React from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { Response, Form, FormBlock } from "@/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, ArrowUpDown, File, Download } from "lucide-react"
import { formatResponseDate, formatPhone } from "@/lib/formatters/formatResponse"
import { cn } from "@/lib/utils"

interface ResponsesTableMondayProps {
  responses: Response[]
  form: Form
  onViewDetails: (response: Response) => void
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  className?: string
}

// Fonction pour rendre la valeur d'une réponse selon le type de bloc
function renderCellValue(value: unknown, block: FormBlock): React.ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">-</span>
  }

  switch (block.type) {
    case "multiple-choice":
      if (Array.isArray(value)) {
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((item, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {String(item)}
              </Badge>
            ))}
          </div>
        )
      }
      return <span>{String(value)}</span>

    case "single-choice":
      return (
        <Badge variant="outline" className="text-xs">
          {String(value)}
        </Badge>
      )

    case "yes-no":
      return (
        <Badge variant={value ? "default" : "secondary"} className="text-xs">
          {value ? "Oui" : "Non"}
        </Badge>
      )

    case "consent":
      return (
        <Badge variant={value ? "default" : "destructive"} className="text-xs">
          {value ? "Accepté" : "Refusé"}
        </Badge>
      )

    case "captcha":
      return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-xs">
          ✓ Validé
        </Badge>
      )

    case "date":
      try {
        return <span className="text-sm">{formatResponseDate(String(value))}</span>
      } catch {
        return <span className="text-sm">{String(value)}</span>
      }

    case "file":
      if (typeof value === "object" && value !== null && "originalName" in value) {
        const fileData = value as { originalName: string; fileUrl?: string; type?: string }
        const isImage = fileData.type?.startsWith("image/") || 
          /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileData.originalName)
        return (
          <div className="flex items-center gap-2">
            {isImage ? (
              <div className="h-6 w-6 rounded border overflow-hidden flex-shrink-0">
                {fileData.fileUrl && (
                  <img
                    src={fileData.fileUrl}
                    alt={fileData.originalName}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                )}
              </div>
            ) : (
              <File className="h-4 w-4 text-primary flex-shrink-0" />
            )}
            <span className="text-sm truncate max-w-[200px]" title={fileData.originalName}>
              {fileData.originalName}
            </span>
            {fileData.fileUrl && (
              <a
                href={fileData.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-primary hover:underline flex-shrink-0"
              >
                <Download className="h-3 w-3" />
              </a>
            )}
          </div>
        )
      }
      return <span className="text-sm text-muted-foreground">-</span>

    case "number":
    case "slider":
      return <span className="text-sm font-medium">{String(value)}</span>

    case "email":
      return (
        <a
          href={`mailto:${value}`}
          onClick={(e) => e.stopPropagation()}
          className="text-sm text-primary hover:underline"
        >
          {String(value)}
        </a>
      )

    case "phone":
      return <span className="text-sm">{formatPhone(String(value))}</span>

    default:
      const strValue = String(value)
      if (strValue.length > 150) {
        return (
          <div className="text-sm truncate max-w-[300px]" title={strValue}>
            {strValue.substring(0, 150)}...
          </div>
        )
      }
      return <div className="text-sm break-words">{strValue}</div>
  }
}

export function ResponsesTableMonday({
  responses,
  form,
  onViewDetails,
  selectedIds = [],
  onSelectionChange,
  className,
}: ResponsesTableMondayProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "created_at", desc: true },
  ])

  const schema = Array.isArray(form.schema_json) ? form.schema_json : []
  
  // Filtrer uniquement les blocs qui peuvent avoir des réponses (pas welcome, heading, paragraph)
  const questionBlocks = schema.filter(
    (block) =>
      !["welcome", "heading", "paragraph", "youtube", "menu-restaurant"].includes(block.type)
  )

  const columns = React.useMemo<ColumnDef<Response>[]>(() => {
    const baseColumns: ColumnDef<Response>[] = [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Sélectionner tout"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Sélectionner la ligne"
            onClick={(e) => e.stopPropagation()}
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 50,
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 font-semibold"
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-sm font-medium">
            {formatResponseDate(row.getValue("created_at"))}
          </div>
        ),
        size: 150,
      },
    ]

    // Colonnes dynamiques pour chaque question
    const questionColumns: ColumnDef<Response>[] = questionBlocks.map((block) => ({
      id: `question-${block.id}`,
      accessorFn: (row) => {
        const answers = row.answers_json || {}
        return answers[block.id]
      },
      header: () => (
        <div className="font-semibold text-sm">
          {block.label || `Question ${block.id.slice(0, 8)}`}
        </div>
      ),
      cell: ({ row }) => {
        const answers = row.original.answers_json || {}
        const value = answers[block.id]
        return (
          <div className="min-w-[150px] max-w-[300px]">
            {renderCellValue(value, block)}
          </div>
        )
      },
      size: 200,
    }))

    // Colonnes finales
    const finalColumns: ColumnDef<Response>[] = [
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails(row.original)
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            Voir
          </Button>
        ),
        enableSorting: false,
        size: 100,
      },
    ]

    return [...baseColumns, ...questionColumns, ...finalColumns]
  }, [questionBlocks, onViewDetails])

  const table = useReactTable({
    data: responses,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableRowSelection: true,
    getRowId: (row) => row.id,
    onRowSelectionChange: (updater) => {
      if (onSelectionChange) {
        if (typeof updater === "function") {
          const currentSelection = Object.fromEntries(
            selectedIds.map((id) => [id, true])
          )
          const newSelection = updater(currentSelection)
          const selectedIdsArray = Object.keys(newSelection).filter(
            (key) => newSelection[key]
          )
          onSelectionChange(selectedIdsArray)
        }
      }
    },
    state: {
      sorting,
      rowSelection: Object.fromEntries(selectedIds.map((id) => [id, true])),
    },
  })

  if (responses.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Aucune réponse disponible
      </div>
    )
  }

  return (
    <div className={cn("rounded-lg border bg-white shadow-sm", className)}>
      <div className="overflow-x-auto max-h-[calc(100vh-300px)]">
        <Table>
          <TableHeader className="sticky top-0 z-20">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/80 backdrop-blur-sm border-b">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-semibold text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                    style={{
                      minWidth: header.getSize(),
                      width: header.getSize(),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "hover:bg-muted/20 transition-colors border-b",
                    row.getIsSelected() && "bg-primary/5"
                  )}
                  onClick={() => onViewDetails(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-3"
                      onClick={(e) => {
                        if (
                          (e.target as HTMLElement).closest("button") ||
                          (e.target as HTMLElement).closest("[role='checkbox']") ||
                          (e.target as HTMLElement).closest("a")
                        ) {
                          e.stopPropagation()
                        }
                      }}
                      style={{
                        minWidth: cell.column.getSize(),
                        width: cell.column.getSize(),
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucune réponse
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

