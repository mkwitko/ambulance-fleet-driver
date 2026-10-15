import KeyboardSpacer from "@/src/components/keyboard-spacer";
import { ModalWrapper } from "@/src/components/modal-wrapper";
import { Button } from "@/src/components/ui/button";
import { Typography } from "@/src/components/ui/typography";
import { COLORS } from "@/src/styles/colors";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Pressable, View } from "react-native";

type Company = {
  id: string;
  name: string;
};

interface SelectCompanyModalProps {
  visible: boolean;
  companies: Company[];
  onConfirm: (companyId: string) => Promise<void>;
  onClose: () => void;
  isSubmitting?: boolean;
}

export const SelectCompanyModal: React.FC<SelectCompanyModalProps> = ({
  visible,
  companies,
  onConfirm,
  onClose,
  isSubmitting = false,
}) => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleConfirm = async () => {
    if (!selectedCompany) return;
    await onConfirm(selectedCompany.id);
    setSelectedCompany(null);
  };

  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      maxHeightPct={80}
      icon={
        <View className="items-center mb-6">
          <View className="relative">
            <View className="absolute inset-0 bg-primary-200/30 rounded-full scale-110" />
            <View className="p-6 rounded-full bg-primary-200/50">
              <MaterialIcons
                name="business"
                size={40}
                color={COLORS.primary.DEFAULT}
              />
            </View>
          </View>
        </View>
      }
      footer={
        <View className="bg-white px-4 pt-4 pb-6 gap-3 border-t border-gray-200">
          <Button
            title="Confirmar empresa"
            onPress={handleConfirm}
            disabled={!selectedCompany || isSubmitting}
            loading={isSubmitting}
          />
          <Button
            variant="secondary"
            title="Cancelar"
            onPress={onClose}
            disabled={isSubmitting}
          />
        </View>
      }
      stickyFooter
    >
      <View className="gap-4">
        {/* TÍTULO */}
        <View>
          <Typography
            variant="title"
            weight="bold"
            className="mb-2 text-center"
          >
            Selecione a empresa
          </Typography>
          <Typography variant="body" tone="muted" className="text-center">
            Escolha a empresa para acessar o sistema
          </Typography>
        </View>

        {/* LISTA */}
        <FlatList
          data={companies}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            const selected = selectedCompany?.id === item.id;

            return (
              <Pressable
                onPress={() =>
                  setSelectedCompany((prev) =>
                    prev?.id === item.id ? null : item,
                  )
                }
                disabled={isSubmitting}
                className={`flex-row items-center px-4 py-4 rounded-xl border mb-3 ${
                  selected
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 bg-white"
                } ${isSubmitting ? "opacity-50" : ""}`}
              >
                <MaterialIcons
                  name="business"
                  size={22}
                  color={
                    selected ? COLORS.primary.DEFAULT : COLORS.mutedForeground
                  }
                />
                <View className="ml-3 flex-1">
                  <Typography weight="semibold">{item.name}</Typography>
                </View>
                {selected && (
                  <MaterialIcons
                    name="check-circle"
                    size={20}
                    color={COLORS.primary.DEFAULT}
                  />
                )}
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <View className="py-8 items-center">
              <Typography tone="muted">Nenhuma empresa encontrada</Typography>
            </View>
          }
        />

        <KeyboardSpacer />
      </View>
    </ModalWrapper>
  );
};
