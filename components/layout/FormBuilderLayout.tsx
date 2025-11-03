"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

interface FormBuilderLayoutProps {
  children?: React.ReactNode
  leftPanel: React.ReactNode
  centerPanel: React.ReactNode
  rightPanel: React.ReactNode
  selectedBlockId?: string | null
  onBlockDeselect?: () => void
  leftCollapsed?: boolean
  onLeftCollapsedChange?: (collapsed: boolean) => void
}

export function FormBuilderLayout({
  leftPanel,
  centerPanel,
  rightPanel,
  selectedBlockId,
  onBlockDeselect,
  leftCollapsed: externalLeftCollapsed,
  onLeftCollapsedChange,
}: FormBuilderLayoutProps) {
  const [internalLeftCollapsed, setInternalLeftCollapsed] = React.useState(false)
  const [mobileLeftOpen, setMobileLeftOpen] = React.useState(false)
  const [mobileRightOpen, setMobileRightOpen] = React.useState(false)

  // Utiliser l'état externe s'il est fourni, sinon l'état interne
  const leftCollapsed = externalLeftCollapsed !== undefined ? externalLeftCollapsed : internalLeftCollapsed
  const setLeftCollapsed = React.useCallback((collapsed: boolean) => {
    if (onLeftCollapsedChange) {
      onLeftCollapsedChange(collapsed)
    } else {
      setInternalLeftCollapsed(collapsed)
    }
  }, [onLeftCollapsedChange])

  // Panneau droit : s'ouvre automatiquement quand un bloc est sélectionné, se ferme quand aucun bloc
  const rightCollapsed = !selectedBlockId

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background">
      {/* Left Panel - Blocks */}
      <>
        {/* Desktop */}
        <aside
          className={cn(
            "hidden lg:flex flex-col border-r bg-background transition-all duration-200",
            leftCollapsed ? "w-0 overflow-hidden" : "w-80"
          )}
        >
          {/* Header avec bouton Blocs */}
          <div className="flex items-center justify-between p-3 border-b bg-muted/50">
            <h2 className="text-sm font-semibold">Blocs</h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setLeftCollapsed(!leftCollapsed)}
              title={leftCollapsed ? "Ouvrir les blocs" : "Fermer les blocs"}
            >
              {leftCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">{leftPanel}</div>
        </aside>

        {/* Mobile */}
        <Sheet open={mobileLeftOpen} onOpenChange={setMobileLeftOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden fixed top-4 left-4 z-50"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <div className="p-4">{leftPanel}</div>
          </SheetContent>
        </Sheet>
      </>

      {/* Center Panel - Canvas */}
      <main 
        className="flex-1 overflow-y-auto bg-muted/30"
        onClick={(e) => {
          // Si on clique sur le canvas (pas sur un bloc), désélectionner
          if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.canvas-area')) {
            onBlockDeselect?.()
          }
        }}
      >
        <div className="min-h-full p-6 canvas-area">{centerPanel}</div>
      </main>

      {/* Right Panel - Properties */}
      <>
        {/* Desktop */}
        {!rightCollapsed && (
          <aside className="hidden lg:flex flex-col border-l bg-background transition-all duration-200 w-96">
            <div className="flex items-center justify-between p-3 border-b bg-muted/50">
              <h2 className="text-sm font-semibold">Propriétés</h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onBlockDeselect?.()}
                title="Fermer"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{rightPanel}</div>
          </aside>
        )}

        {/* Mobile */}
        <Sheet open={mobileRightOpen} onOpenChange={setMobileRightOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden fixed top-4 right-4 z-50"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-96 p-0">
            <div className="p-4">{rightPanel}</div>
          </SheetContent>
        </Sheet>
      </>
    </div>
  )
}

