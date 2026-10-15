import { useEffect, useState } from "react";
import { useGetAmbulances } from "../http/generated/ambulance/ambulance";
import {
  GetAmbulances200DataItem,
  GetDriversUser200,
} from "../http/generated/api.schemas";

export default function useAmbulances({
  user,
}: {
  user: GetDriversUser200 | undefined;
}) {
  const [ambulance, setAmbulance] = useState<GetAmbulances200DataItem | null>(
    null,
  );

  const { data: ambulances, isLoading: isLoadingAmbulance } = useGetAmbulances(
    {
      companiesId: [user?.companies.id as string],
    },
    {
      query: {
        enabled: !!user && !!user.companies.id,
      },
    },
  );

  useEffect(() => {
    if (user?.driverAssociation[0]?.ambulance) {
      setAmbulance(
        user.driverAssociation[0].ambulance as GetAmbulances200DataItem,
      );
    } else {
      setAmbulance(null);
    }
  }, [user?.driverAssociation[0]?.ambulance]);

  return {
    ambulances,
    isLoadingAmbulance,
    ambulance,
    setAmbulance,
  };
}
