import * as aiSdk from "ai";
import { initLogger, wrapAISDK } from "braintrust";

const projectName = "KasiLink";

function getFirstEnv(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.trim()) return value.trim();
  }
  return undefined;
}

const apiKey = getFirstEnv(
  "OBSERVATION_BRAINTRUST_API_KEY",
  "BRAINTRUST_API_KEY",
  "NEXT_PUBLIC_BRAINTRUST_API_KEY",
);

const projectId = getFirstEnv(
  "OBSERVATION_BRAINTRUST_PROJECT_ID",
  "BRAINTRUST_PROJECT_ID",
);

export const braintrustEnabled = Boolean(apiKey);
export const braintrustProjectId = projectId;

export const braintrustLogger = braintrustEnabled
  ? initLogger({
      apiKey,
      projectId,
      projectName,
      setCurrent: true,
    })
  : null;

export const braintrustAI = wrapAISDK(aiSdk);
