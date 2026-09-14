import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { z } from "zod";
import { validateBody, validateQuery, formatZodErrors } from "@/lib/api-validate";

describe("lib/api-validate", () => {
  const testSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 chars"),
    age: z.number().min(18, "Must be at least 18"),
    category: z.enum(["repairs", "cleaning"]),
  });

  describe("validateBody", () => {
    it("returns parsed data when body conforms to schema", async () => {
      const validPayload = { title: "House cleaning", age: 25, category: "cleaning" };
      const req = new NextRequest("http://localhost:3000/api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validPayload),
      });

      const result = await validateBody(req, testSchema);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validPayload);
      }
    });

    it("returns 422 with field details when validation fails", async () => {
      const invalidPayload = { title: "Hi", age: 15, category: "invalid" };
      const req = new NextRequest("http://localhost:3000/api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidPayload),
      });

      const result = await validateBody(req, testSchema);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.response.status).toBe(422);
        expect(result.errors.title).toBe("Title must be at least 3 chars");
        expect(result.errors.age).toBe("Must be at least 18");
        expect(result.errors.category).toBeTruthy();
      }
    });

    it("returns 400 when body is malformed JSON", async () => {
      const req = new NextRequest("http://localhost:3000/api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "invalid-json{",
      });

      const result = await validateBody(req, testSchema);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.response.status).toBe(400);
        expect(result.errors._root).toContain("JSON");
      }
    });
  });

  describe("validateQuery", () => {
    const querySchema = z.object({
      suburb: z.string().min(2),
      stage: z.coerce.number().min(0).max(8).optional(),
    });

    it("parses valid query parameters correctly", () => {
      const req = new NextRequest("http://localhost:3000/api/test?suburb=Khayelitsha&stage=2");
      const result = validateQuery(req, querySchema);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.suburb).toBe("Khayelitsha");
        expect(result.data.stage).toBe(2);
      }
    });

    it("returns 400 on invalid query parameters", () => {
      const req = new NextRequest("http://localhost:3000/api/test?suburb=K&stage=12");
      const result = validateQuery(req, querySchema);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.response.status).toBe(400);
        expect(result.errors.suburb).toBeTruthy();
        expect(result.errors.stage).toBeTruthy();
      }
    });
  });
});
