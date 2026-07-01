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
      <div className="mb-1 flex items-center gap-1.5">
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

export const applySelectClassName =
  "w-full cursor-pointer appearance-none rounded-xl border border-pure-white/22 bg-[#094f57] bg-[length:0.85rem] bg-[right_0.75rem_center] bg-no-repeat px-4 py-3 pr-10 font-sans text-sm font-normal text-pure-white outline-none backdrop-blur-md transition-colors focus:border-pure-white/40 focus:bg-[#083f46] focus:ring-2 focus:ring-pure-white/20 [color-scheme:dark] [background-image:url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%20stroke%3D%22white%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] [&>option]:bg-[#094f57] [&>option]:text-pure-white";

export const applyScrollHiddenClassName =
  "overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

export const applyFormCardClassName = `min-h-0 flex-1 rounded-[1.25rem] border border-pure-white/15 bg-pure-white/8 p-3 backdrop-blur-md sm:p-4 ${applyScrollHiddenClassName}`;
