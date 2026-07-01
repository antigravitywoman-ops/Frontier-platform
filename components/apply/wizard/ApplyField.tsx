import type { ReactNode } from "react";
import { HintPopover } from "@/components/ui/Tippy";
import {
  authGlassInputClassName,
  authGlassLabelClassName,
} from "@/components/auth/AuthShell";

type ApplyFieldProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
};

export function ApplyField({
  label,
  htmlFor,
  hint,
  optional,
  className = "",
  children,
}: ApplyFieldProps) {
  return (
    <div className={className}>
      <div className="mb-2 flex items-center gap-2">
        <label htmlFor={htmlFor} className={authGlassLabelClassName}>
          {label}
          {optional ? (
            <span className="ml-1.5 font-light text-pure-white/45">(optional)</span>
          ) : null}
        </label>
        {hint ? <HintPopover hint={hint} label={`Help for ${label}`} /> : null}
      </div>
      {children}
    </div>
  );
}

export const applyInputClassName = authGlassInputClassName;

export const applySelectClassName = applyInputClassName;
