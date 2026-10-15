import { cn } from "@/src/lib/utils";
import React from "react";
import { Text, TextProps } from "react-native";
import { tv } from "tailwind-variants";

// 🎨 Variantes de tipografia refinadas
const typography = tv({
  base: "text-foreground",
  variants: {
    variant: {
      title: "text-2xl font-600 font-[600] leading-tight tracking-tight",
      subtitle: "text-base font-400 leading-normal",
      body: "text-base font-400 leading-relaxed",
      button: "text-base font-600 tracking-wide",
      big: "text-3xl font-700 leading-tight tracking-tight",
      caption: "text-sm font-400 leading-normal",
      small: "text-xs font-400 leading-normal",
      extraSmall: "text-[0.625rem] font-300 leading-tight",
      superSmall: "text-[0.5rem] font-300 leading-tight",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    weight: {
      light: "font-300",
      regular: "font-400",
      medium: "font-500",
      semibold: "font-600",
      bold: "font-700",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      error: "text-destructive",
      success: "text-green-600",
      info: "text-blue-600",
    },
  },
  defaultVariants: {
    variant: "body",
    align: "left",
    weight: "regular",
    tone: "default",
  },
});

export interface TypographyProps extends TextProps {
  variant?:
    | "title"
    | "subtitle"
    | "body"
    | "caption"
    | "button"
    | "small"
    | "big"
    | "extraSmall"
    | "superSmall";
  align?: "left" | "center" | "right";
  weight?: "light" | "regular" | "medium" | "semibold" | "bold";
  tone?: "default" | "muted" | "error" | "success" | "info";
  className?: string;
}

/**
 * 💬 Componente de tipografia padronizado
 * - Usa Tailwind Variants para consistência tipográfica
 * - Permite controle fino de estilo, peso, alinhamento e tom
 */
export const Typography: React.FC<TypographyProps> = ({
  variant,
  align,
  weight,
  tone,
  className,
  children,
  ...props
}) => {
  return (
    <Text
      className={cn(typography({ variant, align, weight, tone }), className)}
      {...props}
    >
      {children}
    </Text>
  );
};
