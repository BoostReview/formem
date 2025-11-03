"use client"

import * as React from "react"
import { motion, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"

type SlideDirection = "up" | "down" | "left" | "right"

interface SlideInProps {
  children: React.ReactNode
  direction?: SlideDirection
  delay?: number
  duration?: number
  className?: string
}

const directionVariants: Record<SlideDirection, Variants> = {
  up: {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  },
  down: {
    hidden: {
      opacity: 0,
      y: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  },
  left: {
    hidden: {
      opacity: 0,
      x: 20,
    },
    visible: {
      opacity: 1,
      x: 0,
    },
  },
  right: {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
    },
  },
}

export function SlideIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.2,
  className,
}: SlideInProps) {
  const variants = directionVariants[direction]

  const finalVariants: Variants = {
    hidden: variants.hidden,
    visible: {
      ...variants.visible,
      transition: {
        delay,
        duration,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={finalVariants}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}


