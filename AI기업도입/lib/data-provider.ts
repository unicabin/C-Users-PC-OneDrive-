export type BackendProvider = "mock" | "supabase" | "firebase";

export type ServiceContext = {
  provider: BackendProvider;
};

export const defaultServiceContext: ServiceContext = {
  provider: "mock",
};

export function withServiceContext<T>(resolver: (context: ServiceContext) => T): T {
  return resolver(defaultServiceContext);
}
