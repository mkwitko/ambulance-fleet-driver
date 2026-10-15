import { cn } from "@/src/lib/utils";
import React from "react";
import { TextInput, TextInputProps } from "react-native";
import { tv } from "tailwind-variants";

const input = tv({
  base: "w-full rounded-xl px-4 py-3 border text-foreground shadow-card font-sans",
  variants: {
    variant: {
      default: "bg-white border-gray-200",
      error: "bg-white border-error",
      disabled: "bg-gray-100 text-gray-400 border-gray-100",
      ghost: "bg-transparent border-transparent shadow-none",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface InputProps extends TextInputProps {
  variant?: "default" | "error" | "disabled" | "ghost";
  className?: string;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ variant, className, ...props }, ref) => (
    <TextInput
      ref={ref}
      className={cn(input({ variant, className }))}
      placeholderTextColor="#94a3b8"
      {...props}
    />
  )
);

Input.displayName = "Input";
