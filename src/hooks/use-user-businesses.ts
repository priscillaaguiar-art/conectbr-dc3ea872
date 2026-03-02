import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { BusinessRow } from "@/hooks/use-businesses";

export function useMyBusinesses(userId: string | undefined) {
  return useQuery({
    queryKey: ["my-businesses", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as BusinessRow[];
    },
  });
}

export function useUpdateMyBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...fields }: Partial<BusinessRow> & { id: string }) => {
      const { error } = await supabase
        .from("businesses")
        .update({ ...fields, status: "pending" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-businesses"] });
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });
}
