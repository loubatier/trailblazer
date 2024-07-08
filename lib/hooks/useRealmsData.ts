import axios from "axios";
import { isEmpty } from "lodash";
import { useQuery } from "react-query";

const fetchRealmsData = async ({ queryKey }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, { region }] = queryKey;
  try {
    const response = await axios.get(`/api/realms`, {
      params: { region },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

export const useRealmsData = (region: string) => {
  return useQuery(["serversData", { region }], fetchRealmsData, {
    enabled: !isEmpty(region),
    retry: false,
    onError: (error: Error) => error,
  });
};
