import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Profile {
  id: string;
  full_name: string | null;
  grade: string | null;
  school: string | null;
  interested_majors: string[] | null;
  social_media: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  } | null;
  personal_website: string | null;
}

export function useProfile() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      console.log("Fetching profile for user:", user.id);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle(); // Changed from .single() to .maybeSingle()

      if (error) {
        console.error("Error fetching profile:", error);
        setError(error.message);
        return null;
      }

      console.log("Profile data:", data);
      return data as Profile | null;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (updatedProfile: Partial<Profile>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      console.log("Updating profile for user:", user.id, "with data:", updatedProfile);

      const { data, error } = await supabase
        .from("profiles")
        .upsert({ // Changed from update to upsert
          id: user.id,
          ...updatedProfile
        })
        .select()
        .single();

      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
      
      console.log("Profile updated successfully:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Failed to update profile");
      setError(error.message);
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile,
  };
}