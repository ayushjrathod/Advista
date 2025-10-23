import { validatePasswordStrength } from "@/lib/auth-utils";
import { cn } from "@/lib/utils";

export function PasswordStrengthIndicator({ password, className }) {
  if (!password) return null;

  const { score, strength, strengthColor, feedback } = validatePasswordStrength(password);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">Password strength:</span>
        <span className={cn("text-xs font-medium", strengthColor)}>
          {strength.charAt(0).toUpperCase() + strength.slice(1)}
        </span>
      </div>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-200",
              level <= score
                ? strength === "weak"
                  ? "bg-red-400"
                  : strength === "medium"
                  ? "bg-yellow-400"
                  : "bg-green-400"
                : "bg-slate-600"
            )}
          />
        ))}
      </div>

      {feedback.length > 0 && (
        <div className="text-xs text-slate-400">
          <p>Missing requirements:</p>
          <ul className="list-disc list-inside ml-2 space-y-0.5">
            {feedback.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

