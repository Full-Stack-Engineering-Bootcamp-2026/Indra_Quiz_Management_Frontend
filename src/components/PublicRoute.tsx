import { Navigate, Outlet } from "react-router-dom";

import { useSelector } from "react-redux";

import type { RootState } from "@/store/store";

export default function PublicRoute() {
  const { token, user } = useSelector((state: RootState) => state.auth);

  if (token && user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (token && user?.role === "user") {
    return <Navigate to="/user" replace />;
  }

  return <Outlet />;
}
