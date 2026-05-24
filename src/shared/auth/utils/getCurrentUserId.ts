import { supabase } from "@/shared/api";
import { UserNotFoundError } from "@/shared/lib/errors";

export const getCurrentUserId = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new UserNotFoundError();
  }

  return data.user.id;
};