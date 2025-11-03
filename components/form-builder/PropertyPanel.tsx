"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

interface PropertyPanelProps {
  children?: React.ReactNode
  defaultTab?: "fields" | "appearance" | "theme" | "logic"
  className?: string
}

const tabs = [
  { id: "fields", label: "Champs" },
  { id: "appearance", label: "Apparence" },
  { id: "theme", label: "Thème" },
  { id: "logic", label: "Logique" },
] as const

export function PropertyPanel({
  children,
  defaultTab = "fields",
  className,
}: PropertyPanelProps) {
  const [activeTab, setActiveTab] = React.useState(defaultTab)

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header retiré - maintenant géré par FormBuilderLayout */}

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof defaultTab)} className="flex-1 flex flex-col">
        <div className="px-4 pt-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <Separator className="my-4" />

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              {children || (
                <div className="text-sm text-muted-foreground py-8 text-center">
                  Aucune propriété disponible pour "{tab.label}"
                </div>
              )}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  )
}

