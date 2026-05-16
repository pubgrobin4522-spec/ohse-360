import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import { Bell, BellOff, CheckCheck, ExternalLink, Inbox } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { NotificationView } from "../backend";
import { useBackend } from "../hooks/useBackend";

type Filter = "all" | "unread" | "read";

const MODULE_COLORS: Record<string, string> = {
  Incident: "bg-destructive/10 text-destructive border-destructive/20",
  PTW: "bg-secondary/10 text-secondary border-secondary/20",
  Training: "bg-primary/10 text-primary border-primary/20",
  CAPA: "bg-orange-950 text-orange-400 border-orange-800",
  User: "bg-blue-950 text-blue-400 border-blue-800",
};

function getModuleFromLink(link: string): string {
  if (link.includes("incident")) return "Incident";
  if (link.includes("ptw")) return "PTW";
  if (link.includes("training")) return "Training";
  if (link.includes("capa")) return "CAPA";
  if (link.includes("user")) return "User";
  return "System";
}

function formatTs(ts: bigint): string {
  try {
    return format(new Date(Number(ts / 1_000_000n)), "dd MMM yyyy HH:mm");
  } catch {
    return "—";
  }
}

function formatRelative(ts: bigint): string {
  try {
    return formatDistanceToNow(new Date(Number(ts / 1_000_000n)), {
      addSuffix: true,
    });
  } catch {
    return "—";
  }
}

export default function NotificationsPage() {
  const { actor, token, isReady } = useBackend();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Filter>("all");

  const { data: notifications = [], isLoading } = useQuery<NotificationView[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!actor || !token) return [];
      const res = await actor.getNotifications(token);
      return res.__kind__ === "ok" ? res.ok : [];
    },
    enabled: isReady,
    refetchInterval: 30_000,
  });

  const markRead = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.markNotifRead(token, id);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unread-count"] });
    },
    onError: () => toast.error("Failed to mark notification as read."),
  });

  async function markAllRead() {
    const unread = notifications.filter((n) => !n.isRead);
    if (unread.length === 0) return;
    await Promise.all(unread.map((n) => markRead.mutateAsync(n.id)));
    toast.success(
      `Marked ${unread.length} notification${unread.length > 1 ? "s" : ""} as read.`,
    );
  }

  const filtered = useMemo(() => {
    const sorted = [...notifications].sort((a, b) =>
      Number(b.createdAt - a.createdAt),
    );
    if (filter === "unread") return sorted.filter((n) => !n.isRead);
    if (filter === "read") return sorted.filter((n) => n.isRead);
    return sorted;
  }, [notifications, filter]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6" data-ocid="notifications.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Notifications
            </h1>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? (
                <>
                  <span className="text-primary font-medium">
                    {unreadCount} unread
                  </span>
                  {" · "}
                  {notifications.length} total
                </>
              ) : (
                `${notifications.length} notification${notifications.length !== 1 ? "s" : ""}`
              )}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllRead}
            disabled={markRead.isPending}
            className="gap-2 border-border text-muted-foreground hover:text-foreground"
            data-ocid="notifications.mark_all_read_button"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Filter tabs */}
      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as Filter)}
        data-ocid="notifications.filter.tab"
      >
        <TabsList className="bg-muted/30 border border-border">
          <TabsTrigger
            value="all"
            className="text-sm"
            data-ocid="notifications.filter.all.tab"
          >
            All
            {notifications.length > 0 && (
              <Badge variant="secondary" className="ml-1.5 text-xs h-4 px-1">
                {notifications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="unread"
            className="text-sm"
            data-ocid="notifications.filter.unread.tab"
          >
            Unread
            {unreadCount > 0 && (
              <Badge className="ml-1.5 text-xs h-4 px-1 bg-primary text-primary-foreground">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="read"
            className="text-sm"
            data-ocid="notifications.filter.read.tab"
          >
            Read
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* List */}
      <div className="elevated-card rounded-lg overflow-hidden divide-y divide-border">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-5 py-4 flex gap-4">
              <Skeleton className="h-9 w-9 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/3 rounded" />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div
            className="py-20 text-center"
            data-ocid="notifications.empty_state"
          >
            {filter === "unread" ? (
              <>
                <CheckCheck className="w-12 h-12 text-primary/30 mx-auto mb-3" />
                <p className="text-foreground font-medium">All caught up!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  No unread notifications.
                </p>
              </>
            ) : (
              <>
                <Inbox className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-foreground font-medium">
                  No notifications yet
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  System alerts will appear here.
                </p>
              </>
            )}
          </div>
        ) : (
          filtered.map((notif, idx) => {
            const module = getModuleFromLink(notif.link);
            const moduleColor =
              MODULE_COLORS[module] ??
              "bg-muted/60 text-muted-foreground border-border";
            const hasLink = notif.link && notif.link !== "";

            return (
              <div
                key={String(notif.id)}
                className={cn(
                  "flex items-start gap-4 px-5 py-4 transition-colors",
                  !notif.isRead
                    ? "bg-primary/5 border-l-2 border-l-primary hover:bg-primary/10"
                    : "hover:bg-muted/20",
                )}
                data-ocid={`notifications.item.${idx + 1}`}
              >
                {/* Unread dot */}
                <div className="mt-1 shrink-0">
                  {notif.isRead ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-muted" />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_6px_1px] shadow-primary/60" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className={cn("text-xs border shrink-0", moduleColor)}
                    >
                      {module}
                    </Badge>
                    {!notif.isRead && (
                      <Badge className="text-xs bg-primary/10 text-primary border border-primary/20 shrink-0">
                        New
                      </Badge>
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-sm",
                      notif.isRead
                        ? "text-muted-foreground"
                        : "text-foreground",
                    )}
                  >
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span
                      className="text-xs text-muted-foreground"
                      title={formatTs(notif.createdAt)}
                    >
                      {formatRelative(notif.createdAt)}
                    </span>
                    {hasLink && (
                      <a
                        href={notif.link}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                        data-ocid={`notifications.link.${idx + 1}`}
                      >
                        <ExternalLink className="w-3 h-3" />
                        View record
                      </a>
                    )}
                  </div>
                </div>

                {/* Mark read button */}
                {!notif.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markRead.mutate(notif.id)}
                    disabled={markRead.isPending}
                    className="shrink-0 text-xs text-muted-foreground hover:text-foreground h-7 px-2"
                    title="Mark as read"
                    data-ocid={`notifications.mark_read_button.${idx + 1}`}
                    aria-label="Mark as read"
                  >
                    <BellOff className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export { NotificationsPage };
