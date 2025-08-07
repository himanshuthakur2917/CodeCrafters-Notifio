import * as React from "react"
import { cn } from "@/lib/utils"

interface CopyProps extends React.HTMLAttributes<HTMLSpanElement> {
  content?: string;
}

const Copy = React.forwardRef<
  HTMLSpanElement,
  CopyProps
>(({ className, content, children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  >
    {content || children}
  </span>
))
Copy.displayName = "Copy"

export { Copy }
