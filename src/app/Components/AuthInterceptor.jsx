"use client";
import { useEffect } from "react";
import axios from "axios";
import { API_URL } from "../utils/api";

/**
 * Global axios response handler: if the API says the admin session is no longer
 * valid (expired/invalid token, or the admin was disabled/demoted), drop the
 * stored token and send the user to the login page instead of leaving every
 * screen failing with a generic error toast.
 */
export default function AuthInterceptor() {
  useEffect(() => {
    const id = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        const status = err?.response?.status;
        const url = String(err?.config?.url || "");
        const message = err?.response?.data?.message || "";
        const isApi = url.startsWith(API_URL);
        const onAuthPage = window.location.pathname.startsWith("/Pages/Auth");
        const sessionDead =
          status === 401 || (status === 403 && message === "Forbidden: Admins only");

        if (isApi && sessionDead && !onAuthPage && !url.includes("/admin/login")) {
          try { localStorage.removeItem("adminToken"); } catch { /* storage unavailable */ }
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = "/Pages/Auth/login"; // hard navigation on purpose: resets all client state
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(id);
  }, []);

  return null;
}
