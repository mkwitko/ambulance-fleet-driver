import React, { ReactElement } from "react";
import { Control, Controller, FieldError } from "react-hook-form";
import { Text, View } from "react-native";

interface FormFieldProps {
  control: Control<any>;
  name: string;
  error?: FieldError;
  children: (props: {
    value: any;
    onChange: (value: any) => void;
    onBlur: () => void;
  }) => ReactElement;
}

/**
 * FormField - Wrapper genérico do React Hook Form.
 * Flexível, aceita qualquer tipo de input como filho.
 */
export function FormField({
  control,
  name,
  error,
  children,
}: FormFieldProps) {
  return (
    <View className="mb-3">
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value, onBlur } }) =>
          children({ value, onChange, onBlur })
        }
      />

      {error && (
        <Text className="text-error text-sm mt-1">{error.message}</Text>
      )}
    </View>
  );
}
