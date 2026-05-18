import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";

import { logout } from "@/store/slices/authSlice";

import { CiLogout } from "react-icons/ci";

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
    },
    {
      label: "Create Question",
      path: "/admin/create-question",
    },
    {
      label: "Create Quiz",
      path: "/admin/create-quiz",
    },
    {
      label: "Add Questions",
      path: "/admin/add-question-quiz",
    },
    {
      label: "All Questions",
      path: "/admin/allQuestions",
    },
  ];

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b bg-white px-8 py-4 shadow-sm">
      <h1 className="text-2xl font-bold tracking-tight">Quiz Admin</h1>

      <div className="flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-sm font-medium transition hover:text-black ${
              location.pathname === link.path ? "text-black" : "text-gray-500"
            }`}
          >
            {link.label}
          </Link>
        ))}

        <Button
          onClick={handleLogout}
          className="flex cursor-pointer items-center gap-2"
        >
          <CiLogout className="text-lg" />
          Logout
        </Button>
      </div>
    </nav>
  );
}
