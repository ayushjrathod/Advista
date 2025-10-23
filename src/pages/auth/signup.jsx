import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordStrengthIndicator } from "@/components/ui/password-strength-indicator";
import api from "@/lib/api";
import { handleApiError } from "@/lib/auth-utils";
import { cn } from "@/lib/utils";
import { emailValidation, signUpSchema } from "@/schemas/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@uidotdev/usehooks";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [isCheckingEmail, setCheckingEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const debouncedEmail = useDebounce(email, 300);

  const navigate = useNavigate();
  const emailInputRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  // Auto-focus first input on mount
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const checkEmailUnique = async () => {
      if (!debouncedEmail) {
        setEmailMessage("");
        return;
      }

      // Validate email through Zod schema before making API call
      const emailValidationResult = emailValidation.safeParse(debouncedEmail);
      if (!emailValidationResult.success) {
        setEmailMessage(emailValidationResult.error.errors[0].message);
        return;
      }

      setCheckingEmail(true);
      setEmailMessage("");
      await api
        .get(`/api/v1/auth/check-email-unique?email=${debouncedEmail}`)
        .then((response) => {
          setEmailMessage(response.data.message);
        })
        .catch((error) => {
          const errorMessage = handleApiError(error, "Error checking email", false);
          setEmailMessage(errorMessage);
        })
        .finally(() => {
          setCheckingEmail(false);
        });
    };
    checkEmailUnique();
  }, [debouncedEmail]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      await api.post("/api/v1/auth/signup", data);

      navigate(`/verify/${email}`);
    } catch (error) {
      handleApiError(error, "There was a problem with your sign-up. Please try again.", false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      description="Join Advista to unlock AI-driven research workflows and human-centered insights."
      contentClassName="sm:space-y-7"
      footer={
        <p className="text-white">
          Already a member?{" "}
          <Link to="/sign-in" className="font-semibold text-white">
            Sign in
          </Link>
        </p>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" role="form" aria-label="Sign up form">
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-white">Email</FormLabel>
                <Input
                  {...field}
                  ref={emailInputRef}
                  onChange={(e) => {
                    field.onChange(e);
                    setEmail(e.target.value);
                  }}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="rounded-lg border-white/10 bg-slate-950/60 text-white placeholder:text-slate-400/80 focus-visible:border-sky-400/70 focus-visible:ring-sky-400/60 focus-visible:ring-offset-0"
                  disabled={isSubmitting}
                  aria-describedby="email-status"
                />
                <FormMessage />
                <div id="email-status" className="min-h-[1.5rem] text-sm">
                  {isCheckingEmail ? (
                    <span className="inline-flex items-center gap-2 text-slate-200">
                      <Loader2 className="h-4 w-4 animate-spin" /> Checking availability...
                    </span>
                  ) : emailMessage ? (
                    <span
                      className={cn(
                        "inline-flex items-center gap-2",
                        emailMessage === "Email is available" ? "text-emerald-400" : "text-rose-400"
                      )}
                    >
                      {emailMessage}
                    </span>
                  ) : null}
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-white">Password</FormLabel>
                <Input
                  {...field}
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  className="rounded-lg border-white/10 bg-slate-950/60 text-white placeholder:text-slate-400/80 focus-visible:border-sky-400/70 focus-visible:ring-sky-400/60 focus-visible:ring-offset-0"
                  disabled={isSubmitting}
                  onChange={(e) => {
                    field.onChange(e);
                    setPassword(e.target.value);
                  }}
                />
                <FormMessage />
                <PasswordStrengthIndicator password={password} />
              </FormItem>
            )}
          />

          <FormField
            name="confirm_password"
            control={form.control}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-white">Confirm Password</FormLabel>
                <Input
                  {...field}
                  name="confirm_password"
                  type="password"
                  autoComplete="confirm-password"
                  placeholder="Confirm your password"
                  className="rounded-lg border-white/10 bg-slate-950/60 text-white placeholder:text-slate-400/80 focus-visible:border-sky-400/70 focus-visible:ring-sky-400/60 focus-visible:ring-offset-0"
                  disabled={isSubmitting}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <div id="signup-help" className="sr-only">
            Create a new Advista account by providing your email and a strong password.
          </div>
          <Button
            type="submit"
            className="w-full rounded-lg bg-primary/90 text-primary-foreground shadow-[0_25px_80px_-45px_rgba(59,130,246,0.95)] cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account
              </span>
            ) : (
              "Sign up"
            )}
          </Button>
        </form>
      </Form>
    </AuthShell>
  );
}
