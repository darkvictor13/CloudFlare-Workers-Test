import { PostgrestClient } from "@supabase/postgrest-js";

class SingletonPostgrestClient {
  private static instance: PostgrestClient;

  private constructor() {}

  public static build(end_point: string) {
    SingletonPostgrestClient.instance = new PostgrestClient(end_point);
  }

  public static getInstance(): PostgrestClient {
    if (!SingletonPostgrestClient.instance) {
      throw new Error("PostgrestClient not initialized");
    }
    return SingletonPostgrestClient.instance;
  }
}

export default SingletonPostgrestClient;