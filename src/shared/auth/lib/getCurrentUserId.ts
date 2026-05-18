import supabase from "@/shared/api/supabase/supabaseClient";
import { UserNotFoundError } from "@/shared/lib/errors/auth/UserNotFoundError";

export const getCurrentUserId = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new UserNotFoundError();
  }

  return data.user.id;
};