const BASE_URL = (import.meta.env.VITE_MEMBERSHIP_API_URL || "http://localhost:5121").replace(/\/$/, "");

async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Set Content-Type to application/json by default if body is not FormData
  if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const errorMsg = data?.detail || data?.Message || data?.message || data?.title || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Members
  listMembers: async ({ page = 1, pageSize = 10, search = "", status = "" }) => {
    const params = new URLSearchParams();
    params.append("Page", page);
    params.append("PageSize", pageSize);
    if (search) params.append("Search", search);
    if (status && status !== "All") params.append("Status", status);

    return apiFetch(`/api/members?${params.toString()}`);
  },

  getMember: async (id) => {
    return apiFetch(`/api/members/${id}`);
  },

  createMember: async (memberData) => {
    // If memberData is not already a FormData object, and contains objects (like file) or strings, we can handle it
    let body;
    let headers = {};

    if (memberData instanceof FormData) {
      body = memberData;
      // Fetch will automatically set correct boundary for FormData, do not set Content-Type manually
    } else {
      body = JSON.stringify(memberData);
    }

    return apiFetch("/api/members", {
      method: "POST",
      headers,
      body,
    });
  },

  updateMember: async (id, memberData) => {
    let body;
    let headers = {};

    if (memberData instanceof FormData) {
      body = memberData;
    } else {
      body = JSON.stringify(memberData);
    }

    return apiFetch(`/api/members/${id}`, {
      method: "PUT",
      headers,
      body,
    });
  },

  deleteMember: async (id) => {
    return apiFetch(`/api/members/${id}`, {
      method: "DELETE",
    });
  },

  suspendMember: async (memberId) => {
    return apiFetch(`/api/members/${memberId}/suspend`, {
      method: "PATCH",
    });
  },

  activateMember: async (memberId) => {
    return apiFetch(`/api/members/${memberId}/activate`, {
      method: "PATCH",
    });
  },

  getSubscriptionHistory: async (memberId) => {
    return apiFetch(`/api/members/${memberId}/subscriptions`);
  },

  // Plans
  listPlans: async () => {
    return apiFetch("/api/plans");
  },

  createPlan: async (planData) => {
    return apiFetch("/api/plans", {
      method: "POST",
      body: JSON.stringify(planData),
    });
  },

  updatePlan: async (id, planData) => {
    return apiFetch(`/api/plans/${id}`, {
      method: "PUT",
      body: JSON.stringify(planData),
    });
  },

  deletePlan: async (id) => {
    return apiFetch(`/api/plans/${id}`, {
      method: "DELETE",
    });
  },

  // Subscriptions
  createSubscription: async ({ memberId, planId, paymentMethod = "Cash", notes = "" }) => {
    return apiFetch("/api/subscriptions", {
      method: "POST",
      body: JSON.stringify({ memberId, planId, paymentMethod, notes }),
    });
  },

  confirmCashPayment: async ({ subscriptionId, amountReceived, paymentMethod = "Cash", notes = "" }) => {
    return apiFetch("/api/subscriptions/confirm-payment", {
      method: "POST",
      body: JSON.stringify({ subscriptionId, amountReceived, paymentMethod, notes }),
    });
  },

  // Renewals
  listPendingRenewals: async () => {
    return apiFetch("/api/subscriptions/renew/pending");
  },

  requestRenewal: async ({ subscriptionId, amount, notes = "" }) => {
    return apiFetch("/api/subscriptions/renew", {
      method: "POST",
      body: JSON.stringify({ subscriptionId, amount, notes }),
    });
  },

  acceptRenewal: async (requestId, notes = "") => {
    return apiFetch(`/api/subscriptions/renew/${requestId}/accept`, {
      method: "PATCH",
      body: notes ? JSON.stringify({ notes }) : JSON.stringify({}),
    });
  },

  rejectRenewal: async (requestId, notes = "") => {
    return apiFetch(`/api/subscriptions/renew/${requestId}/reject`, {
      method: "PATCH",
      body: notes ? JSON.stringify({ notes }) : JSON.stringify({}),
    });
  },

  onlineRenewal: async ({ subscriptionId, amount, notes = "" }) => {
    return apiFetch("/api/subscriptions/renew/online", {
      method: "POST",
      body: JSON.stringify({ subscriptionId, amount, notes }),
    });
  },

  // Member endpoints
  getMyProfile: async () => {
    return apiFetch("/api/me");
  },

  updateMyProfile: async (profileData) => {
    return apiFetch("/api/me", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },

  getMySubscription: async () => {
    return apiFetch("/api/me/subscription");
  },

  getMySubscriptions: async () => {
    return apiFetch("/api/me/subscriptions");
  },

  getMySessions: async () => {
    return apiFetch("/api/me/sessions");
  },

  getMyPayments: async () => {
    return apiFetch("/api/me/payments");
  },

  getActiveSubscription: async () => {
    return apiFetch("/api/members/active-subscription");
  },
};
