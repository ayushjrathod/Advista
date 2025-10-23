import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { handleApiError } from "@/lib/auth-utils";
import { verifyCodeSchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function VerifyAccount() {
  const navigate = useNavigate();
  const params = useParams();
  const [isResending, setIsResending] = useState(false);

  const form = useForm({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      verify_code: "",
    },
  });

  const verifyCodeRef = useRef(null);

  // Auto-focus first input on mount
  useEffect(() => {
    if (verifyCodeRef.current) {
      verifyCodeRef.current.focus();
    }
  }, []);

  const onSubmit = async (data) => {
    // Ensure verification code is exactly 6 digits
    if (!data.verify_code || data.verify_code.length !== 6) {
      alert("Please enter a 6-digit verification code");
      return;
    }

    try {
      await api.post("/api/v1/auth/verify-email", {
        email: params.email,
        verify_code: data.verify_code,
      });

      navigate("/sign-in", { replace: true });
    } catch (error) {
      handleApiError(error, "Verification failed. Please try again.", false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      await api.post("/api/v1/auth/resend-verification", {
        email: params.email,
      });
    } catch (error) {
      handleApiError(error, "Failed to resend verification code. Please try again.", false);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthShell
      title="Verify your account"
      description="Enter the six-digit code we emailed you to activate your Advista account."
      footer={
        <p className="text-white">
          Didn’t receive an email? Check your spam folder or{" "}
          <Link to="/sign-in" className="font-semibold text-white">
            return to sign in
          </Link>
          .
        </p>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          role="form"
          aria-label="Email verification form"
        >
          <FormField
            control={form.control}
            name="verify_code"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-white">Verification code</FormLabel>
                <Input
                  {...field}
                  ref={verifyCodeRef}
                  value={field.value || ""}
                  placeholder="000000"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="tracking-[0.35em] rounded-lg border-white/10 bg-slate-950/60 text-center text-lg font-semibold uppercase text-white placeholder:text-slate-400/80 focus-visible:border-sky-400/70 focus-visible:ring-sky-400/60 focus-visible:ring-offset-0"
                  maxLength={6}
                  disabled={form.formState.isSubmitting}
                  aria-describedby="verify-help"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <div id="verify-help" className="sr-only">
            Enter the 6-digit verification code sent to your email address.
          </div>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full rounded-lg bg-primary/90 text-primary-foreground shadow-[0_25px_80px_-45px_rgba(59,130,246,0.95)] cursor-pointer"
          >
            {form.formState.isSubmitting ? "Verifying..." : "Verify"}
          </Button>
          <div className="text-center">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending}
              className="text-sm text-sky-400 hover:text-sky-300 underline disabled:opacity-50 cursor-pointer"
            >
              {isResending ? "Sending..." : "Didn't receive a code? Resend"}
            </button>
          </div>
        </form>
      </Form>
    </AuthShell>
  );
}
