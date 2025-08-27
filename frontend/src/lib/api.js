import Cookies from "js-cookie";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

class ApiClient {
  constructor(baseURL = BASE) {
    this.baseURL = baseURL;
  }
  async request(path, opts = {}) {
    const token = Cookies.get("token");
    const headers = {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await fetch(`${this.baseURL}${path}`, { ...opts, headers });
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data?.errorMessage || "API error");
      err.statusCode = data?.statusCode || res.status;
      err.errorCode = data?.errorCode;
      err.errorMessage = data?.errorMessage;
      throw err;
    }
    return data;
  }

  // Auth
  login(email, password) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  // Tasks
  getTasks() {
    return this.request("/tasks");
  }
  getTask(id) {
    return this.request(`/tasks/${id}`);
  }
  createTask(payload) {
    return this.request("/tasks/create", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
  updateTask(id, payload) {
    return this.request(`/tasks/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }
  deleteTask(id) {
    return this.request(`/tasks/delete/${id}`, { method: "DELETE" });
  }

  // users
  createUser(payload) {
    return this.request("/users/create", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
  getUsers({ role }) {
    return this.request(`/users?role=${role}`);
  }
  getCurrentUser() {
    return this.request(`/users/me`);
  }
}

export const apiClient = new ApiClient();
