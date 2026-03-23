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
