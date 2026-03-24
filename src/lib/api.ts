const API_BASE = "/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  auth: {
    register: (data: any) => fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      return data;
    }),
    
    login: (data: any) => fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      return data;
    }),
  },
  
  quiz: {
    submit: (data: any) => fetch(`${API_BASE}/quiz/submit`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit result");
      return data;
    }),
  },
  
  user: {
    getPerformance: () => fetch(`${API_BASE}/user/performance`, {
      headers: getHeaders(),
    }).then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch performance");
      return data;
    }),
  }
};
