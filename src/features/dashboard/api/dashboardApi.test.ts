import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getUsersWithOverrides, updateUser } from "./dashboardApi";

const sampleUsers = [
  { id: 7, name: "Priya Patel", status: "active", revenue: 175 },
];

describe("user persistence adapter", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => sampleUsers,
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("persists edited account fields and merges them into the next read", async () => {
    const pending = updateUser(7, {
      name: "Priya Sharma",
      email: "priya@example.com",
      company: "Meridian Labs",
      status: "inactive",
    });
    await vi.advanceTimersByTimeAsync(350);
    await expect(pending).resolves.toMatchObject({
      id: 7,
      name: "Priya Sharma",
      status: "inactive",
      revenue: 175,
      company: "Meridian Labs",
    });
    await expect(getUsersWithOverrides()).resolves.toMatchObject([
      { id: 7, name: "Priya Sharma", status: "inactive", company: "Meridian Labs" },
    ]);
  });

  it("returns a recoverable error when the selected user disappeared", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => [] }));
    const pending = updateUser(404, {
      name: "Missing User",
      email: "missing@example.com",
      company: "",
      status: "active",
    });
    const rejection = expect(pending).rejects.toThrow("This user no longer exists");
    await vi.advanceTimersByTimeAsync(350);
    await rejection;
  });
});
