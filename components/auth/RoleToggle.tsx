"use client";

import type { UserRole } from "@/lib/auth/types";
import { authLabelClassName } from "@/components/auth/AuthShell";

const ROLE_LABELS: Record<UserRole, string> = {
  doctor: "Doctor",
  patient: "Patient",
  admin: "Admin",
  affiliate: "Affiliate",
};

export const DEFAULT_LOGIN_ROLES: UserRole[] = [
  "doctor",
  "patient",
  "admin",
  "affiliate",
];

type RoleToggleProps = {
  value: UserRole;
  onChange: (role: UserRole) => void;
  roles?: UserRole[];
  appearance?: "default" | "glass";
};

export function RoleToggle({
  value,
  onChange,
  roles = DEFAULT_LOGIN_ROLES,
  appearance = "default",
}: RoleToggleProps) {
  const isGlass = appearance === "glass";
  const legendClassName = isGlass ? "mb-3 block font-sans text-sm font-medium text-pure-white/88" : `${authLabelClassName} mb-3`;

  return (
    <fieldset>
      <legend className={legendClassName}>Role</legend>
      <div className="grid grid-cols-2 gap-2">
        {roles.map((roleValue) => {
          const label = ROLE_LABELS[roleValue];
          const isSelected = value === roleValue;
          return (
            <label
              key={roleValue}
              className={`flex min-h-11 cursor-pointer items-center justify-center rounded-xl border px-3 py-2.5 font-sans text-sm font-medium transition-all ${
                isGlass
                  ? isSelected
                    ? "border-pure-white/45 bg-pure-white/22 text-pure-white ring-2 ring-pure-white/20 backdrop-blur-md"
                    : "border-pure-white/18 bg-pure-white/8 text-pure-white/78 backdrop-blur-md hover:border-pure-white/30 hover:bg-pure-white/14"
                  : isSelected
                    ? "border-pacific-teal bg-pacific-teal/10 text-deep-teal ring-2 ring-pacific-teal/25"
                    : "border-deep-teal/15 bg-pure-white text-deep-teal/70 hover:border-deep-teal/25 hover:bg-deep-teal/[0.03]"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={roleValue}
                checked={isSelected}
                onChange={() => onChange(roleValue)}
                className="sr-only"
              />
              {label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
