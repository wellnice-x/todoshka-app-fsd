import supabase from "../api/supabaseClient";
import { tasksService } from "./tasksService";

const deleteServerUserData = async (): Promise<void> => {
  await tasksService.deleteAll();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Supabase sign out failed: ", error);
    throw error;
  }
};

export default deleteServerUserData;
