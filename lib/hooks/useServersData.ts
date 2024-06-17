import axios from "axios";
import { isEmpty } from "lodash";
import { useQuery } from "react-query";

const fetchServersData = async ({ queryKey }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, { region }] = queryKey;
  try {
    const response = await axios.get(`/api/servers`, {
      params: { region },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

export const useServersData = (region: string) => {
  return useQuery(["serversData", { region }], fetchServersData, {
    enabled: !isEmpty(region),
    retry: false,
    onError: (error: Error) => error,
  });
};
