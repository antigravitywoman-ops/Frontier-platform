"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ApplyShell } from "@/components/apply/ApplyShell";
import { glassPrimaryButtonClassName } from "@/components/auth/AuthShell";
import { StepBanking } from "@/components/apply/wizard/StepBanking";
import { StepDocuments } from "@/components/apply/wizard/StepDocuments";
import { StepPracticeInfo } from "@/components/apply/wizard/StepPracticeInfo";
import { motion, transition } from "@/components/motion";
import { submitClinicApplication, uploadClinicDocuments } from "@/lib/apply/api";
import {
  getNextPracticeTab,
  getPracticeTabLabel,
  type PracticeTabId,
} from "@/lib/apply/practice-tabs";
import { storeApplicationSummary } from "@/lib/apply/storage";
import {
  INITIAL_BANKING,
  INITIAL_DOCUMENTS,
  INITIAL_PRACTICE,
  type ApplicationWizardState,
} from "@/lib/apply/types";
import {
  validateApplicationState,
  validateBankingStep,
  validateDocumentsStep,
  validatePracticeStep,
  validatePracticeTab,
} from "@/lib/apply/validation";
import { showError, toast } from "@/lib/toast";

const FINAL_STEP = 3;

export function ClinicApplicationWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [practiceTab, setPracticeTab] = useState<PracticeTabId>("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, setState] = useState<ApplicationWizardState>({
    practice: {
      ...INITIAL_PRACTICE,
      affiliateCode: searchParams.get("ref") ?? searchParams.get("affiliate") ?? "",
    },
    documents: INITIAL_DOCUMENTS,
    banking: INITIAL_BANKING,
  });

  useEffect(() => {
    const affiliateCode = searchParams.get("ref") ?? searchParams.get("affiliate");
    if (!affiliateCode) return;
    setState((current) => ({
      ...current,
      practice: { ...current.practice, affiliateCode },
    }));
  }, [searchParams]);

  function selectTab(nextStep: number) {
    if (nextStep === step) return;

    if (nextStep > step) {
      for (let current = step; current < nextStep; current += 1) {
        if (current === 1) {
          const error = validatePracticeStep(state.practice);
          if (error) return showError(new Error(error));
        }
        if (current === 2) {
          const error = validateDocumentsStep(state.documents);
          if (error) return showError(new Error(error));
        }
      }
    }

    setStep(nextStep);
  }

  function handleNext() {
    if (step === 1) {
      const tabError = validatePracticeTab(practiceTab, state.practice);
      if (tabError) {
        showError(new Error(tabError));
        return;
      }

      const nextPracticeTab = getNextPracticeTab(practiceTab);
      if (nextPracticeTab) {
        setPracticeTab(nextPracticeTab);
        return;
      }

      const error = validatePracticeStep(state.practice);
      if (error) {
        showError(new Error(error));
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      selectTab(3);
    }
  }

  async function handleSubmit() {
    const validationError = validateApplicationState(state);
    if (validationError) {
      showError(new Error(validationError));
      return;
    }

    const bankingError = validateBankingStep(state.banking);
    if (bankingError) {
      showError(new Error(bankingError));
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Submitting application…");

    try {
      const applyResult = await submitClinicApplication(state);
      storeApplicationSummary(applyResult.application);

      toast.dismiss(toastId);
      const uploadToastId = toast.loading("Uploading documents…");
      const uploadResult = await uploadClinicDocuments(
        applyResult.application.id,
        state.documents,
      );

      storeApplicationSummary({
        ...applyResult.application,
        application_status: uploadResult.application.application_status,
      });

      toast.dismiss(uploadToastId);
      toast.success(uploadResult.message);
      router.push(`/apply/submitted?ref=${applyResult.application.id}`);
    } catch (error) {
      toast.dismiss(toastId);
      showError(error, "Unable to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const nextLabel = (() => {
    if (step === 1) {
      const nextPracticeTab = getNextPracticeTab(practiceTab);
      if (nextPracticeTab) {
        return `Next: ${getPracticeTabLabel(nextPracticeTab)}`;
      }
      return "Next: Documents";
    }
    if (step === 2) return "Next: Banking";
    return "Submit application";
  })();

  const footer = (
    <div className="flex w-full justify-center">
      {step < FINAL_STEP ? (
        <button type="button" onClick={handleNext} className={glassPrimaryButtonClassName}>
          {nextLabel}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={isSubmitting}
          className={glassPrimaryButtonClassName}
        >
          {isSubmitting ? "Submitting…" : "Submit application"}
        </button>
      )}
    </div>
  );

  return (
    <ApplyShell currentStep={step} onTabChange={selectTab} footer={footer}>
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="flex min-h-0 flex-1 flex-col">
        {step === 1 ? (
          <StepPracticeInfo
            value={state.practice}
            onChange={(practice) => setState((current) => ({ ...current, practice }))}
            activeTab={practiceTab}
            onTabChange={setPracticeTab}
          />
        ) : null}
          {step === 2 ? (
            <StepDocuments
              value={state.documents}
              onChange={(documents) => setState((current) => ({ ...current, documents }))}
            />
          ) : null}
          {step === 3 ? (
            <StepBanking
              value={state.banking}
              onChange={(banking) => setState((current) => ({ ...current, banking }))}
            />
          ) : null}
        </div>
      </motion.div>
    </ApplyShell>
  );
}
