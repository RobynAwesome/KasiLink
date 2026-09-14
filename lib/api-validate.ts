/**
 * lib/api-validate.ts
 * ───────────────────────────────────────────────────────────
 * Zod-based request validation middleware for KasiLink API routes.
 *
 * KC Apprenticeship Phase 2, Task 19
 *
 * Validates request bodies and search parameters against Zod schemas,
 * returning structured 422 Unprocessable Entity responses with
 * field-level errors on validation failure.
 * ───────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from "next/server";
import { z, ZodError, ZodSchema } from "zod";

export interface ValidationSuccess<T> {
  success: true;
  data: T;
}

export interface ValidationFailure {
  success: false;
  response: NextResponse;
  errors: Record<string, string>;
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

/**
 * Format a Zod error into a clean field-to-message map.
 */
export function formatZodErrors(error: ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    const key = path || "_root";
    if (!errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}

/**
 * Validate JSON body of a NextRequest against a Zod schema.
 */
export async function validateBody<T>(
  req: NextRequest,
  schema: ZodSchema<T>,
): Promise<ValidationResult<T>> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return {
      success: false,
      response: NextResponse.json(
        {
          error: "Bad Request",
          message: "Invalid or malformed JSON body.",
          code: "INVALID_JSON",
        },
        { status: 400 },
      ),
      errors: { _root: "Invalid or malformed JSON body." },
    };
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    const fieldErrors = formatZodErrors(result.error);
    return {
      success: false,
      response: NextResponse.json(
        {
          error: "Validation Failed",
          message: "One or more fields failed validation constraints.",
          code: "VALIDATION_FAILED",
          details: fieldErrors,
        },
        { status: 422 },
      ),
      errors: fieldErrors,
    };
  }

  return { success: true, data: result.data };
}

/**
 * Validate search params (query string) of a NextRequest against a Zod schema.
 */
export function validateQuery<T>(
  req: NextRequest,
  schema: ZodSchema<T>,
): ValidationResult<T> {
  const url = req.nextUrl;
  const rawParams: Record<string, string | string[]> = {};

  for (const [key, value] of url.searchParams.entries()) {
    const all = url.searchParams.getAll(key);
    rawParams[key] = all.length > 1 ? all : value;
  }

  const result = schema.safeParse(rawParams);
  if (!result.success) {
    const fieldErrors = formatZodErrors(result.error);
    return {
      success: false,
      response: NextResponse.json(
        {
          error: "Validation Failed",
          message: "Invalid query parameters provided.",
          code: "INVALID_QUERY_PARAMS",
          details: fieldErrors,
        },
        { status: 400 },
      ),
      errors: fieldErrors,
    };
  }

  return { success: true, data: result.data };
}
