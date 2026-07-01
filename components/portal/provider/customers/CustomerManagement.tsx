"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { frontierSidebarIcons } from "@/components/icons/frontier/frontier-sidebar-icons";
import { AddPatientModal } from "@/components/portal/provider/customers/AddPatientModal";
import { ProviderPortalPageShell } from "@/components/portal/provider/shared/ProviderPortalPageShell";
import {
  TOOLBAR_ICON_SIZE,
  toolbarBtnClass,
  toolbarBtnPrimaryClass,
} from "@/components/portal/provider/shared/ProviderPageToolbar";
import { getClinicProfile, invitePatient, listDoctorPatients } from "@/lib/doctor/api";
import { resolveClinicDisplayName } from "@/lib/provider/resolve-display-profile";
import {
  doctorPatientFullName,
  type DoctorPatient,
  type InvitePatientPayload,
} from "@/lib/doctor/types";
import { getPatientInitials } from "@/lib/patients/types";
import { fuseSearch } from "@/lib/search/fuse";
import { DOCTOR_PATIENT_SEARCH_KEYS } from "@/lib/search/keys";
import { showError, toast } from "@/lib/toast";
import { DOCTOR_ONBOARDING_EVENTS, emitDoctorOnboardingEvent } from "@/lib/onboarding/doctor/events";

type CustomerFilter = "all" | "active" | "invited";

function AccountPill({ patient }: { patient: DoctorPatient }) {
  if (patient.has_account) {
    const verified = patient.email_verified;
    return (
      <span className="inline-flex rounded-full bg-pacific-teal/12 px-2.5 py-1 text-xs font-medium text-pacific-teal">
        {verified === false ? "Account (unverified)" : "Active"}
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-deep-teal/8 px-2.5 py-1 text-xs font-medium text-deep-teal/70">
      Invited
    </span>
  );
}

export function CustomerManagement() {
  const [patients, setPatients] = useState<DoctorPatient[]>([]);
  const [clinicName, setClinicName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<CustomerFilter>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [canInvitePatients, setCanInvitePatients] = useState(false);

  const loadPatients = useCallback(async () => {
    setIsLoading(true);
    try {
      const [response, profile] = await Promise.all([
        listDoctorPatients({ page: 1, limit: 100 }),
        getClinicProfile(),
      ]);
      setPatients(response.patients);
      setClinicName(resolveClinicDisplayName(response.clinic_name ?? profile.clinic.clinic_name));
      setCanInvitePatients(profile.membership.permissions.includes("invite_patients"));
    } catch (error) {
      showError(error, "Unable to load patients.");
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPatients();
  }, [loadPatients]);

  const filteredPatients = useMemo(() => {
    let list = [...patients];
    if (filter === "active") list = list.filter((patient) => patient.has_account);
    if (filter === "invited") list = list.filter((patient) => !patient.has_account);

    if (search.trim()) {
      list = fuseSearch(list, search, DOCTOR_PATIENT_SEARCH_KEYS);
    }
    return list;
  }, [patients, search, filter]);

  async function handleInvite(payload: InvitePatientPayload) {
    try {
      const result = await invitePatient(payload);
      toast.success(result.message || `Invite sent to ${payload.email}.`);
      emitDoctorOnboardingEvent(DOCTOR_ONBOARDING_EVENTS.patientInvited);
      await loadPatients();
    } catch (error) {
      showError(error, "Unable to invite patient.");
      throw error;
    }
  }

  return (
    <>
      <ProviderPortalPageShell
        title="Customers"
        subtitle={
          isLoading
            ? "Loading…"
            : clinicName
              ? `${filteredPatients.length} patient${filteredPatients.length === 1 ? "" : "s"} · ${clinicName}`
              : `${filteredPatients.length} patient${filteredPatients.length === 1 ? "" : "s"}`
        }
        actions={
          <>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as CustomerFilter)}
              className="rounded-full border border-deep-teal/25 bg-pure-white px-4 py-2 text-sm capitalize text-deep-teal outline-none focus:border-deep-teal"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="invited">Invited</option>
            </select>
            <button
              type="button"
              onClick={() => void loadPatients()}
              disabled={isLoading}
              className={toolbarBtnClass}
              aria-label="Refresh patients"
            >
              <frontierSidebarIcons.refreshCw
                size={TOOLBAR_ICON_SIZE}
                className={isLoading ? "animate-spin" : ""}
                aria-hidden="true"
              />
            </button>
            {canInvitePatients ? (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className={toolbarBtnPrimaryClass}
                data-tour="doctor-customers-invite"
              >
                <frontierSidebarIcons.userPlus size={TOOLBAR_ICON_SIZE} aria-hidden="true" />
                <span className="hidden sm:inline">Invite patient</span>
              </button>
            ) : null}
          </>
        }
      >
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone…"
          className="w-full rounded-full border border-deep-teal/15 px-4 py-2 text-sm outline-none focus:border-pacific-teal sm:max-w-md"
        />
        <div className="overflow-hidden rounded-[1.35rem] border border-deep-teal/8 bg-pure-white">
          <div className="overflow-x-auto" data-tour="doctor-customers-list">
          <table className="provider-customers-table min-w-full text-left">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Account</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => {
                const name = doctorPatientFullName(patient);
                return (
                  <tr key={patient.id}>
                    <td>
                      <Link
                        href={`/portal/doctor/customers/${patient.id}`}
                        className="group flex items-center gap-3"
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-deep-teal/10 text-xs font-semibold text-deep-teal">
                          {getPatientInitials(name)}
                        </span>
                        <span className="font-medium text-deep-teal group-hover:text-pacific-teal">
                          {name}
                        </span>
                      </Link>
                    </td>
                    <td className="text-deep-teal/85">{patient.email}</td>
                    <td className="tabular-nums text-deep-teal/85">{patient.phone || "—"}</td>
                    <td>
                      <AccountPill patient={patient} />
                    </td>
                    <td>
                      <Link
                        href={`/portal/doctor/messages?patient=${patient.id}`}
                        className="text-sm font-medium text-pacific-teal hover:text-deep-teal hover:underline"
                      >
                        Chat
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {isLoading ? (
            <p className="px-4 py-10 text-center text-sm text-deep-teal/50">Loading patients…</p>
          ) : filteredPatients.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-deep-teal/50">
              {patients.length === 0
                ? canInvitePatients
                  ? "No patients yet. Invite your first patient to get started."
                  : "No patients yet."
                : "No patients match your filters."}
            </p>
          ) : null}
          </div>
        </div>
      </ProviderPortalPageShell>

      <AddPatientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleInvite}
      />
    </>
  );
}
