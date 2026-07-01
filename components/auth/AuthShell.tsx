"use client";

import Image from "next/image";
import { motion } from "@/components/motion";

const BACKGROUND_IMAGES = {
  hands: "/brand/brand image carrying hands.png",
  login: "/assets/login/login.png",
  "merch-jacket": "/brand/merch-jacket-embroidered-logo.png",
} as const;

type AuthShellProps = {
  children: React.ReactNode;
  background?: keyof typeof BACKGROUND_IMAGES | "video";
  compact?: boolean;
  disableAnimation?: boolean;
};

export function AuthShell({
  children,
  background = "hands",
  compact = false,
  disableAnimation = false,
}: AuthShellProps) {
  const isLoginBackground = background === "login";
  const panelBackgroundClass = isLoginBackground ? "bg-[#0D717B]" : "bg-pure-white";
  const panelClassName = compact
    ? `relative flex h-full min-h-0 w-full flex-col overflow-y-auto ${panelBackgroundClass} px-4 py-5 sm:px-5 lg:w-1/2 lg:justify-center lg:px-8 lg:py-6 xl:px-10`
    : `relative flex h-full min-h-0 w-full flex-col overflow-y-auto ${panelBackgroundClass} px-4 py-8 sm:px-6 sm:py-10 lg:w-1/2 lg:justify-center lg:px-12 xl:px-16`;

  const panelContent = (
    <>
      {isLoginBackground ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-[#094f57] via-[#0D717B] to-[#1aa3ad]" />
          <div className="absolute -left-24 top-[12%] size-80 rounded-full bg-[#3ec5cf]/25 blur-3xl" />
          <div className="absolute -right-20 bottom-[8%] size-96 rounded-full bg-[#011a24]/25 blur-3xl" />
          <div className="absolute left-1/3 top-1/2 size-64 -translate-y-1/2 rounded-full bg-pure-white/10 blur-3xl" />
        </div>
      ) : null}
      <div
        className={
          compact
            ? "relative z-[1] w-full max-w-2xl lg:mx-auto"
            : "relative z-[1] flex flex-1 flex-col items-center justify-center"
        }
      >
        <div className={compact ? "w-full" : "w-full max-w-xl"}>{children}</div>
      </div>
    </>
  );

  return (
    <div
      className={`flex h-dvh w-full flex-col overflow-hidden lg:flex-row ${panelBackgroundClass}`}
    >
      <aside
        className={`relative hidden h-full min-h-0 shrink-0 overflow-hidden lg:block lg:w-1/2 ${
          isLoginBackground ? "bg-[#3f8b98]" : ""
        }`}
      >
        {background === "video" ? (
          <video
            src="/brand/A_cinematic_slow_motion_macro.mp4"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : (
          <div
            className={
              isLoginBackground
                ? "absolute -inset-10"
                : "absolute inset-0"
            }
          >
            <Image
              src={BACKGROUND_IMAGES[background]}
              alt=""
              fill
              priority
              aria-hidden="true"
              className="object-cover object-center"
              sizes="50vw"
            />
          </div>
        )}
      </aside>

      {disableAnimation ? (
        <div className={panelClassName}>{panelContent}</div>
      ) : (
        <motion.div
          className={panelClassName}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {panelContent}
        </motion.div>
      )}
    </div>
  );
}

export function AuthCard({
  children,
  compact = false,
  variant = "default",
}: {
  children: React.ReactNode;
  compact?: boolean;
  variant?: "default" | "glass";
}) {
  if (variant === "glass") {
    return (
      <div
        className={
          compact
            ? "glass-ios glass-ios-panel p-4 sm:p-5"
            : "glass-ios glass-ios-panel p-5 sm:p-8 md:p-10"
        }
      >
        <div className="relative z-[1]">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={
        compact
          ? "rounded-2xl border border-deep-teal/10 bg-pure-white p-4 shadow-xl shadow-deep-teal/5 sm:rounded-[1.5rem] sm:p-5"
          : "rounded-2xl border border-deep-teal/10 bg-pure-white p-5 shadow-xl shadow-deep-teal/5 sm:rounded-[2rem] sm:p-8 md:p-10"
      }
    >
      {children}
    </div>
  );
}

export const authInputClassName =
  "w-full rounded-xl border border-deep-teal/15 bg-pure-white px-4 py-3 font-sans text-sm font-normal text-deep-teal outline-none transition-colors placeholder:text-deep-teal/40 focus:border-pacific-teal focus:ring-2 focus:ring-pacific-teal/20";

export const authInputCompactClassName =
  "w-full rounded-lg border border-deep-teal/15 bg-pure-white px-3 py-2 font-sans text-sm font-normal text-deep-teal outline-none transition-colors placeholder:text-deep-teal/40 focus:border-pacific-teal focus:ring-2 focus:ring-pacific-teal/20";

export const authEyebrowClassName =
  "font-sans text-xs font-semibold uppercase tracking-[0.14em] text-pacific-teal";

export const authTitleClassName =
  "mt-3 font-sans text-2xl font-extrabold tracking-[-0.02em] text-deep-teal sm:text-3xl";

export const authDescriptionClassName =
  "mt-2 font-sans text-base leading-relaxed text-deep-teal/65";

export const authLabelClassName =
  "mb-2 block font-sans text-sm font-medium text-deep-teal/85";

export const authLabelCompactClassName =
  "mb-1 block font-sans text-xs font-medium text-deep-teal/85";

export const authLinkClassName =
  "font-sans font-medium text-pacific-teal transition-colors hover:text-deep-teal hover:underline";

export const authSecondaryTextClassName = "font-sans text-sm text-deep-teal/60";

export const authDisclaimerClassName =
  "mt-6 font-sans text-xs leading-relaxed text-deep-teal/50";

export const authGlassEyebrowClassName =
  "font-sans text-xs font-semibold uppercase tracking-[0.14em] text-pure-white/75";

export const authGlassTitleClassName =
  "mt-3 font-sans text-2xl font-extrabold tracking-[-0.02em] text-pure-white sm:text-3xl";

export const authGlassDescriptionClassName =
  "mt-2 font-sans text-base leading-relaxed text-pure-white/78";

export const authGlassLabelClassName =
  "mb-2 block font-sans text-sm font-medium text-pure-white/88";

export const authGlassInputClassName =
  "w-full rounded-xl border border-pure-white/22 bg-pure-white/12 px-4 py-3 font-sans text-sm font-normal text-pure-white outline-none backdrop-blur-md transition-colors placeholder:text-pure-white/45 focus:border-pure-white/40 focus:bg-pure-white/16 focus:ring-2 focus:ring-pure-white/20";

export const authGlassLinkClassName =
  "font-sans font-medium text-pure-white/82 transition-colors hover:text-pure-white hover:underline";

export const authGlassDisclaimerClassName =
  "mt-6 font-sans text-xs leading-relaxed text-pure-white/58";
