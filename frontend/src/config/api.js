const API_BASE_URL = import.meta.env.VITE_API_URL || "https://ql-benh-vien.onrender.com";

export default API_BASE_URL.replace(/\/$/, "");
