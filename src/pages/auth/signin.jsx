import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { handleApiError } from "@/lib/auth-utils";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignInForm() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Auto-focus first input on mount
  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/api/v1/auth/signin", {
        email,
        password,
      });

      checkAuth();
      navigate("/");
    } catch (error) {
      handleApiError(error, "Invalid email or password. Please try again.", false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      description="Researchers sign in here to keep the insights flowing."
      contentClassName="sm:space-y-7"
      footer={
        <p className="text-white">
          New to Advista?{" "}
          <Link to="/sign-up" className="font-bold text-white">
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="" role="form" aria-label="Sign in form">
        <div className="space-y-2 text-left mb-6">
          <Label htmlFor="email" className="text-sm font-semibold text-white">
            Email
          </Label>
          <Input
            id="email"
            type="text"
            ref={emailRef}
            autoComplete="email"
            placeholder="you@example.com"
            className="rounded-lg border-white/10 bg-slate-950/60 text-white placeholder:text-slate-400/80 focus-visible:border-sky-400/70 focus-visible:ring-sky-400/60 focus-visible:ring-offset-0"
            disabled={isLoading}
            aria-describedby="signin-help"
          />
        </div>
        <div className="space-y-2 text-left mb-8">
          <Label htmlFor="password" className="text-sm font-semibold text-white">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            ref={passwordRef}
            autoComplete="current-password"
            placeholder="••••••••"
            className="rounded-lg border-white/10 bg-slate-950/60 text-white placeholder:text-slate-400/80 focus-visible:border-sky-400/70 focus-visible:ring-sky-400/60 focus-visible:ring-offset-0"
            disabled={isLoading}
          />
        </div>
        <Button
          className="w-full rounded-lg bg-primary/90 text-primary-foreground shadow-[0_25px_80px_-45px_rgba(59,130,246,0.95)] cursor-pointer"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in
            </span>
          ) : (
            "Sign in"
          )}
        </Button>
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-sky-400 hover:text-sky-300 underline">
            Forgot your password?
          </Link>
        </div>
        <div id="signin-help" className="sr-only">
          Enter your email and password to sign in to your Advista account.
        </div>
      </form>
    </AuthShell>
  );
}
