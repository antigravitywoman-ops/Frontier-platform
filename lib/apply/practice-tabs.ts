export type PracticeTabId = "contact" | "practice" | "credentials" | "address";

export const PRACTICE_TABS: { id: PracticeTabId; label: string }[] = [
  { id: "contact", label: "Contact" },
  { id: "practice", label: "Practice" },
  { id: "credentials", label: "Licenses" },
  { id: "address", label: "Address" },
];

export const PRACTICE_TAB_ORDER: PracticeTabId[] = PRACTICE_TABS.map((tab) => tab.id);

export function getNextPracticeTab(tab: PracticeTabId): PracticeTabId | null {
  const index = PRACTICE_TAB_ORDER.indexOf(tab);
  if (index < 0 || index >= PRACTICE_TAB_ORDER.length - 1) {
    return null;
  }
  return PRACTICE_TAB_ORDER[index + 1];
}

export function getPracticeTabLabel(tab: PracticeTabId): string {
  return PRACTICE_TABS.find((item) => item.id === tab)?.label ?? tab;
}
