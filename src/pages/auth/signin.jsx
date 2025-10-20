import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignInForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    if (!email || !password) {
      console.error("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    await api
      .post("/api/v1/auth/signin", {
        email,
        password,
      })
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Sign-in error:", error);
        console.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
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
      <form onSubmit={handleSubmit} className="">
        <div className="space-y-2 text-left mb-6">
          <Label htmlFor="identifier" className="text-sm font-semibold text-white">
            Email
          </Label>
          <Input
            id="email"
            type="text"
            ref={emailRef}
            autoComplete="email"
            placeholder="you@example.com"
            className="rounded-lg border-white/10 bg-slate-950/60 text-white placeholder:text-slate-400/80 focus-visible:border-sky-400/70 focus-visible:ring-sky-400/60 focus-visible:ring-offset-0"
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
          />
        </div>
        <Button
          className="w-full rounded-lg bg-primary/90 text-primary-foreground shadow-[0_25px_80px_-45px_rgba(59,130,246,0.95)]"
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
      </form>
    </AuthShell>
  );
}
