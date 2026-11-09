export const getDashboardData = async () => {
  const res = await fetch("/data/dashboard.json");

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return res.json();
};

export const getUsers = async () => {
  const res = await fetch("/data/users.json");

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
};

export type UpdateUserInput = Pick<
  User,
  "name" | "status" | "email" | "company"
>;

import type { User } from "../types";

// A small local API adapter makes the demo's write path explicit and keeps
// the UI independent of its persistence mechanism. Changes persist per browser.
const USER_OVERRIDES_KEY = "meridian:user-overrides:v1";
const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

const readOverrides = (): Record<number, Partial<User>> => {
  try {
    return JSON.parse(localStorage.getItem(USER_OVERRIDES_KEY) ?? "{}");
  } catch {
    return {};
  }
};

export const updateUser = async (
  id: number,
  input: UpdateUserInput,
): Promise<User> => {
  await wait(350);
  const users = (await getUsers()) as User[];
  const user = users.find((item) => item.id === id);
  if (!user)
    throw new Error("This user no longer exists. Refresh and try again.");
  const updated = { ...user, ...readOverrides()[id], ...input };
  localStorage.setItem(
    USER_OVERRIDES_KEY,
    JSON.stringify({ ...readOverrides(), [id]: input }),
  );
  return updated;
};

export const getUsersWithOverrides = async (): Promise<User[]> => {
  const users = (await getUsers()) as User[];
  const overrides = readOverrides();
  return users.map((user) => ({ ...user, ...overrides[user.id] }));
};
