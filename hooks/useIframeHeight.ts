"use client"

import { useEffect, useRef } from "react"

/**
 * Hook pour gérer l'auto-height dans les iframes
 * Envoie la hauteur du contenu au parent via postMessage
 */
export function useIframeHeight() {
  const containerRef = useRef<HTMLDivElement>(null)
  const lastHeightRef = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Vérifier si on est dans un iframe
    const isInIframe = typeof window !== "undefined" && window.parent !== window

    if (!isInIframe || !containerRef.current) {
      return
    }

    // Fonction pour envoyer la hauteur
    const sendHeight = () => {
      if (!containerRef.current) return

      const height = containerRef.current.scrollHeight
      // Récupérer l'iframeId depuis l'URL ou depuis l'iframe parent
      const searchParams = new URLSearchParams(window.location.search)
      const iframeId = searchParams.get("iframeId") || 
        (window.frameElement && (window.frameElement as HTMLIFrameElement).id) || 
        null

      // Ne pas envoyer si la hauteur n'a pas changé significativement
      if (Math.abs(height - lastHeightRef.current) < 5) {
        return
      }

      lastHeightRef.current = height

      try {
        window.parent.postMessage(
          {
            type: "form-height",
            height,
            iframeId,
          },
          "*" // En production, spécifier l'origine exacte pour la sécurité
        )
      } catch (error) {
        console.error("Erreur lors de l'envoi de la hauteur:", error)
      }
    }

    // Fonction debounced pour limiter les messages
    const debouncedSendHeight = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(sendHeight, 100)
    }

    // Envoyer la hauteur initiale
    sendHeight()

    // Utiliser ResizeObserver pour détecter les changements
    let resizeObserver: ResizeObserver | null = null

    if (typeof ResizeObserver !== "undefined" && containerRef.current) {
      resizeObserver = new ResizeObserver(debouncedSendHeight)
      resizeObserver.observe(containerRef.current)
    }

    // Écouter les changements de scroll
    const handleScroll = () => {
      debouncedSendHeight()
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", debouncedSendHeight)

    // Nettoyage
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", debouncedSendHeight)
    }
  }, [])

  return containerRef
}

