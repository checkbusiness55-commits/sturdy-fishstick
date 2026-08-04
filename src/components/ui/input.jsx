import * as React from "react"

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => (
  <input
    type={type}
    className={`flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-app-accent disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
    ref={ref}
    {...props}
  />
))
Input.displayName = "Input"

export { Input }