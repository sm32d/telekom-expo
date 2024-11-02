import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { router } from "expo-router";

interface ServiceInclusion {
  inclusionType: string;
  unitsType: string;
  allowance: string;
  remaining: string;
  unlimited: boolean;
  walletType: string | null;
  guiMetadata: string | null;
}

interface Plan {
  productName: string;
  startDate: string;
  endDate: string;
  inclusions: ServiceInclusion[];
  atuAllowed?: boolean;
}

interface DataBank {
  productName: string;
  startDate: string;
  endDate: string;
  inclusions: ServiceInclusion[];
}

interface ServiceDetailsResponse {
  code: number;
  locale: string;
  message: string;
  data: {
    currentPlan: Plan;
    futurePlans: Plan[] | null;
    addons: any[] | null;
    databank: DataBank;
    acctExpiry: string;
    mainBalance: string;
    serviceType: string;
  };
}

interface ServiceListItem {
  svcId: string;
  alias: string | null;
  mobileNumber: string;
  serialNumber: string;
  plan: string;
  firstName: string | null;
  lastName: string;
  blockNumber: string | null;
  unitNumber: string | null;
  streetName: string | null;
  postcode: string;
  buildingName: string | null;
  contactMobile: string | null;
  email: string | null;
  serviceType: string;
  porting: boolean;
  portStatus: string;
  portNumber: string | null;
  portFrom: string | null;
}

interface ServicesResponse {
  code: number;
  locale: string;
  message: string;
  data: ServiceListItem[];
}

export const useServiceData = () => {
  const { bearerToken } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ServiceListItem | null>(null);
  const [serviceDetails, setServiceDetails] = useState<
    ServiceDetailsResponse["data"] | null
  >(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch services list
      const servicesResponse = await fetch(
        "https://account.eight.com.sg/api/v1/services",
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        },
      );
      const status = servicesResponse.status;
      if (status === 401) {
        router.replace("/login");
      }
      const servicesData: ServicesResponse = await servicesResponse.json();
      console.log("servicesdata", servicesData);

      if (servicesData.code !== 0 || !servicesData.data.length) {
        throw new Error("Failed to fetch services");
      }

      // Store profile data from first service
      setProfileData(servicesData.data[0]);

      // Fetch service details using svcId
      const svcId = servicesData.data[0].svcId;
      const serviceDetailsResponse = await fetch(
        `https://account.eight.com.sg/api/v1/service/${svcId}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        },
      );
      const serviceDetails: ServiceDetailsResponse =
        await serviceDetailsResponse.json();

      if (serviceDetails.code !== 0) {
        throw new Error("Failed to fetch service details");
      }

      setServiceDetails(serviceDetails.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bearerToken) {
      fetchData();
    }
  }, [bearerToken]);

  return {
    loading,
    error,
    profileData,
    serviceDetails,
    refetch: fetchData,
  };
};
