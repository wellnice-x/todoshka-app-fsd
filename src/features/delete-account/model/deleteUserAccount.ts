import { tasksService } from "@/entities/task";
import { supabase } from "@/shared/api";

export const deleteServerUserData = async (): Promise<void> => {
  await tasksService.deleteAll();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Supabase sign out failed: ", error);
    throw error;
  }
};
