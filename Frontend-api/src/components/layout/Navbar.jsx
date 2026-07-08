import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../common/Button";

const linkClasses = ({ isActive }) =>
  `text-body font-medium transition-colors duration-150 ${
    isActive ? "text-primary" : "text-secondary hover:text-primary"
  }`;

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-3">
        <span className="text-h2 font-bold text-primary">AppPortal</span>

        <div className="flex items-center gap-3">
          <NavLink to="/dashboard" className={linkClasses}>
            Dashboard
          </NavLink>
          <NavLink to="/profile" className={linkClasses}>
            Profile
          </NavLink>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </nav>
    </header>
  );
}
