// Smoke test: verifies Vitest is configured correctly
import { cn } from "./utils";

describe("cn utility", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });
});
