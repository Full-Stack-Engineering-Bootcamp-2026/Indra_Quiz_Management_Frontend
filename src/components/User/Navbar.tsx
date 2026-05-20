import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";

import { LogOut, LayoutDashboard, History } from "lucide-react";

import { logout } from "@/store/slices/authSlice";

import { Button } from "@/components/ui/button";

export default function Navbar() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());

    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div
          onClick={() => navigate("/user")}
          className="flex cursor-pointer items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white shadow-sm">
            Q
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight">Quiz Portal</h1>

            <p className="text-xs text-gray-500">Learning Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/user")}
            className="flex items-center gap-2 cursor-pointer rounded-xl px-4"
          >
            <LayoutDashboard className="h-4 w-4" />
            Home
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate("/user/attempts")}
            className="flex items-center gap-2 cursor-pointer rounded-xl px-4"
          >
            <History className="h-4 w-4" />
            My Attempts
          </Button>

          <Button
            onClick={handleLogout}
            className="flex items-center gap-2 cursor-pointer rounded-xl bg-black px-4 text-white hover:bg-gray-800"
          >
            <LogOut className="h-4 w-4 text-white" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
