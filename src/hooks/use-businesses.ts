import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BusinessRow {
  id: string;
  name: string;
  category: string;
  city: string;
  description: string;
  description_en: string | null;
  whatsapp: string | null;
  instagram: string | null;
  phone: string | null;
  email: string | null;
  photo: string | null;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useApprovedBusinesses() {
  return useQuery({
    queryKey: ["businesses", "approved"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as BusinessRow[];
    },
  });
}

export function useBusinessById(id: string | undefined) {
  return useQuery({
    queryKey: ["businesses", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as BusinessRow;
    },
    enabled: !!id,
  });
}

export function useAllBusinesses() {
  return useQuery({
    queryKey: ["businesses", "all"],
    queryFn: async () => {
      // This will only return approved due to RLS unless authenticated
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as BusinessRow[];
    },
  });
}

export function useInsertBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (business: {
      name: string;
      category: string;
      city: string;
      description: string;
      whatsapp?: string;
      instagram?: string;
      phone?: string;
      email?: string;
    }) => {
      const { data, error } = await supabase
        .from("businesses")
        .insert({ ...business, status: "pending", type: "company" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });
}

export function useUpdateBusinessStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("businesses")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });
}

export function useDeleteBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("businesses")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });
}

export function useFeedbacks() {
  return useQuery({
    queryKey: ["feedbacks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedbacks")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as { id: string; message: string; created_at: string }[];
    },
  });
}

export function useInsertFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string | null; email: string; message: string }) => {
      const { error } = await supabase
        .from("feedbacks")
        .insert({ name: data.name, email: data.email, message: data.message });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
  });
}
