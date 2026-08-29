import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bell, Home, LogOut, Menu, Moon, Sun, User, X } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/authStore";
import { useNotifications } from "@/hooks/useNotifications";
import { useLogout } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { theme, toggleTheme } = useThemeStore();
  const { user, isInitialized } = useAuthStore();
  const { data: notifications } = useNotifications();
  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;
  const logout = useLogout();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout.mutate(undefined, { onSuccess: () => navigate("/") });
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
      isActive
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground hover:bg-surface-hover",
    );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
          <Link
            to="/"
            className="font-logo text-lg font-bold tracking-tight text-foreground"
          >
            Socially
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:bg-surface-hover md:mr-1"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {!isInitialized ? (
              <div className="h-9 w-20 animate-pulse rounded-lg bg-surface-hover" />
            ) : user ? (
              <>
                {/* Desktop nav links */}
                <nav className="hidden items-center gap-1 md:flex">
                  <NavLink to="/" className={navLinkClass} end>
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </NavLink>
                  <NavLink to="/notifications" className={navLinkClass}>
                    <span className="relative">
                      <Bell className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </span>
                    <span>Notifications</span>
                  </NavLink>
                  <NavLink
                    to={`/profile/${user.username}`}
                    className={navLinkClass}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    disabled={logout.isPending}
                    aria-label="Log out"
                    title="Log out"
                    className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </nav>

                {/* Mobile hamburger trigger */}
                <button
                  onClick={() => setMenuOpen(true)}
                  aria-label="Open menu"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground md:hidden"
                >
                  <Menu className="h-4 w-4" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-secondary px-4 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary-hover"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      {menuOpen && user && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-xs flex-col bg-background shadow-modal animate-slide-up">
            <div className="flex h-14 items-center justify-between border-b border-border px-4">
              <span className="text-base font-semibold text-foreground">
                Menu
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-hover hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col items-center gap-6 pt-10">
              <NavLink
                to="/"
                end
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 text-base font-medium",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )
                }
              >
                <Home className="h-4 w-4" />
                Home
              </NavLink>
              <NavLink
                to="/notifications"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 text-base font-medium",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )
                }
              >
                <Bell className="h-4 w-4" />
                Notifications
              </NavLink>
              <NavLink
                to={`/profile/${user.username}`}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 text-base font-medium",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )
                }
              >
                <User className="h-4 w-4" />
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                disabled={logout.isPending}
                className="flex items-center gap-2 text-base font-medium text-muted-foreground disabled:opacity-50"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
