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
  website: string | null;
  featured: boolean;
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
        .order("featured", { ascending: false })
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
      type?: string;
      whatsapp?: string;
      instagram?: string;
      phone?: string;
      email?: string;
      photo?: string;
      website?: string;
      owner_id?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke("submit-business", {
        body: business,
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
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

export function useUpdateBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...fields }: { id: string; [key: string]: any }) => {
      const { error } = await supabase
        .from("businesses")
        .update(fields)
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

export function useToggleFeatured() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const { error } = await supabase
        .from("businesses")
        .update({ featured })
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
      return data as { id: string; name: string | null; email: string | null; message: string; created_at: string }[];
    },
  });
}

export function useInsertFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (feedbackData: { name: string | null; email: string; message: string }) => {
      const { data, error } = await supabase.functions.invoke("submit-feedback", {
        body: feedbackData,
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
  });
}
