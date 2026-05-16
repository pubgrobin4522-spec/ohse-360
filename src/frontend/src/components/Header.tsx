import { Button } from "@/components/ui/button";
import { LogOut, Menu, Shield } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useBackend } from "../hooks/useBackend";
import { ROLE_LABELS } from "../types";
import { NotificationBell } from "./NotificationBell";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const { actor } = useBackend();

  const handleLogout = async () => {
    if (user?.sessionToken && actor) {
      try {
        await actor.logout(user.sessionToken);
      } catch {
        // ignore
      }
    }
    logout();
  };

  return (
    <header className="h-14 bg-card border-b border-border flex items-center px-4 gap-4 shrink-0">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden text-muted-foreground"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
        data-ocid="header.sidebar_toggle"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* RKTR Brand Logo — desktop */}
      <div className="hidden md:flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
          <Shield className="w-4 h-4 text-amber-400" />
        </div>
        <div className="flex flex-col leading-none">
          <span
            className="text-base font-extrabold tracking-[0.18em] font-display"
            style={{ color: "#F59E0B" }}
          >
            RKTR
          </span>
          <span
            className="text-[9px] font-bold tracking-[0.3em] uppercase"
            style={{ color: "#D97706" }}
          >
            WHEELS
          </span>
        </div>
        <div className="w-px h-6 bg-border mx-1" />
        <span className="text-xs font-semibold text-muted-foreground tracking-wider">
          OHSE 360
        </span>
      </div>

      <div className="flex-1" />

      {/* Notifications */}
      <NotificationBell />

      {/* User info */}
      {user && (
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-medium text-foreground leading-tight">
            {user.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {ROLE_LABELS[user.role]} · ID {String(user.employeeId)}
          </span>
        </div>
      )}

      {/* Logout */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        aria-label="Logout"
        data-ocid="header.logout_button"
        className="text-muted-foreground hover:text-destructive"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </header>
  );
}
