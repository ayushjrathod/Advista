import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const resetCodeRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const resetCode = resetCodeRef.current?.value || "";
    const newPassword = newPasswordRef.current?.value || "";
    const confirmPassword = confirmPasswordRef.current?.value || "";

    if (!resetCode || !newPassword || !confirmPassword) {
      console.error("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      console.error("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      console.error("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("/api/v1/auth/reset-password", {
        email: params.email,
        reset_code: resetCode,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      console.log("Password reset successfully!");
      navigate("/sign-in", { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.detail || error.response.data.message || "An error occurred. Please try again.";
        console.error("Reset password error:", errorMessage);
        alert(errorMessage);
      } else {
        console.error("Error:", "An unexpected error occurred. Please try again.");
        alert("An unexpected error occurred. Please try again.");
      }
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
      <form onSubmit={handleSubmit} className="space-y-6">
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
          />
        </div>
        <Button
          className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_25px_80px_-45px_rgba(59,130,246,0.95)]"
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
