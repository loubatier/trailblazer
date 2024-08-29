import { useEffect, useState } from "react";
import { Database } from "../../data/supabase";
import { supabase } from "../supabaseClient";

type TableName = keyof Database["public"]["Tables"];

type ColumnFilter<T extends TableName> = {
  [K in keyof Database["public"]["Tables"][T]["Row"]]: {
    column: K;
    value: Database["public"]["Tables"][T]["Row"][K];
  };
}[keyof Database["public"]["Tables"][T]["Row"]];

export const useRealtime = <T extends TableName>(
  tableName: T,
  filter?: ColumnFilter<T>
) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!tableName) {
      setIsError(true);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        let query = supabase.from(tableName).select("*");

        if (filter) {
          query = query.eq(filter.column as string, filter.value);
        }

        const { data, error } = await query;

        if (error) throw error;
        setData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchData();

    const subscription = supabase
      .channel(tableName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: tableName },
        () => {
          //   console.log(`Change received for ${tableName}: `, payload);
          fetchData(); // Refetch data on any changes
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [tableName]);

  return { data, isLoading, isError };
};
