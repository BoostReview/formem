import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Helper pour merger des classes (alias de cn pour compatibilité)
 */
export function classNames(...classes: ClassValue[]) {
  return cn(...classes)
}

/**
 * Formate une date selon le locale français
 */
export function formatDate(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === "string" || typeof date === "number" 
    ? new Date(date) 
    : date
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...options,
  }
  
  return new Intl.DateTimeFormat("fr-FR", defaultOptions).format(dateObj)
}

/**
 * Formate une date avec l'heure
 */
export function formatDateTime(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  return formatDate(date, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  })
}

/**
 * Formate un nombre avec séparateurs de milliers
 */
export function formatNumber(
  value: number | string,
  options?: Intl.NumberFormatOptions
): string {
  const numValue = typeof value === "string" ? parseFloat(value) : value
  
  if (isNaN(numValue)) {
    return "0"
  }
  
  const defaultOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }
  
  return new Intl.NumberFormat("fr-FR", defaultOptions).format(numValue)
}

/**
 * Formate un nombre en format monétaire
 */
export function formatCurrency(
  value: number | string,
  currency: string = "EUR"
): string {
  const numValue = typeof value === "string" ? parseFloat(value) : value
  
  if (isNaN(numValue)) {
    return "0,00 €"
  }
  
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(numValue)
}
