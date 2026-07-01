"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useMemo, useState } from "react";
import { frontierSidebarIcons } from "@/components/icons/frontier/frontier-sidebar-icons";
import { ChatThreadList } from "@/components/chat/ChatThreadList";
import { ProviderChatPageSkeleton } from "@/components/chat/ChatSkeletons";
import { ProviderActiveThread } from "@/components/portal/provider/messages/ProviderActiveThread";
import { ProviderPortalPageShell } from "@/components/portal/provider/shared/ProviderPortalPageShell";
import {
  TOOLBAR_ICON_SIZE,
  toolbarBtnClass,
} from "@/components/portal/provider/shared/ProviderPageToolbar";
import { useProviderUnreadTotal, useChat } from "@/context/ChatProvider";
import { useProviderDashboard } from "@/context/ProviderPortalProvider";

function ChatPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[min(720px,calc(100dvh-14rem))] min-h-[520px] overflow-hidden rounded-[1.35rem] border border-deep-teal/8 bg-pure-white">
      {children}
    </div>
  );
}

export function ProviderChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { threads, loading, error, ensureDoctorThread, refreshThreads } = useChat();
  const providerUnreadTotal = useProviderUnreadTotal();
  const { branding } = useProviderDashboard();
  const patientParam = searchParams.get("patient");
  const [activePatientId, setActivePatientId] = useState<string | null>(
    patientParam ?? threads[0]?.patientId ?? null,
  );

  const subtitle = useMemo(() => {
    if (loading && threads.length === 0) return "Loading…";
    const countLabel = `${threads.length} conversation${threads.length === 1 ? "" : "s"}`;
    const unreadLabel =
      providerUnreadTotal > 0
        ? `${providerUnreadTotal} unread`
        : null;
    const clinicName = branding.clinicName?.trim();
    return [countLabel, unreadLabel, clinicName].filter(Boolean).join(" · ");
  }, [loading, threads.length, providerUnreadTotal, branding.clinicName]);

  useEffect(() => {
    if (patientParam) {
      setActivePatientId(patientParam);
      void ensureDoctorThread(patientParam);
    }
  }, [patientParam, ensureDoctorThread]);

  useEffect(() => {
    if (!patientParam && !activePatientId && threads[0]?.patientId) {
      setActivePatientId(threads[0].patientId);
    }
  }, [threads, patientParam, activePatientId]);

  const activeThread = threads.find((thread) => thread.patientId === activePatientId);

  function selectPatient(patientId: string) {
    setActivePatientId(patientId);
    startTransition(() => {
      router.replace(`/portal/doctor/messages?patient=${patientId}`, { scroll: false });
    });
    void ensureDoctorThread(patientId);
  }

  const headerActions = (
    <button
      type="button"
      onClick={() => void refreshThreads({ force: true })}
      disabled={loading}
      className={toolbarBtnClass}
      aria-label="Refresh conversations"
    >
      <frontierSidebarIcons.refreshCw
        size={TOOLBAR_ICON_SIZE}
        className={loading ? "animate-spin" : ""}
        aria-hidden="true"
      />
      <span className="hidden sm:inline">Refresh</span>
    </button>
  );

  if (loading && threads.length === 0) {
    return (
      <ProviderPortalPageShell title="Messages" subtitle="Loading…" actions={headerActions}>
        <ProviderChatPageSkeleton />
      </ProviderPortalPageShell>
    );
  }

  if (error) {
    return (
      <ProviderPortalPageShell title="Messages" subtitle={subtitle} actions={headerActions}>
        <div className="rounded-[1.35rem] border border-deep-teal/8 bg-pure-white p-8 text-center">
          <p className="text-sm text-coral-blush">{error}</p>
          <button
            type="button"
            onClick={() => void refreshThreads({ force: true })}
            className="mt-4 rounded-full bg-deep-teal px-4 py-2 text-sm font-light text-pure-white hover:bg-pacific-teal"
          >
            Retry
          </button>
        </div>
      </ProviderPortalPageShell>
    );
  }

  return (
    <ProviderPortalPageShell
      title="Messages"
      subtitle={subtitle}
      actions={headerActions}
      data-tour="doctor-messages-page"
    >
      <ChatPanel>
        <aside
          className={`flex w-full flex-col border-deep-teal/10 bg-pure-white lg:w-[360px] lg:shrink-0 lg:border-r ${
            activeThread ? "hidden lg:flex" : "flex"
          }`}
          data-tour="doctor-messages-thread-list"
        >
          {threads.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-deep-teal/50">
              No conversations yet. Start one from a patient profile or customer list.
            </p>
          ) : (
            <div className="min-h-0 flex-1 overflow-y-auto">
              <ChatThreadList
                threads={threads}
                activePatientId={activePatientId}
                onSelect={selectPatient}
                viewerRole="provider"
              />
            </div>
          )}
        </aside>

        <main
          className={`min-w-0 flex-1 flex-col ${
            activeThread ? "flex" : "hidden lg:flex"
          }`}
          data-tour="doctor-messages-compose"
        >
          {activeThread ? (
            <ProviderActiveThread
              thread={activeThread}
              onBack={() => {
                setActivePatientId(null);
                startTransition(() => {
                  router.replace("/portal/doctor/messages", { scroll: false });
                });
              }}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center bg-coral-blush/25 px-6 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-deep-teal/8 text-deep-teal/40">
                <frontierSidebarIcons.messageSquare size={32} aria-hidden="true" />
              </span>
              <p className="mt-4 max-w-xs text-sm text-deep-teal/55">
                Select a conversation to view messages with your patients.
              </p>
            </div>
          )}
        </main>
      </ChatPanel>
    </ProviderPortalPageShell>
  );
}
