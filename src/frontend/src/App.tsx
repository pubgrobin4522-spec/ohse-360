import { Toaster } from "@/components/ui/sonner";
import { InternetIdentityProvider } from "@caffeineai/core-infrastructure";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { Layout } from "./components/Layout";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import LoginPage from "./pages/LoginPage";

// Lazy-load heavy pages so they can be added later without re-building foundation
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const UsersPage = lazy(() => import("./pages/UsersPage"));
const EmployeesPage = lazy(() => import("./pages/EmployeesPage"));
const IncidentsPage = lazy(() => import("./pages/IncidentsPage"));
const TrainingPage = lazy(() => import("./pages/TrainingPage"));
const PTWPage = lazy(() => import("./pages/PTWPage"));
const AuditPage = lazy(() => import("./pages/AuditPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));

// Phase 2 lazy-loaded pages
const ObservationsPage = lazy(() => import("./pages/ObservationsPage"));
const HIRAPage = lazy(() => import("./pages/HIRAPage"));
const JSAPage = lazy(() => import("./pages/JSAPage"));
const CAPAPage = lazy(() => import("./pages/CAPAPage"));
const ESGPage = lazy(() => import("./pages/ESGPage"));
const AIRiskPage = lazy(() => import("./pages/AIRiskPage"));
const PPELOTOPage = lazy(() => import("./pages/PPELOTOPage"));
const ContractorPage = lazy(() => import("./pages/ContractorPage"));

const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

// --- Route guards ---
function requireAuth(role?: string) {
  const stored = localStorage.getItem("ohse360_user");
  if (!stored) throw redirect({ to: "/login" });
  if (role) {
    try {
      const u = JSON.parse(stored) as { role: string };
      if (u.role !== role) throw redirect({ to: "/" });
    } catch (e) {
      if (e instanceof Response) throw e;
      throw redirect({ to: "/login" });
    }
  }
}

function requireAdminOrSafety() {
  const stored = localStorage.getItem("ohse360_user");
  if (!stored) throw redirect({ to: "/login" });
  try {
    const u = JSON.parse(stored) as { role: string };
    if (u.role !== "SystemAdmin" && u.role !== "SafetyOfficer")
      throw redirect({ to: "/" });
  } catch (e) {
    if (e instanceof Response) throw e;
    throw redirect({ to: "/login" });
  }
}

// --- Root route ---
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// We need an index route for the root
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    const stored = localStorage.getItem("ohse360_user");
    if (!stored) throw redirect({ to: "/login" });
    try {
      const u = JSON.parse(stored) as {
        role: string;
        mustChangePassword?: boolean;
      };
      if (u.mustChangePassword && u.role !== "SystemAdmin")
        throw redirect({ to: "/change-password" });
      const landing: Record<string, string> = {
        SystemAdmin: "/users",
        Employee: "/dashboard",
        SafetyOfficer: "/dashboard",
        HOD: "/dashboard",
        AreaInCharge: "/dashboard",
        ContractorAdmin: "/dashboard",
      };
      throw redirect({ to: landing[u.role] ?? "/dashboard" });
    } catch (e) {
      if (e instanceof Response) throw e;
      throw redirect({ to: "/login" });
    }
  },
  component: () => null,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const changePasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/change-password",
  beforeLoad: () => requireAuth(),
  component: ChangePasswordPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  beforeLoad: () => requireAuth(),
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <DashboardPage />
      </Suspense>
    </Layout>
  ),
});

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/users",
  beforeLoad: () => requireAuth("SystemAdmin"),
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <UsersPage />
      </Suspense>
    </Layout>
  ),
});

const employeesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/employees",
  beforeLoad: () => requireAdminOrSafety(),
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <EmployeesPage />
      </Suspense>
    </Layout>
  ),
});

const incidentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/incidents",
  beforeLoad: () => requireAuth(),
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <IncidentsPage />
      </Suspense>
    </Layout>
  ),
});

const trainingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/training",
  beforeLoad: () => requireAuth(),
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <TrainingPage />
      </Suspense>
    </Layout>
  ),
});

const ptwRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ptw",
  beforeLoad: () => requireAuth(),
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <PTWPage />
      </Suspense>
    </Layout>
  ),
});

const auditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/audit",
  beforeLoad: () => requireAdminOrSafety(),
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <AuditPage />
      </Suspense>
    </Layout>
  ),
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  beforeLoad: () => requireAuth(),
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <NotificationsPage />
      </Suspense>
    </Layout>
  ),
});

// --- Phase 2 Routes ---
const observationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/observations",
  beforeLoad: () => requireAuth(),
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <ObservationsPage />
      </Suspense>
    </Layout>
  ),
});

const hiraRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hira",
  beforeLoad: () => requireAuth(),
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <HIRAPage />
      </Suspense>
    </Layout>
  ),
});

const jsaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/jsa",
  beforeLoad: () => requireAuth(),
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <JSAPage />
      </Suspense>
    </Layout>
  ),
});

const capaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/capa",
  beforeLoad: () => requireAuth(),
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <CAPAPage />
      </Suspense>
    </Layout>
  ),
});

const esgRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/esg",
  beforeLoad: () => requireAdminOrSafety(),
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <ESGPage />
      </Suspense>
    </Layout>
  ),
});

const aiRiskRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-risk",
  beforeLoad: () => requireAdminOrSafety(),
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <AIRiskPage />
      </Suspense>
    </Layout>
  ),
});

const ppeLotoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ppe-loto",
  beforeLoad: () => requireAuth(),
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <PPELOTOPage />
      </Suspense>
    </Layout>
  ),
});

const contractorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contractor",
  beforeLoad: () => requireAuth(),
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <ContractorPage />
      </Suspense>
    </Layout>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  changePasswordRoute,
  dashboardRoute,
  usersRoute,
  employeesRoute,
  incidentsRoute,
  trainingRoute,
  ptwRoute,
  auditRoute,
  notificationsRoute,
  // Phase 2
  observationsRoute,
  hiraRoute,
  jsaRoute,
  capaRoute,
  esgRoute,
  aiRiskRoute,
  ppeLotoRoute,
  contractorRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

export default function App() {
  return (
    <InternetIdentityProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <RouterProvider router={router} />
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </InternetIdentityProvider>
  );
}
