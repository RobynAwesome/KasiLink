import type { Instrumentation } from "next";
import { braintrustEnabled, braintrustLogger } from "@/lib/braintrust";

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { registerOTel } = await import("@vercel/otel");
  registerOTel("kasi-link");
}

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  if (!braintrustEnabled || !braintrustLogger) return;

  try {
    await braintrustLogger.traced(
      async () => {},
      {
        name: "next.request.error",
        type: "task",
        event: {
          input: {
            request: {
              path: request.path,
              method: request.method,
            },
          },
          metadata: {
            routePath: context.routePath,
            routeType: context.routeType,
            routerKind: context.routerKind,
            renderSource: context.renderSource,
            revalidateReason: context.revalidateReason,
          },
          error: error instanceof Error ? error.message : String(error),
        },
      },
    );
  } catch (telemetryError) {
    console.error("[instrumentation.onRequestError]", telemetryError);
  }
};
