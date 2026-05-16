import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, KeyRound, Lock, Shield } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { useBackend } from "../hooks/useBackend";
import { ROLE_LANDING, validatePassword } from "../types";

export default function ChangePasswordPage() {
  const { user, updateUser } = useAuth();
  const { actor, token } = useBackend();
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (!oldPassword) errs.oldPassword = "Current password is required.";
    const pwErr = validatePassword(newPassword);
    if (pwErr) errs.newPassword = pwErr;
    if (newPassword !== confirmPassword)
      errs.confirmPassword = "Passwords do not match.";
    if (oldPassword && newPassword && oldPassword === newPassword)
      errs.newPassword = "New password must differ from current password.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate() || !actor || !token) return;

    setIsLoading(true);
    try {
      const result = await actor.changePassword(
        token,
        oldPassword,
        newPassword,
      );
      if (result.__kind__ === "err") {
        toast.error(result.err);
        return;
      }
      toast.success("Password changed successfully.");
      updateUser({ mustChangePassword: false });
      if (user) {
        navigate({ to: ROLE_LANDING[user.role] });
      }
    } catch {
      toast.error("Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordField = ({
    id,
    label,
    value,
    onChange,
    show,
    onToggle,
    error,
    ocid,
    autoComplete,
  }: {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    show: boolean;
    onToggle: () => void;
    error?: string;
    ocid: string;
    autoComplete: string;
  }) => (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-foreground">
        {label}
      </Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setErrors((p) => ({ ...p, [id]: undefined }));
          }}
          className="pl-9 pr-10 bg-input/50 border-input focus:border-primary"
          autoComplete={autoComplete}
          data-ocid={ocid}
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={show ? `Hide ${label}` : `Show ${label}`}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && (
        <p
          className="text-destructive text-xs"
          data-ocid={`${ocid}.field_error`}
        >
          {error}
        </p>
      )}
    </div>
  );

  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center p-4"
      data-ocid="change-password.page"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-card border border-border mb-6 shadow-lg">
            <KeyRound className="w-8 h-8 text-accent" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xl font-bold tracking-widest text-foreground font-display">
              RKTR
            </span>
          </div>
          <h1 className="text-xl font-bold text-foreground">
            Change Your Password
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Update your account password below.
          </p>
        </div>

        <div className="elevated-card rounded-xl p-6 shadow-xl">
          {/* Requirements */}
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 mb-5">
            <p className="text-xs font-semibold text-accent mb-1.5 uppercase tracking-wide">
              Password Requirements
            </p>
            <ul className="text-xs text-muted-foreground space-y-0.5">
              <li>• Minimum 8 characters</li>
              <li>• At least 1 uppercase letter</li>
              <li>• At least 1 number</li>
              <li>• At least 1 special character</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <PasswordField
              id="oldPassword"
              label="Current Password"
              value={oldPassword}
              onChange={setOldPassword}
              show={showOld}
              onToggle={() => setShowOld((v) => !v)}
              error={errors.oldPassword}
              ocid="change-password.old_password.input"
              autoComplete="current-password"
            />
            <PasswordField
              id="newPassword"
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              show={showNew}
              onToggle={() => setShowNew((v) => !v)}
              error={errors.newPassword}
              ocid="change-password.new_password.input"
              autoComplete="new-password"
            />
            <PasswordField
              id="confirmPassword"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              show={showConfirm}
              onToggle={() => setShowConfirm((v) => !v)}
              error={errors.confirmPassword}
              ocid="change-password.confirm_password.input"
              autoComplete="new-password"
            />

            <Button
              type="submit"
              className="w-full safety-gradient-primary text-primary-foreground font-semibold mt-2 h-11"
              disabled={isLoading}
              data-ocid="change-password.submit_button"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Updating…
                </span>
              ) : (
                "Set New Password"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
