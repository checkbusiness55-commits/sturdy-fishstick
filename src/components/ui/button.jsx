import * as React from "react"

const Button = React.forwardRef(({ className, variant = "default", size = "md", ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-app-accent disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-muted",
    ghost: "hover:bg-muted text-foreground",
  };
  
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
export const buttonVariants = (props) => '';
