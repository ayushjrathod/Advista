import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const emailRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = emailRef.current?.value || "";

    if (!email) {
      console.error("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("/api/v1/auth/forgot-password", {
        email,
      });
      setUserEmail(email);
      setIsEmailSent(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.detail || error.response.data.message || "An error occurred. Please try again.";
        console.error("Forgot password error:", errorMessage);
        alert(errorMessage);
      } else {
        console.error("Error:", "An unexpected error occurred. Please try again.");
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <AuthShell
        title="Check your email"
        description="We've sent a password reset code to your email address."
        footer={
          <p className="text-white">
            Remember your password?{" "}
            <Link to="/sign-in" className="font-bold text-white">
              Sign in
            </Link>
          </p>
        }
      >
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-slate-300">
              Please check your email and follow the instructions to reset your password.
            </p>
          </div>
          <Button
            onClick={() => navigate(`/reset-password/${userEmail}`)}
            className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_25px_80px_-45px_rgba(59,130,246,0.95)]"
          >
            Enter Reset Code
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Forgot your password?"
      description="Enter your email address and we'll send you a code to reset your password."
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
          <Label htmlFor="email" className="text-sm font-semibold text-white">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            ref={emailRef}
            autoComplete="email"
            placeholder="you@example.com"
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
              Sending reset code
            </span>
          ) : (
            "Send reset code"
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
