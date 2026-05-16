import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Hash, Lock, Shield } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";
import type { backendInterface } from "../backend";
import { useAuth } from "../hooks/useAuth";
import { ROLE_LANDING } from "../types";

export default function LoginPage() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    employeeId?: string;
    password?: string;
  }>({});

  const { actor } = useActor(createActor);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs: typeof errors = {};
    if (!employeeId.trim()) errs.employeeId = "Employee ID is required.";
    else if (!/^\d+$/.test(employeeId))
      errs.employeeId = "Employee ID must be numeric.";
    if (!password) errs.password = "Password is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate() || !actor) return;

    setIsLoading(true);
    try {
      const backend = actor as unknown as backendInterface;
      const result = await backend.login(BigInt(employeeId), password);

      if (result.__kind__ === "err") {
        toast.error(result.err);
        return;
      }

      const { token, mustChangePassword } = result.ok;

      // Fetch user info
      const meResult = await backend.whoAmI(token);
      if (meResult.__kind__ === "err") {
        toast.error("Failed to load user profile.");
        return;
      }

      const me = meResult.ok;
      login({
        employeeId: me.employeeId,
        name: me.fullName,
        role: me.role,
        department: me.department,
        designation: me.designation,
        sessionToken: token,
        mustChangePassword,
      });

      if (mustChangePassword && me.role !== "SystemAdmin") {
        navigate({ to: "/change-password" });
      } else {
        navigate({ to: ROLE_LANDING[me.role] });
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center p-4"
      data-ocid="login.page"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-card/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          {/* RKTR Branded Wordmark */}
          <div className="mb-5" data-ocid="login.rktr_wordmark">
            <div className="inline-flex flex-col items-center">
              <span
                className="text-5xl font-black tracking-[0.3em] leading-none"
                style={{ color: "#F59E0B" }}
              >
                RKTR
              </span>
              <span
                className="text-sm font-semibold tracking-[0.4em] mt-0.5"
                style={{ color: "#D97706", opacity: 0.8 }}
              >
                WHEELS
              </span>
            </div>
            <div className="flex items-center gap-3 mt-4 mb-3">
              <div className="flex-1 h-px bg-amber-500/30" />
              <Shield className="w-4 h-4" style={{ color: "#F59E0B" }} />
              <div className="flex-1 h-px bg-amber-500/30" />
            </div>
            <p className="text-lg font-bold tracking-widest text-foreground uppercase">
              OHSE 360
            </p>
            <p className="text-muted-foreground text-xs mt-1 tracking-wide">
              Digital Safety Platform
            </p>
          </div>
        </div>

        {/* Card */}
        <div
          className="elevated-card rounded-xl p-6 shadow-xl"
          data-ocid="login.card"
        >
          <h2 className="text-lg font-semibold text-foreground mb-5">
            Sign In
          </h2>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Employee ID */}
            <div className="space-y-1.5">
              <Label htmlFor="employeeId" className="text-foreground">
                Employee ID
              </Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="employeeId"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="e.g. 230034"
                  value={employeeId}
                  onChange={(e) => {
                    setEmployeeId(e.target.value.replace(/\D/g, ""));
                    setErrors((p) => ({ ...p, employeeId: undefined }));
                  }}
                  className="pl-9 bg-slate-800 border border-slate-500 text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                  autoComplete="username"
                  aria-describedby={
                    errors.employeeId ? "emp-id-error" : undefined
                  }
                  data-ocid="login.employee_id.input"
                  disabled={isLoading}
                />
              </div>
              {errors.employeeId && (
                <p
                  id="emp-id-error"
                  className="text-destructive text-xs"
                  data-ocid="login.employee_id.field_error"
                >
                  {errors.employeeId}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((p) => ({ ...p, password: undefined }));
                  }}
                  className="pl-9 pr-10 bg-slate-800 border border-slate-500 text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                  autoComplete="current-password"
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  data-ocid="login.password.input"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p
                  id="password-error"
                  className="text-destructive text-xs"
                  data-ocid="login.password.field_error"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full safety-gradient-primary text-primary-foreground font-semibold mt-2 h-11"
              disabled={isLoading}
              data-ocid="login.submit_button"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Occupational Health, Safety &amp; Environment Platform
        </p>
      </div>
    </div>
  );
}
