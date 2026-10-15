import { cn } from "@/src/lib/utils";
import React from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { tv } from "tailwind-variants";
import { Typography } from "./typography";

const button = tv({
  base: "w-full rounded-xl items-center justify-center shadow-card active:opacity-80",
  variants: {
    variant: {
      primary: "bg-primary",
      secondary: "bg-secondary",
      outline: "border border-primary bg-transparent",
      ghost: "bg-transparent",
      destructive: "bg-destructive",
    },
    size: {
      sm: "py-2 px-3",
      md: "py-3 px-4",
      lg: "py-4 px-6",
    },
    disabled: {
      true: "opacity-60",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

const text = tv({
  base: "font-semibold text-base",
  variants: {
    variant: {
      primary: "text-white",
      secondary: "text-white",
      outline: "text-primary",
      ghost: "text-primary",
      destructive: "text-white",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * 🔘 Botão padrão do design system
 * - Integra-se com `Typography`
 * - Suporte a loading, variantes e tamanhos
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading,
  disabled,
  variant,
  size,
  className,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      className={cn(button({ variant, size, disabled, className }))}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Typography
          variant="button"
          align="center"
          weight="semibold"
          tone={
            variant === "outline" || variant === "ghost" ? "default" : "muted"
          }
          className={cn(text({ variant }))}
        >
          {title}
        </Typography>
      )}
    </TouchableOpacity>
  );
};
