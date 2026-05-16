import api from "./axios";

export const loginUser = async (email, password) => {
  console.log("🔄 Attempting login for:", email);

  try {
    const { data } = await api.post("/auth/login", { email, password });
    console.log("✅ Login successful:", data);
    return data;
  } catch (error) {
    console.error("❌ Login failed:", error.response?.data || error.message);
    throw error;
  }
};

export const registerUser = async (userData) => {
try {
    const { data } = await api.post("/auth/register", userData);
    console.log("✅ Registration successful:", data);
    return data;
} catch (error) {
    console.error("❌ Registration failed:", error.response?.data || error.message);
    throw error;
}
};