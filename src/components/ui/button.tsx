import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/src/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[2px] text-[12px] font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-[1px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-sand hover:bg-primary/90",
        destructive:
          "bg-red-500 text-white hover:bg-red-500/90",
        outline:
          "border border-primary bg-transparent text-primary hover:bg-primary hover:text-sand",
        secondary:
          "bg-accent text-white hover:bg-accent/90",
        ghost: "hover:bg-primary/10",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-[20px] py-[12px]",
        sm: "h-9 px-4",
        lg: "px-[24px] py-[14px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
