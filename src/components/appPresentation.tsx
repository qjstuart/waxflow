import type { ComponentProps } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const eyebrowVariants = cva(
  "font-mono text-xs tracking-widest uppercase",
  {
    variants: {
      tone: {
        default: "text-eyebrow",
        hero: "text-brand-orange-soft",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
)

type EyebrowProps = ComponentProps<"p"> &
  VariantProps<typeof eyebrowVariants>

export function Eyebrow({ className, tone, ...props }: EyebrowProps) {
  return (
    <p className={cn(eyebrowVariants({ tone }), className)} {...props} />
  )
}

export function Wordmark({ className, ...props }: ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "font-mono text-lg font-medium tracking-tighter no-underline",
        className,
      )}
      {...props}
    >
      waxflow
    </a>
  )
}
