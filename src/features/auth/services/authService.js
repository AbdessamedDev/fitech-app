const BASE_URL = "https://isaac091827.alwaysdata.net";

export async function loginUser(emailOrUserName, password) {
  const response = await fetch(`${BASE_URL}/api/User/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      EmailOrUserName: emailOrUserName,
      Password: password,
      ClientId: "web"
    }),
  });

  const data = await response.json();
  console.log("API Response:", data);

  if (!data.Success || !data.Data.Succeeded) {
    throw new Error("Login failed");
  }

  return data;
}