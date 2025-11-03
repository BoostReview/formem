"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { FormTemplate, getTemplatesByLayout } from "@/lib/templates"
import { FormLayout } from "@/types"
import { Sparkles, FileText, Contact, UserPlus, MessageSquare, Calendar } from "lucide-react"

const categoryIcons: Record<string, any> = {
  Sondage: Sparkles,
  Contact: Contact,
  Inscription: UserPlus,
  Feedback: MessageSquare,
  Événement: Calendar,
}

interface TemplateSelectorProps {
  layout: FormLayout
  selectedTemplateId: string | null
  onSelectTemplate: (template: FormTemplate | null) => void
}

export function TemplateSelector({
  layout,
  selectedTemplateId,
  onSelectTemplate,
}: TemplateSelectorProps) {
  const templates = getTemplatesByLayout(layout)
  const [hoveredTemplate, setHoveredTemplate] = React.useState<string | null>(null)

  // Grouper par catégorie
  const groupedTemplates = React.useMemo(() => {
    const groups: Record<string, FormTemplate[]> = {}
    templates.forEach((template) => {
      if (!groups[template.category]) {
        groups[template.category] = []
      }
      groups[template.category].push(template)
    })
    return groups
  }, [templates])

  return (
    <div className="space-y-6">
      {/* Option "Vide" */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          className={cn(
            "cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-2",
            selectedTemplateId === null
              ? "border-primary bg-primary/5 shadow-lg"
              : "border-transparent hover:border-primary/50"
          )}
          onClick={() => onSelectTemplate(null)}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="rounded-lg bg-muted p-2">
                <FileText className="h-5 w-5" />
              </div>
              Formulaire vide
            </CardTitle>
            <CardDescription>
              Commencez avec une page blanche et créez votre formulaire de zéro
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Templates par catégorie */}
      {Object.entries(groupedTemplates).map(([category, categoryTemplates], categoryIndex) => {
        const CategoryIcon = categoryIcons[category] || FileText

        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <CategoryIcon className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">{category}</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryTemplates.map((template, templateIndex) => {
                const isSelected = selectedTemplateId === template.id
                const isHovered = hoveredTemplate === template.id

                return (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.2,
                      delay: (categoryIndex * 0.1) + (templateIndex * 0.05),
                    }}
                    whileHover={{ scale: 1.02 }}
                    onHoverStart={() => setHoveredTemplate(template.id)}
                    onHoverEnd={() => setHoveredTemplate(null)}
                  >
                    <Card
                      className={cn(
                        "cursor-pointer transition-all duration-300 relative overflow-hidden",
                        "hover:shadow-xl border-2",
                        isSelected
                          ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20"
                          : "border-transparent hover:border-primary/50",
                        isHovered && "shadow-lg"
                      )}
                      onClick={() => onSelectTemplate(template)}
                    >
                      {/* Effet de brillance au survol */}
                      {isHovered && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"
                          initial={{ x: "-100%" }}
                          animate={{ x: "100%" }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      )}

                      {/* Badge de sélection */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 z-10 rounded-full bg-primary text-primary-foreground p-1.5 shadow-lg"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </motion.div>
                      )}

                      {/* Image de preview si disponible */}
                      {template.previewImage && (
                        <div className="relative w-full aspect-video overflow-hidden bg-muted">
                          <img
                            src={template.previewImage}
                            alt={`Aperçu ${template.name}`}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                      )}

                      <CardHeader className="relative">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Sparkles className="h-4 w-4" />
                            <span>{template.preview}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {template.schema.length} bloc{template.schema.length > 1 ? "s" : ""}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

