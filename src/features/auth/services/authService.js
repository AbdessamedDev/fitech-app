export async function loginUser(emailOrUserName, password) {
  if (emailOrUserName === "Admin@fitteck.com" && password === "Admin@12345") {
    return {
      Success: true,
      Data: { Succeeded: true, Token: "mock-token-admin", role: "admin" }
    };
  }
  if (emailOrUserName === "Coach@fitteck.com" && password === "Coach@12345") {
    return {
      Success: true,
      Data: { Succeeded: true, Token: "mock-token-coach", role: "coach" }
    };
  }
  throw new Error("Login failed");
}