import { a as createLucideIcon, u as useBackend, h as useQueryClient, r as reactExports, f as useQuery, i as useMutation, n as ue, j as jsxRuntimeExports, J as Bell, B as Button, M as cn, N as formatDistanceToNow } from "./index-KlJ1Xkuh.js";
import { B as Badge } from "./badge-9gf8k1SD.js";
import { S as Skeleton } from "./skeleton-BD1qWQ8I.js";
import { T as Tabs, a as TabsList, b as TabsTrigger } from "./tabs-BaD-aY2q.js";
import { f as format } from "./format-DJw_dsXB.js";
import "./index-DhDE9dTE.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742",
      key: "178tsu"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ["path", { d: "M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05", key: "1hqiys" }]
];
const BellOff = createLucideIcon("bell-off", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M18 6 7 17l-5-5", key: "116fxf" }],
  ["path", { d: "m22 10-7.5 7.5L13 16", key: "ke71qq" }]
];
const CheckCheck = createLucideIcon("check-check", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["polyline", { points: "22 12 16 12 14 15 10 15 8 12 2 12", key: "o97t9d" }],
  [
    "path",
    {
      d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
      key: "oot6mr"
    }
  ]
];
const Inbox = createLucideIcon("inbox", __iconNode);
const MODULE_COLORS = {
  Incident: "bg-destructive/10 text-destructive border-destructive/20",
  PTW: "bg-secondary/10 text-secondary border-secondary/20",
  Training: "bg-primary/10 text-primary border-primary/20",
  CAPA: "bg-orange-950 text-orange-400 border-orange-800",
  User: "bg-blue-950 text-blue-400 border-blue-800"
};
function getModuleFromLink(link) {
  if (link.includes("incident")) return "Incident";
  if (link.includes("ptw")) return "PTW";
  if (link.includes("training")) return "Training";
  if (link.includes("capa")) return "CAPA";
  if (link.includes("user")) return "User";
  return "System";
}
function formatTs(ts) {
  try {
    return format(new Date(Number(ts / 1000000n)), "dd MMM yyyy HH:mm");
  } catch {
    return "—";
  }
}
function formatRelative(ts) {
  try {
    return formatDistanceToNow(new Date(Number(ts / 1000000n)), {
      addSuffix: true
    });
  } catch {
    return "—";
  }
}
function NotificationsPage() {
  const { actor, token, isReady } = useBackend();
  const qc = useQueryClient();
  const [filter, setFilter] = reactExports.useState("all");
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!actor || !token) return [];
      const res = await actor.getNotifications(token);
      return res.__kind__ === "ok" ? res.ok : [];
    },
    enabled: isReady,
    refetchInterval: 3e4
  });
  const markRead = useMutation({
    mutationFn: async (id) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.markNotifRead(token, id);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unread-count"] });
    },
    onError: () => ue.error("Failed to mark notification as read.")
  });
  async function markAllRead() {
    const unread = notifications.filter((n) => !n.isRead);
    if (unread.length === 0) return;
    await Promise.all(unread.map((n) => markRead.mutateAsync(n.id)));
    ue.success(
      `Marked ${unread.length} notification${unread.length > 1 ? "s" : ""} as read.`
    );
  }
  const filtered = reactExports.useMemo(() => {
    const sorted = [...notifications].sort(
      (a, b) => Number(b.createdAt - a.createdAt)
    );
    if (filter === "unread") return sorted.filter((n) => !n.isRead);
    if (filter === "read") return sorted.filter((n) => n.isRead);
    return sorted;
  }, [notifications, filter]);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto space-y-6", "data-ocid": "notifications.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Notifications" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: unreadCount > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-medium", children: [
              unreadCount,
              " unread"
            ] }),
            " · ",
            notifications.length,
            " total"
          ] }) : `${notifications.length} notification${notifications.length !== 1 ? "s" : ""}` })
        ] })
      ] }),
      unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: markAllRead,
          disabled: markRead.isPending,
          className: "gap-2 border-border text-muted-foreground hover:text-foreground",
          "data-ocid": "notifications.mark_all_read_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "w-4 h-4" }),
            "Mark all read"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Tabs,
      {
        value: filter,
        onValueChange: (v) => setFilter(v),
        "data-ocid": "notifications.filter.tab",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "bg-muted/30 border border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "all",
              className: "text-sm",
              "data-ocid": "notifications.filter.all.tab",
              children: [
                "All",
                notifications.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-1.5 text-xs h-4 px-1", children: notifications.length })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "unread",
              className: "text-sm",
              "data-ocid": "notifications.filter.unread.tab",
              children: [
                "Unread",
                unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-1.5 text-xs h-4 px-1 bg-primary text-primary-foreground", children: unreadCount })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TabsTrigger,
            {
              value: "read",
              className: "text-sm",
              "data-ocid": "notifications.filter.read.tab",
              children: "Read"
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "elevated-card rounded-lg overflow-hidden divide-y divide-border", children: isLoading ? Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 flex gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-9 rounded-full shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4 rounded" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/3 rounded" })
      ] })
    ] }, i)) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "py-20 text-center",
        "data-ocid": "notifications.empty_state",
        children: filter === "unread" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "w-12 h-12 text-primary/30 mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-medium", children: "All caught up!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "No unread notifications." })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { className: "w-12 h-12 text-muted-foreground/30 mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-medium", children: "No notifications yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "System alerts will appear here." })
        ] })
      }
    ) : filtered.map((notif, idx) => {
      const module = getModuleFromLink(notif.link);
      const moduleColor = MODULE_COLORS[module] ?? "bg-muted/60 text-muted-foreground border-border";
      const hasLink = notif.link && notif.link !== "";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: cn(
            "flex items-start gap-4 px-5 py-4 transition-colors",
            !notif.isRead ? "bg-primary/5 border-l-2 border-l-primary hover:bg-primary/10" : "hover:bg-muted/20"
          ),
          "data-ocid": `notifications.item.${idx + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 shrink-0", children: notif.isRead ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-muted" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_6px_1px] shadow-primary/60" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start gap-2 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: cn("text-xs border shrink-0", moduleColor),
                    children: module
                  }
                ),
                !notif.isRead && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-xs bg-primary/10 text-primary border border-primary/20 shrink-0", children: "New" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: cn(
                    "text-sm",
                    notif.isRead ? "text-muted-foreground" : "text-foreground"
                  ),
                  children: notif.message
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs text-muted-foreground",
                    title: formatTs(notif.createdAt),
                    children: formatRelative(notif.createdAt)
                  }
                ),
                hasLink && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: notif.link,
                    className: "inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors",
                    "data-ocid": `notifications.link.${idx + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3 h-3" }),
                      "View record"
                    ]
                  }
                )
              ] })
            ] }),
            !notif.isRead && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => markRead.mutate(notif.id),
                disabled: markRead.isPending,
                className: "shrink-0 text-xs text-muted-foreground hover:text-foreground h-7 px-2",
                title: "Mark as read",
                "data-ocid": `notifications.mark_read_button.${idx + 1}`,
                "aria-label": "Mark as read",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { className: "w-3.5 h-3.5" })
              }
            )
          ]
        },
        String(notif.id)
      );
    }) })
  ] });
}
export {
  NotificationsPage,
  NotificationsPage as default
};
