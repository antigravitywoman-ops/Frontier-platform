"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  authGlassEyebrowClassName,
  authGlassTitleClassName,
  glassPrimaryButtonClassName,
  glassSecondaryButtonClassName,
} from "@/components/auth/AuthShell";
import { readApplicationSummary } from "@/lib/apply/storage";
import { formatApplicantName, type ClinicApplicationSummary } from "@/lib/apply/types";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-xs leading-relaxed text-pure-white/80">
      <span className="font-medium text-pure-white/90">{label}:</span> {value}
    </p>
  );
}

export function ApplicationSubmitted() {
  const searchParams = useSearchParams();
  const [application, setApplication] = useState<ClinicApplicationSummary | null>(null);

  useEffect(() => {
    const stored = readApplicationSummary();
    if (stored) {
      setApplication(stored);
      return;
    }

    const ref = searchParams.get("ref");
    if (ref) {
      setApplication({
        id: ref,
        clinic_name: "",
        email: "",
        first_name: "",
        last_name: "",
        application_status: "pending_review",
      });
    }
  }, [searchParams]);

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#0D717B] lg:flex-row">
      <aside className="relative hidden h-full min-h-0 shrink-0 overflow-hidden bg-[#3f8b98] lg:block lg:w-1/2">
        <div className="absolute -inset-10">
          <Image
            src="/assets/login/login.png"
            alt=""
            fill
            priority
            aria-hidden="true"
            className="object-cover object-center"
            sizes="50vw"
          />
        </div>
      </aside>

      <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden lg:w-1/2">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-[#094f57] via-[#0D717B] to-[#1aa3ad]" />
          <div className="absolute -left-24 top-[12%] size-80 rounded-full bg-[#3ec5cf]/25 blur-3xl" />
          <div className="absolute -right-20 bottom-[8%] size-96 rounded-full bg-[#011a24]/25 blur-3xl" />
          <div className="absolute left-1/3 top-1/2 size-64 -translate-y-1/2 rounded-full bg-pure-white/10 blur-3xl" />
        </div>

        <div className="relative z-[1] flex h-full min-h-0 flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="glass-ios glass-ios-panel flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-4 sm:px-6 sm:py-5">
              <div className="mx-auto w-full max-w-2xl text-center">
                <p className={authGlassEyebrowClassName}>Clinic application</p>

                <div className="mx-auto mt-3 flex size-11 items-center justify-center rounded-full border border-pure-white/20 bg-pure-white/12 text-pure-white backdrop-blur-md">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="m5 12 5 5L19 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <h1 className={`${authGlassTitleClassName} text-xl sm:text-2xl`}>
                  Application submitted
                </h1>
                <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-pure-white/72">
                  Your application is pending admin review. You&apos;ll receive an email once it has
                  been processed.
                </p>

                {application ? (
                  <div className="mt-3 rounded-xl border border-pure-white/15 bg-pure-white/8 p-3 text-left backdrop-blur-md sm:p-4">
                    <div className="grid gap-1.5">
                      {application.clinic_name ? (
                        <DetailRow label="Clinic" value={application.clinic_name} />
                      ) : null}
                      {application.email ? (
                        <DetailRow label="Email" value={application.email} />
                      ) : null}
                      {formatApplicantName(application) ? (
                        <DetailRow label="Applicant" value={formatApplicantName(application)} />
                      ) : null}
                      <DetailRow label="Reference" value={application.id} />
                      <DetailRow
                        label="Status"
                        value={application.application_status.replaceAll("_", " ")}
                      />
                    </div>
                  </div>
                ) : null}

                <div className="mt-4 flex justify-center">
                  <Link href="/login" className={glassPrimaryButtonClassName}>
                    Return to sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 grid shrink-0 grid-cols-1 gap-2 sm:grid-cols-2">
            <Link href="/" className={glassSecondaryButtonClassName}>
              Back to home
            </Link>
            <Link href="/login" className={glassSecondaryButtonClassName}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
