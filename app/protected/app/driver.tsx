import { AblyEvents } from "@/src/@types/ably-events";
import { ActivityCard } from "@/src/components/activity-card";
import { ConfirmActionModal } from "@/src/components/confirm-action-modal";
import { DriverModal } from "@/src/components/driver-modal";
import { Typography } from "@/src/components/ui/typography";
import { VehicleSelectionModal } from "@/src/components/vehicle-selection-modal";
import useAmbulances from "@/src/hooks/use-ambulances";
import useDrivers from "@/src/hooks/use-drivers";
import { GetAmbulances200DataItem } from "@/src/http/generated/api.schemas";
import { useSignOut } from "@/src/http/generated/auth/auth";
import { useGetDriversUser } from "@/src/http/generated/drivers/drivers";
import { queryClient } from "@/src/lib/react-query";
import useAbly from "@/src/services/use-ably";
import { COLORS } from "@/src/styles/colors";
import { MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Driver() {
  const [showVehicleModal, setShowVehicleModal] = React.useState(false);
  const [showDriverModal, setShowDriverModal] = React.useState(false);

  const [confirmSave, setConfirmSave] = React.useState(false);
  const [confirmLogout, setConfirmLogout] = React.useState(false);

  const {
    data: user,
    isLoading: isLoadingUser,
    queryKey: userQueryKey,
  } = useGetDriversUser();

  const handleClearUser = async () => {
    await queryClient.invalidateQueries({
      queryKey: userQueryKey,
    });
  };

  const { ambulances, isLoadingAmbulance, ambulance, setAmbulance } =
    useAmbulances({ user });

  const {
    drivers,
    isLoadingDrivers,
    foundDriver,
    setDriverAssociated,
    handleAssociateDriver,
    handleLogoutDriver,
    isAssociating,
    isLoggingOutDriver,
  } = useDrivers({ ambulance, handleClearUser });

  const { mutateAsync: signOut } = useSignOut();

  const handleLogout = async () => {
    await signOut();
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    queryClient.invalidateQueries();
  };

  const hasChanged =
    user?.driverAssociation[0]?.ambulance?.id !== ambulance?.id ||
    String(user?.logFrotaId) !== String(foundDriver?.IdSocorrista);

  const { publish } = useAbly({});

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-36"
      >
        {/* HEADER */}
        <View className="px-6 pt-8 pb-6 flex-row items-center justify-between">
          <View className="gap-1">
            <Typography variant="title" weight="semibold">
              Ambulance Fleet Driver
            </Typography>
            <Typography variant="subtitle">
              Gestão de motoristas e ambulâncias
            </Typography>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            className="p-2 rounded-full bg-gray-100"
          >
            <MaterialIcons name="logout" size={22} color="#111" />
          </TouchableOpacity>
        </View>

        {/* USER CARD */}
        {user && (
          <View className="mx-6 mb-6 bg-white rounded-2xl p-5 shadow-sm">
            <View className="flex-row items-center gap-4">
              <View className="w-14 h-14 rounded-xl bg-primary-100 items-center justify-center">
                <MaterialIcons
                  name="person"
                  size={28}
                  color={COLORS.primary.DEFAULT}
                />
              </View>

              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">
                  {user.name}
                </Text>
                <Text className="text-sm text-gray-500">
                  Dirigindo:{" "}
                  {user.driverAssociation[0]?.ambulance.name || "N/A"}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ACTIONS */}
        <View className="mx-6 bg-white rounded-2xl p-5 shadow-sm">
          <Typography variant="caption" weight="semibold" className="mb-4">
            Configurações necessárias
          </Typography>

          <View className="gap-4">
            <ActivityCard
              icon="emergency-share"
              title={ambulance?.name || "Selecionar Ambulância"}
              description={
                ambulance?.licensePlate || "Nenhuma ambulância selecionada"
              }
              configured={!!ambulance}
              onPress={() => setShowVehicleModal(true)}
              isLoading={isLoadingUser || isLoadingAmbulance}
            />

            <ActivityCard
              icon="badge"
              title={foundDriver ? "Motorista Vinculado" : "Associar Motorista"}
              description={
                foundDriver
                  ? foundDriver.NomeSocorrista
                  : "Vincule seu perfil de motorista"
              }
              configured={!!foundDriver}
              onPress={() => setShowDriverModal(true)}
              disabled={!ambulance}
            />
          </View>
        </View>
      </ScrollView>

      {/* FOOTER CTA */}
      <View className="gap-4 absolute bottom-0 left-0 right-0 px-6 pb-6 pt-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          disabled={
            !ambulance ||
            !foundDriver ||
            !hasChanged ||
            isAssociating ||
            String(foundDriver.IdSocorrista) !== user?.logFrotaId
          }
          onPress={() => setConfirmSave(true)}
          className="rounded-xl py-4 items-center bg-primary disabled:opacity-50"
        >
          <Text className="text-white font-semibold text-base">Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={
            !user?.driverAssociation ||
            user?.driverAssociation?.length <= 0 ||
            !foundDriver
          }
          onPress={() => setConfirmLogout(true)}
          className="rounded-xl py-4 items-center bg-error disabled:opacity-50"
        >
          <Text className="text-white font-semibold text-base">
            Encerrar Turno
          </Text>
        </TouchableOpacity>
      </View>

      {/* MODALS */}
      {showVehicleModal && (
        <VehicleSelectionModal
          visible={showVehicleModal}
          ambulances={ambulances}
          onSave={(ambulance: GetAmbulances200DataItem) => {
            setAmbulance(ambulance);
            setShowVehicleModal(false);
          }}
          onClose={() => setShowVehicleModal(false)}
        />
      )}

      {showDriverModal && (
        <DriverModal
          visible={showDriverModal}
          drivers={drivers?.filter(
            (d) =>
              d.IdSocorrista === foundDriver?.IdSocorrista ||
              String(d.IdSocorrista) === user?.logFrotaId,
          )}
          isLoadingDrivers={isLoadingDrivers}
          onAssociate={(driver) => {
            setDriverAssociated(String(driver.IdSocorrista));
            setShowDriverModal(false);
          }}
          onClose={() => setShowDriverModal(false)}
        />
      )}

      <ConfirmActionModal
        visible={confirmSave}
        title="Confirmar associação"
        description="Deseja salvar a associação do motorista com a ambulância selecionada?"
        confirmText="Salvar"
        isLoading={isAssociating}
        onCancel={() => setConfirmSave(false)}
        onConfirm={async () => {
          const idTurno = await handleAssociateDriver();
          publish(AblyEvents.driverAssociation, {
            driverId: String(foundDriver?.IdSocorrista),
            ambulanceId: String(ambulance?.id),
            ambulanceName: ambulance?.name,
            idTurno,
          });
          setConfirmSave(false);
        }}
      />

      <ConfirmActionModal
        visible={confirmLogout}
        title="Encerrar turno"
        description="Ao encerrar o turno, o motorista será desvinculado da ambulância. Deseja continuar?"
        confirmText="Encerrar turno"
        variant="danger"
        isLoading={isLoggingOutDriver}
        onCancel={() => setConfirmLogout(false)}
        onConfirm={async () => {
          await handleLogoutDriver();
          publish(AblyEvents.driverAssociation, {
            driverId: String(foundDriver?.IdSocorrista),
            ambulanceId: null,
            ambulanceName: null,
            idTurno: null,
          });
          setConfirmLogout(false);
        }}
      />
    </View>
  );
}
