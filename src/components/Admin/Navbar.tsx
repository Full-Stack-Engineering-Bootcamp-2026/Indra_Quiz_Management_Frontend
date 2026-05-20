import { Link, useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

import {
  LayoutDashboard,
  FilePlus2,
  ClipboardPlus,
  PlusSquare,
  ListChecks,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { logout } from "@/store/slices/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());

    navigate("/");
  };

  const navLinks = [
    {
      label: "Home",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Create Question",
      path: "/admin/create-question",
      icon: FilePlus2,
    },
    {
      label: "Create Quiz",
      path: "/admin/create-quiz",
      icon: ClipboardPlus,
    },
    {
      label: "Add Questions",
      path: "/admin/add-question-quiz",
      icon: PlusSquare,
    },
    {
      label: "All Questions",
      path: "/admin/allQuestions",
      icon: ListChecks,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div
          onClick={() => navigate("/admin")}
          className="flex cursor-pointer items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white shadow-sm">
            Q
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight">
              QuizPortal Admin
            </h1>

            <p className="text-xs text-gray-500">Manage quizzes & questions</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;

            const isActive = location.pathname === link.path;

            return (
              <Link key={link.path} to={link.path}>
                <Button
                  variant="ghost"
                  className={`flex items-center cursor-pointer rounded-xl px-4 ${
                    isActive
                      ? "bg-black text-white hover:bg-black hover:text-white"
                      : ""
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            );
          })}

          <Button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl text-white bg-black px-4 hover:bg-gray-800"
          >
            <LogOut className="h-4 w-4 text-white" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
