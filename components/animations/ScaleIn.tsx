"use client"

import * as React from "react"
import { motion, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"

interface ScaleInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.25,
  className,
}: ScaleInProps) {
  const variants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay,
        duration,
        ease: [0.4, 0, 0.2, 1], // cubic-bezier pour animation fluide
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}


