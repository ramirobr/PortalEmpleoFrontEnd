"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-5 shrink-0 border rounded-[4px] border-slate-300 bg-white transition-all duration-300",
        "hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
        "data-[state=checked]:bg-white data-[state=checked]:border-primary data-[state=checked]:text-primary",
        "disabled:cursor-not-allowed disabled:opacity-50 shadow-sm",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current"
      >
        <CheckIcon className="size-4 stroke-[3px]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
