export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function removeToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUserRole() {
  return localStorage.getItem("role");
}

export function saveRole(role) {
  localStorage.setItem("role", role);
}

export function saveRefreshToken(refreshToken) {
  localStorage.setItem("refreshToken", refreshToken);
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

export function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getStoredUser() {
  const user = localStorage.getItem("user");

  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function decodeJwt(token) {
  if (!token) return null;

  try {
    const [, payload] = token.split(".");
    const normalizedPayload = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payload.length / 4) * 4, "=");
    const decodedPayload = atob(normalizedPayload);
    const jsonPayload = decodeURIComponent(
      decodedPayload
        .split("")
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function getRoleFromToken(token) {
  const claims = decodeJwt(token);

  if (!claims) return null;

  const roleClaim =
    claims.role ||
    claims.roles ||
    claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  const role = Array.isArray(roleClaim) ? roleClaim[0] : roleClaim;

  return role ? String(role).toLowerCase() : null;
}

export function getDefaultRouteForRole(role) {
  return String(role).toLowerCase() === "admin" ? "/admin/dashboard" : "/coach/dashboard";
}

export function normalizeRole(role) {
  return String(role || "coach").toLowerCase() === "admin" ? "admin" : "coach";
}

export function getUserDisplayName(user) {
  if (!user) return "Olivia Buckhorton";

  // Try different fields from the user payload or decoded token
  const firstName = user.firstName ?? user.FirstName ?? user.first_name;
  const lastName = user.lastName ?? user.LastName ?? user.last_name;
  if (firstName || lastName) {
    return `${firstName || ""} ${lastName || ""}`.trim();
  }

  const fullName = user.fullName ?? user.FullName ?? user.full_name ?? user.name ?? user.Name ?? user.displayName ?? user.DisplayName;
  if (fullName) return fullName;

  const username = user.userName ?? user.Username ?? user.username ?? user.UserName;
  if (username) return username;

  const token = user.token ?? user.Token;
  if (token) {
    const claims = decodeJwt(token);
    if (claims) {
      const claimName = 
        claims.fullName ?? 
        claims.fullname ?? 
        claims.name ?? 
        claims.unique_name ?? 
        claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ??
        claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"];
      
      if (claimName) {
        const claimSurname = claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"];
        if (claimSurname && claimName === claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"]) {
          return `${claimName} ${claimSurname}`;
        }
        return claimName;
      }

      const emailClaim = claims.email ?? claims.sub;
      if (emailClaim) {
        return String(emailClaim).split("@")[0];
      }
    }
  }

  const email = user.email ?? user.Email;
  if (email) return String(email).split("@")[0];

  return "Olivia Buckhorton";
}

