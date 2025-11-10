"use client"

import * as React from "react"
import { FormCard } from "./FormCard"
import { EmptyForms } from "./EmptyForms"
import { Skeleton } from "@/components/ui/skeleton"
import type { Form } from "@/types"

interface FormListProps {
  forms: Form[]
  responseCounts: Record<string, number>
  loading?: boolean
  onEdit: (id: string) => void
  onPreview: (id: string) => void
  onShare: (id: string) => void
  onViewResponses: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

export function FormList({
  forms,
  responseCounts,
  loading = false,
  onEdit,
  onPreview,
  onShare,
  onViewResponses,
  onDuplicate,
  onDelete,
}: FormListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-[14px]" />
        ))}
      </div>
    )
  }

  if (forms.length === 0) {
    return <EmptyForms />
  }

  return (
    <div className="space-y-3">
      {forms.map((form, index) => (
        <div
          key={form.id}
          className="animate-slide-in-up"
          style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
        >
          <FormCard
            form={form}
            responseCount={responseCounts[form.id] || 0}
            onEdit={onEdit}
            onPreview={onPreview}
            onShare={onShare}
            onViewResponses={onViewResponses}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  )
}

