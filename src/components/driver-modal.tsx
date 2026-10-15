import KeyboardSpacer from "@/src/components/keyboard-spacer";
import { ModalWrapper } from "@/src/components/modal-wrapper";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Typography } from "@/src/components/ui/typography";
import { GetDriversIntegration200Item } from "@/src/http/generated/api.schemas";
import { COLORS } from "@/src/styles/colors";
import { MaterialIcons } from "@expo/vector-icons";
import Fuse from "fuse.js";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";

interface DriverModalProps {
  visible: boolean;
  onAssociate: (driver: GetDriversIntegration200Item) => void;
  onRemove?: (driver: GetDriversIntegration200Item) => void;
  onClose: () => void;
  drivers: GetDriversIntegration200Item[] | undefined;
  isLoadingDrivers: boolean;
  driverAssociated?: string | null;
}

export const DriverModal: React.FC<DriverModalProps> = ({
  visible,
  onAssociate,
  onRemove,
  onClose,
  drivers,
  isLoadingDrivers,
  driverAssociated,
}) => {
  const [search, setSearch] = useState("");
  const [selectedDriver, setSelectedDriver] =
    useState<GetDriversIntegration200Item | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (driverAssociated) {
      const associated = drivers?.find(
        (driver) => String(driver.IdSocorrista) === driverAssociated,
      );
      setSelectedDriver(associated || null);
    }
  }, [drivers, driverAssociated]);

  /**
   * Fuse instance
   */
  const fuse = useMemo(
    () =>
      new Fuse(drivers || [], {
        keys: ["NomeSocorrista"],
        threshold: 0.3,
        ignoreLocation: true,
      }),
    [drivers],
  );

  /**
   * Filtered list
   */
  const filteredDrivers = useMemo(() => {
    if (!search.trim()) return drivers;
    return fuse.search(search).map((r) => r.item);
  }, [search, fuse, drivers]);

  const handleAssociate = async () => {
    if (selectedDriver) {
      setIsSubmitting(true);
      try {
        await onAssociate(selectedDriver);
        setSelectedDriver(null);
        setSearch("");
        onClose();
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleLogout = async () => {
    if (selectedDriver) {
      setIsSubmitting(true);
      try {
        onRemove && (await onRemove(selectedDriver));
        setSelectedDriver(null);
        setSearch("");
        onClose();
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      maxHeightPct={90}
      icon={
        <View className="items-center mb-6">
          <View className="relative">
            <View className="absolute inset-0 bg-primary-200/30 rounded-full scale-110" />
            <View className="p-6 rounded-full bg-primary-200/50">
              <MaterialIcons
                name="badge"
                size={40}
                color={COLORS.primary.DEFAULT}
              />
            </View>
          </View>
        </View>
      }
      footer={
        <View className="bg-white px-4 pt-4 pb-6 gap-3 border-t border-gray-200">
          {driverAssociated &&
          String(selectedDriver?.IdSocorrista) === driverAssociated ? (
            <Button
              title="Remover Motorista"
              variant="destructive"
              onPress={handleLogout}
              disabled={isSubmitting}
              loading={isSubmitting}
            />
          ) : (
            <Button
              title="Selecionar Motorista"
              onPress={handleAssociate}
              disabled={!selectedDriver || isSubmitting}
              loading={isSubmitting}
            />
          )}
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
      <View className="relative gap-4">
        {/* TÍTULO */}
        <View>
          <Typography
            variant="title"
            weight="bold"
            className="mb-2 text-center"
          >
            Associar Motorista
          </Typography>
          <Typography variant="body" tone="muted" className="text-center">
            Busque e selecione um motorista
          </Typography>
        </View>

        {isLoadingDrivers ? (
          <View className="flex flex-row pb-40 gap-4 justify-center">
            <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
            <Typography tone="muted" className="mt-4">
              Carregando motoristas...
            </Typography>
          </View>
        ) : (
          <>
            {/* SEARCH */}
            <View>
              <View className="border border-gray-200 rounded-xl bg-white px-4 py-2 flex-row items-center">
                <MaterialIcons
                  name="search"
                  size={20}
                  color={COLORS.mutedForeground}
                />
                <Input
                  value={search}
                  variant="ghost"
                  onChangeText={setSearch}
                  placeholder="Buscar por nome"
                  className="flex-1"
                  autoCapitalize="words"
                  editable={!isLoadingDrivers}
                />
              </View>
            </View>
            <FlatList
              data={filteredDrivers}
              keyExtractor={(item) => String(item.IdSocorrista)}
              contentContainerStyle={{ paddingBottom: 120 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
              renderItem={({ item }) => {
                const selected =
                  selectedDriver?.IdSocorrista === item.IdSocorrista;
                return (
                  <Pressable
                    onPress={() =>
                      setSelectedDriver((prev) =>
                        prev?.IdSocorrista === item.IdSocorrista ? null : item,
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
                      name="person"
                      size={22}
                      color={
                        selected
                          ? COLORS.primary.DEFAULT
                          : COLORS.mutedForeground
                      }
                    />
                    <View className="ml-3 flex-1">
                      <Typography weight="semibold">
                        {item.NomeSocorrista}
                      </Typography>
                      {!!item.NomeBase && (
                        <Typography variant="extraSmall" tone="muted">
                          Base: {item.NomeBase}
                        </Typography>
                      )}
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
                  <Typography tone="muted">
                    Nenhum motorista encontrado
                  </Typography>
                </View>
              }
            />
          </>
        )}
        <KeyboardSpacer />
      </View>
    </ModalWrapper>
  );
};
