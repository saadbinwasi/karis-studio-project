const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://karis-studio-project.vercel.app"
).replace(/\/+$/, "");

export default API_URL;
