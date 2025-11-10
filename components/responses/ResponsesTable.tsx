"use client"

import * as React from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { Response, Form } from "@/types"
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
import { Eye, ArrowUpDown } from "lucide-react"
import { formatResponseDate, formatPhone, getAnswersPreview } from "@/lib/formatters/formatResponse"
import { cn } from "@/lib/utils"

interface ResponsesTableProps {
  responses: Response[]
  form: Form
  onViewDetails: (response: Response) => void
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  className?: string
}

export function ResponsesTable({
  responses,
  form,
  onViewDetails,
  selectedIds = [],
  onSelectionChange,
  className,
}: ResponsesTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "created_at", desc: true },
  ])

  const schema = Array.isArray(form.schema_json) ? form.schema_json : []

  const columns = React.useMemo<ColumnDef<Response>[]>(
    () => [
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
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-8 px-2 lg:px-3"
            >
              Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          return (
            <div className="text-sm">
              {formatResponseDate(row.getValue("created_at"))}
            </div>
          )
        },
      },
      {
        accessorKey: "email",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-8 px-2 lg:px-3"
            >
              Email
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          const email = row.getValue("email") as string | null
          return <div className="text-sm">{email || "-"}</div>
        },
      },
      {
        accessorKey: "phone_e164",
        header: "Téléphone",
        cell: ({ row }) => {
          const phone = (row.original.phone_e164 || row.original.phone_raw) as
            | string
            | null
          return <div className="text-sm">{formatPhone(phone)}</div>
        },
      },
      {
        accessorKey: "source",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-8 px-2 lg:px-3"
            >
              Source
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          const source = row.getValue("source") as "link" | "embed"
          return (
            <Badge variant={source === "link" ? "default" : "secondary"}>
              {source === "link" ? "Lien" : "Intégration"}
            </Badge>
          )
        },
      },
      {
        id: "utm",
        header: "UTM",
        cell: ({ row }) => {
          const utm = row.original.utm_json
          if (!utm || (!utm.utm_source && !utm.utm_medium && !utm.utm_campaign)) {
            return <div className="text-sm text-muted-foreground">-</div>
          }
          const parts = [
            utm.utm_source,
            utm.utm_medium,
            utm.utm_campaign,
          ].filter(Boolean)
          return (
            <div className="text-sm max-w-[200px] truncate" title={parts.join(" / ")}>
              {parts.join(" / ")}
            </div>
          )
        },
      },
      {
        id: "answers",
        header: "Réponses",
        cell: ({ row }) => {
          const answers = row.original.answers_json || {}
          const preview = getAnswersPreview(answers, schema, 80)
          return (
            <div className="text-sm text-muted-foreground max-w-[300px] truncate" title={preview}>
              {preview}
            </div>
          )
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(row.original)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Voir
            </Button>
          )
        },
      },
    ],
    [schema, onViewDetails]
  )

  const table = useReactTable({
    data: responses,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    enableRowSelection: true,
    getRowId: (row) => row.id, // Utiliser l'ID de la réponse au lieu de l'index
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
    <div className={cn("rounded-md border", className)}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
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
                className="cursor-pointer"
                onClick={() => onViewDetails(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    onClick={(e) => {
                      // Ne pas ouvrir le modal si on clique sur la checkbox ou le bouton
                      if (
                        (e.target as HTMLElement).closest("button") ||
                        (e.target as HTMLElement).closest("[role='checkbox']")
                      ) {
                        e.stopPropagation()
                      }
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
  )
}

