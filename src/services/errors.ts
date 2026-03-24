export type ServiceErrorCode =
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "DUPLICATE"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "DATABASE_ERROR"
  | "STORAGE_ERROR"
  | "UNKNOWN";

export class ServiceError extends Error {
  code: ServiceErrorCode;
  details?: Record<string, unknown>;

  constructor(
    message: string,
    code: ServiceErrorCode = "UNKNOWN",
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ServiceError";
    this.code = code;
    this.details = details;
  }
}

/**
 * Map a Supabase error to a ServiceError.
 * Keeps all service error handling consistent.
 */
export function handleSupabaseError(
  error: { code?: string; message?: string },
  fallbackMessage: string
): never {
  // PGRST116 = PostgREST "no rows returned" for .single()
  if (error.code === "PGRST116") {
    throw new ServiceError(fallbackMessage, "NOT_FOUND");
  }
  // 23505 = unique_violation
  if (error.code === "23505") {
    throw new ServiceError(
      error.message || "Duplicate record",
      "DUPLICATE",
      { pgCode: error.code }
    );
  }
  // 42501 = insufficient_privilege
  if (error.code === "42501") {
    throw new ServiceError("Permission denied", "FORBIDDEN");
  }
  throw new ServiceError(
    error.message || fallbackMessage,
    "DATABASE_ERROR",
    { pgCode: error.code }
  );
}
