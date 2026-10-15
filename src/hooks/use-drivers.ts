import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { GetDriversUser200DriverAssociationItemAmbulance } from "../http/generated/api.schemas";
import {
  useAssociateDriver,
  useGetCurrentDriver,
  useGetDriversIntegration,
  useLogoutDriver,
} from "../http/generated/drivers/drivers";
import { queryClient } from "../lib/react-query";

export default function useDrivers({
  ambulance,
  handleClearUser,
}: {
  ambulance: GetDriversUser200DriverAssociationItemAmbulance | null;
  handleClearUser: () => void;
}) {
  const [driverAssociated, setDriverAssociated] = useState<string>();

  const { data: drivers, isLoading: isLoadingDrivers } =
    useGetDriversIntegration(
      {
        ambulanceId: ambulance?.id as string,
        isDriver: "true",
      },
      {
        query: {
          enabled: !!ambulance?.id,
        },
      },
    );

  const { data: currentDriver, queryKey } = useGetCurrentDriver(
    {
      ambulanceId: ambulance?.id as string,
      isDriver: "true",
    },
    {
      query: {
        enabled: !!ambulance?.id,
      },
    },
  );

  const { mutateAsync: associateDriver, isPending: isAssociating } =
    useAssociateDriver();
  const { mutateAsync: logoutDriver, isPending: isLoggingOutDriver } =
    useLogoutDriver();

  const handleAssociateDriver = async () => {
    const response = await associateDriver({
      data: {
        logFrotaId: driverAssociated as string,
        ambulanceId: ambulance?.id as string,
        isDriver: true,
      },
    });
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: queryKey,
      }),
      handleClearUser(),
    ]);
    Toast.show({
      type: "success",
      text1: "Sucesso!",
      text2: response.message,
    });

    return response.idTurno;
  };

  const handleLogoutDriver = async () => {
    if (!currentDriver) return;
    await logoutDriver({
      data: {
        id: currentDriver.id,
        idTurno: currentDriver.idTurno,
        ambulanceId: ambulance?.id as string,
        isDriver: "true",
      },
    });
    setDriverAssociated(undefined);
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: queryKey,
      }),
      handleClearUser(),
    ]);
  };

  useEffect(() => {
    if (currentDriver) setDriverAssociated(String(currentDriver.logFrotaId));
    else {
      setDriverAssociated(undefined);
    }
  }, [currentDriver]);

  const foundDriver = drivers?.find(
    (d) => String(d.IdSocorrista) === (driverAssociated as string),
  );

  return {
    driverAssociated,
    setDriverAssociated,
    drivers,
    isLoadingDrivers,
    currentDriver,
    foundDriver,
    handleAssociateDriver,
    handleLogoutDriver,
    isAssociating,
    isLoggingOutDriver,
  };
}
