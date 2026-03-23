type LoginPayload = {
  email: string;
  password: string;
};

export const loginApi = async ({ email, password }: LoginPayload) => {
  // simulate delay
  await new Promise((res) => setTimeout(res, 800));

  if (email === "admin@example.com" && password === "123456") {
    return {
      token: "fake-jwt-token",
      user: {
        name: "Admin",
        email,
      },
    };
  }

  throw new Error("Invalid credentials");
};
