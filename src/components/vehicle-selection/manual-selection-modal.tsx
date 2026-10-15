import { GetAmbulances200DataItem } from "@/src/http/generated/api.schemas";
import React from "react";
import { FlatList, Modal, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../ui/button";
import { Typography } from "../ui/typography";
import { VehicleListItem } from "./vehicle-list-item";

interface Props {
  visible: boolean;
  ambulances: GetAmbulances200DataItem[] | undefined;
  onSelect: (ambulance: GetAmbulances200DataItem) => void;
  onClose: () => void;
}

export function ManualSelectionModal({
  visible,
  ambulances,
  onSelect,
  onClose,
}: Props) {
  return (
    <Modal
      animationType="slide"
      visible={visible}
      transparent
      onRequestClose={onClose}
    >
      {/* Fundo semitransparente */}
      <Pressable className="flex-1 bg-black/50" onPress={onClose} />

      {/* Container principal */}
      <SafeAreaView className="absolute bottom-0 w-full bg-white rounded-t-[32px] pt-4 pb-8 shadow-2xl max-h-[85%]">
        {/* Indicador superior */}
        <View className="items-center mb-4">
          <View className="w-12 h-1.5 bg-gray-300 rounded-full mb-2" />
          <Typography variant="title" align="center" className="text-gray-800">
            Selecione um veículo
          </Typography>
          <Typography
            variant="subtitle"
            align="center"
            className="text-gray-500 mt-1"
          >
            Escolha um veículo cadastrado ou feche para voltar
          </Typography>
        </View>

        {/* Lista de veículos */}
        <FlatList
          data={ambulances}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VehicleListItem ambulance={item} onSelect={onSelect} />
          )}
          ItemSeparatorComponent={() => (
            <View className="h-[1px] bg-gray-100" />
          )}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Botão de fechar */}
        <View className="absolute bottom-4 left-0 right-0 px-6">
          <Button
            title="Fechar"
            variant="primary"
            onPress={onClose}
            className="rounded-full"
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
