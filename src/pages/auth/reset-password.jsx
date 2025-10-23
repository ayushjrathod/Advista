import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { handleApiError } from "@/lib/auth-utils";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const resetCodeRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // Auto-focus first input on mount
  useEffect(() => {
    if (resetCodeRef.current) {
      resetCodeRef.current.focus();
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const resetCode = resetCodeRef.current?.value || "";
    const newPassword = newPasswordRef.current?.value || "";
    const confirmPassword = confirmPasswordRef.current?.value || "";

    if (!resetCode || !newPassword || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/api/v1/auth/reset-password", {
        email: params.email,
        reset_code: resetCode,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      navigate("/sign-in", { replace: true });
    } catch (error) {
      handleApiError(error, "Failed to reset password. Please try again.", false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Reset your password"
      description="Enter the reset code from your email and your new password."
      footer={
        <p className="text-white">
          Remember your password?{" "}
          <Link to="/sign-in" className="font-bold text-white">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6" role="form" aria-label="Reset password form">
        <div className="space-y-2 text-left">
          <Label htmlFor="reset_code" className="text-sm font-semibold text-white">
            Reset Code
          </Label>
          <Input
            id="reset_code"
            type="text"
            ref={resetCodeRef}
            placeholder="000000"
            inputMode="numeric"
            autoComplete="one-time-code"
            className="tracking-[0.35em] rounded-lg border-white/10 bg-slate-950/60 text-center text-lg font-semibold uppercase text-white placeholder:text-slate-400/80 focus-visible:border-sky-400/70 focus-visible:ring-sky-400/60 focus-visible:ring-offset-0"
            maxLength={6}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2 text-left">
          <Label htmlFor="new_password" className="text-sm font-semibold text-white">
            New Password
          </Label>
          <Input
            id="new_password"
            type="password"
            ref={newPasswordRef}
            autoComplete="new-password"
            placeholder="••••••••"
            className="rounded-lg border-white/10 bg-slate-950/60 text-white placeholder:text-slate-400/80 focus-visible:border-sky-400/70 focus-visible:ring-sky-400/60 focus-visible:ring-offset-0"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2 text-left">
          <Label htmlFor="confirm_password" className="text-sm font-semibold text-white">
            Confirm New Password
          </Label>
          <Input
            id="confirm_password"
            type="password"
            ref={confirmPasswordRef}
            autoComplete="new-password"
            placeholder="••••••••"
            className="rounded-lg border-white/10 bg-slate-950/60 text-white placeholder:text-slate-400/80 focus-visible:border-sky-400/70 focus-visible:ring-sky-400/60 focus-visible:ring-offset-0"
            disabled={isLoading}
            aria-describedby="reset-password-help"
          />
        </div>
        <div id="reset-password-help" className="sr-only">
          Enter the 6-digit reset code from your email and create a new password.
        </div>
        <Button
          className="w-full rounded-lg bg-primary/90 text-primary-foreground shadow-[0_25px_80px_-45px_rgba(59,130,246,0.95)] cursor-pointer"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Resetting password
            </span>
          ) : (
            "Reset password"
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
