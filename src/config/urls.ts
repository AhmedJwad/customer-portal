
const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "https://localhost:44372/api/";

export const FILES_BASE = API_BASE_URL.replace(/api\/?$/, "");

export const getFileUrl = (path?: string | null): string => {
  if (!path) return "";

  if (/^https?:\/\//i.test(path)) return path;

  return `${FILES_BASE.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};

export const fileUrl = (path?: string | null) => (path ? `${FILES_BASE}${path}` : undefined);
