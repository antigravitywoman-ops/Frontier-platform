"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { COMPLIANCE_FAQ_ITEMS } from "@/lib/landing/compliance-faq-section";

export function ComplianceFaqAccordion() {
  const [openId, setOpenId] = useState<string | null>(COMPLIANCE_FAQ_ITEMS[0]?.id ?? null);

  return (
    <div>
      <ul className="divide-y divide-white/10">
        {COMPLIANCE_FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;

          return (
            <li key={item.id}>
              <button
                type="button"
                id={`faq-trigger-${item.id}`}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${item.id}`}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-5 py-[1.125rem] text-left transition-colors hover:text-pacific-teal sm:gap-6"
              >
                <span className="font-sans text-base font-normal tracking-[-0.01em] text-pure-white sm:text-lg">
                  {item.question}
                </span>
                <span
                  className="flex size-6 shrink-0 items-center justify-center text-pure-white/45"
                  aria-hidden
                >
                  {isOpen ? (
                    <Minus className="size-4" strokeWidth={1.75} />
                  ) : (
                    <Plus className="size-4" strokeWidth={1.75} />
                  )}
                </span>
              </button>

              <div
                id={`faq-panel-${item.id}`}
                role="region"
                aria-labelledby={`faq-trigger-${item.id}`}
                hidden={!isOpen}
                className="pb-[1.125rem]"
              >
                <p className="max-w-prose pr-8 font-sans text-base font-normal leading-relaxed text-pure-white/65 sm:pr-10">
                  {item.answer}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
