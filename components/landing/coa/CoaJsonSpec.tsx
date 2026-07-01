import { COA_JSON_SPEC } from "@/lib/landing/coa-section";

type CoaJsonSpecProps = {
  highlightAll?: boolean;
  activeJsonKey?: string | null;
  vialHovered?: boolean;
};

function isJsonValueHighlighted(
  key: string,
  highlightAll: boolean,
  activeJsonKey: string | null,
) {
  if (highlightAll) return true;
  if (!activeJsonKey) return false;
  return key === activeJsonKey;
}

export function CoaJsonSpec({
  highlightAll = false,
  activeJsonKey = null,
  vialHovered = false,
}: CoaJsonSpecProps) {
  const { batch_id, facility, vial_linked, panels } = COA_JSON_SPEC;
  const engaged = highlightAll || activeJsonKey !== null || vialHovered;

  const keyClass = (key?: string) => {
    if (key && isJsonValueHighlighted(key, highlightAll, activeJsonKey)) {
      return "text-[#9debd8]";
    }
    return "text-[#8fd4c8]";
  };

  const stringClass = (key: string, passTone = false) => {
    const highlighted = isJsonValueHighlighted(key, highlightAll, activeJsonKey);
    if (highlighted) {
      return passTone ? "text-[#8dffc0]" : "text-pure-white";
    }
    return passTone ? "text-[#72ddb0]" : "text-pure-white/95";
  };

  const punctClass = "text-pure-white/72";

  return (
    <div
      className={`overflow-hidden rounded-xl border font-mono antialiased transition-all duration-500 ease-out ${
        engaged
          ? "border-pacific-teal/45 bg-[#081016] shadow-[0_0_0_1px_rgba(13,113,123,0.22),0_18px_48px_rgba(0,0,0,0.45)]"
          : "border-white/14 bg-[#081016] shadow-[0_18px_48px_rgba(0,0,0,0.35)]"
      }`}
    >
      <div className="flex items-center gap-3 border-b border-white/10 bg-[#0a1114] px-4 py-3 sm:px-5">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <p className="truncate text-[0.75rem] font-medium uppercase tracking-[0.1em] text-pure-white/88">
          batch_certificate.json
        </p>
        <span className="ml-auto rounded border border-white/14 px-2 py-0.5 text-[0.6875rem] text-pure-white/70">
          JSON
        </span>
      </div>

      <div className="border-b border-white/8 bg-[#0b151c] px-4 py-2.5 text-[0.8125rem] sm:px-5">
        <span className="text-pacific-teal">$</span>{" "}
        <span className="text-pure-white/92">cat batch_certificate.json</span>
      </div>

      <div className="space-y-0.5 bg-[#0a1218] p-4 text-[0.875rem] leading-[1.75] sm:p-5 sm:text-[0.9rem] lg:p-6 lg:text-[0.9375rem]">
        <p className={punctClass}>{`{`}</p>

        <p className="pl-4">
          <span className={keyClass("batch_id")}>&quot;batch_id&quot;</span>
          <span className={punctClass}>: </span>
          <span className={`transition-colors duration-300 ${stringClass("batch_id")}`}>
            &quot;{batch_id}&quot;
          </span>
          <span className={punctClass}>,</span>
        </p>

        <p className="pl-4">
          <span className={keyClass()}>&quot;facility&quot;</span>
          <span className={punctClass}>: </span>
          <span
            className={`transition-colors duration-300 ${
              highlightAll || engaged ? "text-pure-white" : "text-pure-white/95"
            }`}
          >
            &quot;{facility}&quot;
          </span>
          <span className={punctClass}>,</span>
        </p>

        <p className="pl-4">
          <span className={keyClass()}>&quot;vial_linked&quot;</span>
          <span className={punctClass}>: </span>
          <span
            className={`transition-colors duration-300 ${
              engaged ? "text-[#8dffc0]" : "text-[#72ddb0]"
            }`}
          >
            {String(vial_linked)}
          </span>
          <span className={punctClass}>,</span>
        </p>

        <p className="pl-4">
          <span className={keyClass()}>&quot;panels&quot;</span>
          <span className={punctClass}>: {`{`}</span>
        </p>

        {Object.entries(panels).map(([key, value], index, arr) => (
          <p key={key} className="pl-8">
            <span className={`transition-colors duration-300 ${keyClass(key)}`}>
              &quot;{key}&quot;
            </span>
            <span className={punctClass}>: </span>
            <span
              className={`transition-colors duration-300 ${stringClass(key, value === "pass")}`}
            >
              &quot;{value}&quot;
            </span>
            {index < arr.length - 1 ? <span className={punctClass}>,</span> : null}
          </p>
        ))}

        <p className={`pl-4 ${punctClass}`}>{`}`}</p>
        <p className={punctClass}>{`}`}</p>
      </div>
    </div>
  );
}
