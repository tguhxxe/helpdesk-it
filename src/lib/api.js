export async function api(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    cache: "no-store",
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(
      data.message || "Permintaan gagal. Silakan coba lagi.",
    );
    error.status = response.status;
    if (
      response.status === 401 &&
      url !== "/api/auth/login" &&
      typeof window !== "undefined" &&
      !["/", "/login", "/login/"].includes(window.location.pathname)
    ) {
      window.location.replace("/login");
    }
    throw error;
  }
  return data;
}

export const statuses = ["Menunggu", "Diproses", "Selesai"];
export const categories = [
  "Jaringan",
  "Perangkat Keras",
  "Perangkat Lunak",
  "Akun & Akses",
  "Lainnya",
];
export function formatDate(value, withTime = false) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    ...(withTime ? { timeStyle: "short" } : {}),
  }).format(new Date(value));
}
export function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
