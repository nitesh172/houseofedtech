import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-none border border-transparent px-2 py-0.5 text-xs font-medium uppercase tracking-wider transition-colors focus:outline-none focus:ring-1 focus:ring-ring",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "border-border bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20",
        outline: "border-border text-foreground bg-transparent hover:bg-muted/50",
        amber:
          "border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
        purple:
          "border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20",
        emerald:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20",
      },
      size: {
        default: "h-5 text-xs px-2",
        sm: "h-4 text-[10px] px-1.5",
        lg: "h-6 text-xs px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
