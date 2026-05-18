import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
}
