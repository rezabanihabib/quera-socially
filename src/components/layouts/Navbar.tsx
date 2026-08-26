import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bell, Home, LogOut, Moon, Sun, User } from "lucide-react";
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

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
      isActive
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
    );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-1.5">
          <Link to="/" className="font-logo text-lg font-bold tracking-tight text-foreground">
            Socially
          </Link>
          {isInitialized && user && (
            <button
              onClick={() => logout.mutate(undefined, { onSuccess: () => navigate("/") })}
              disabled={logout.isPending}
              aria-label="Log out"
              title="Log out"
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger disabled:opacity-50"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="mr-1 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {!isInitialized ? (
            <div className="h-9 w-20 animate-pulse rounded-lg bg-surface-hover" />
          ) : user ? (
            <>
              <NavLink to="/" className={navLinkClass} end>
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
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
                <span className="hidden sm:inline">Notification</span>
              </NavLink>
              <NavLink to={`/profile/${user.username}`} className={navLinkClass}>
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </NavLink>
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
  );
}
