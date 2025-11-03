"use client"

import * as React from "react"
import { motion, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.2,
  className,
}: FadeInProps) {
  const variants: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
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
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}


