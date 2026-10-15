import { cn } from "@/src/lib/utils";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, TextInput, TextInputProps, View } from "react-native";
import { tv } from "tailwind-variants";

const input = tv({
  base: "w-full rounded-xl px-4 py-3 border text-foreground shadow-card font-sans pr-12", // espaço extra para o botão
  variants: {
    variant: {
      default: "bg-white border-gray-200",
      error: "bg-white border-error",
      disabled: "bg-gray-100 text-gray-400 border-gray-100",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface SecureInputProps extends TextInputProps {
  variant?: "default" | "error" | "disabled";
  className?: string;
}

export const SecureInput = React.forwardRef<TextInput, SecureInputProps>(
  ({ variant, className, ...props }, ref) => {
    const [secure, setSecure] = useState(true);

    return (
      <View className="relative w-full">
        <TextInput
          ref={ref}
          secureTextEntry={secure}
          className={cn(input({ variant, className }))}
          placeholderTextColor="#94a3b8"
          {...props}
        />

        <Pressable
          onPress={() => setSecure((prev) => !prev)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1"
        >
          <Feather
            name={secure ? "eye-off" : "eye"}
            size={20}
            color="#94a3b8"
          />
        </Pressable>
      </View>
    );
  }
);

SecureInput.displayName = "SecureInput";
