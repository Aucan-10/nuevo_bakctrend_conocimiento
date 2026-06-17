import { supabase } from "../config/supabase.js";

export const checkDatabase = async () => {
  try {
    // Query simple para verificar conexión
    const { data, error } = await supabase.from("users").select("id").limit(1);

    if (error) {
      return { connected: false, error: error.message };
    }

    return { connected: true };
  } catch (err) {
    return { connected: false, error: err.message };
  }
};
