import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";
import { useBackend } from "../hooks/useBackend";

export function NotificationBell() {
  const { actor, token, isReady } = useBackend();
  const qc = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!actor || !token) return [];
      const res = await actor.getNotifications(token);
      return res.__kind__ === "ok" ? res.ok : [];
    },
    enabled: isReady,
    refetchInterval: 30_000,
  });

  const { data: unreadCount = 0n } = useQuery({
    queryKey: ["unread-count"],
    queryFn: async () => {
      if (!actor || !token) return 0n;
      const res = await actor.unreadNotifCount(token);
      return res.__kind__ === "ok" ? res.ok : 0n;
    },
    enabled: isReady,
    refetchInterval: 30_000,
  });

  const markRead = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !token) return;
      await actor.markNotifRead(token, id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });

  const displayCount = Number(unreadCount);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
          data-ocid="header.notification_bell"
        >
          <Bell className="w-5 h-5" />
          {displayCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1">
              {displayCount > 99 ? "99+" : displayCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 p-0 bg-card border-border"
        data-ocid="header.notification.popover"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">
            Notifications
          </h3>
          {displayCount > 0 && (
            <span className="text-xs text-primary">{displayCount} unread</span>
          )}
        </div>
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <div className="py-8 text-center">
              <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((n) => (
                <button
                  key={String(n.id)}
                  type="button"
                  className={cn(
                    "w-full text-left px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors",
                    !n.isRead && "border-l-2 border-l-primary bg-primary/5",
                  )}
                  onClick={() => !n.isRead && markRead.mutate(n.id)}
                >
                  <p
                    className={cn(
                      "text-sm",
                      !n.isRead ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {n.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(
                      new Date(Number(n.createdAt / 1_000_000n)),
                      { addSuffix: true },
                    )}
                  </p>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
