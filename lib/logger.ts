export type LogLevel = "info" | "warn" | "error";

type LogExtras = Record<string, unknown>;

function write(level: LogLevel, entry: LogExtras) {
  const line = JSON.stringify({
    level,
    timestamp: new Date().toISOString(),
    ...entry,
  });

  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.log(line);
}

export function log(
  level: LogLevel,
  route: string,
  action: string,
  extras: LogExtras = {},
): void {
  write(level, { route, action, ...extras });
}
