import Link from "next/link";
import { FrontierLogo } from "@/components/FrontierLogo";
import { layoutContainerClass } from "@/lib/brand/design-system";
import { FOOTER_COLUMNS, LANDING_FOOTER } from "@/lib/landing/footer-section";

const CURRENT_YEAR = new Date().getFullYear();

export function LandingFooter() {
  const { contact } = LANDING_FOOTER;

  return (
    <footer className="bg-black text-pure-white">
      <div className={`${layoutContainerClass} py-14 sm:py-16 lg:py-20`}>
        <div className="grid grid-cols-1 gap-12 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,2.85fr)] xl:gap-16">
          <div className="max-w-md text-left">
            <Link href="/" aria-label="FrontierBioMed" className="inline-block">
              <FrontierLogo
                variant="white"
                className="!h-8 w-auto object-contain object-left transition-opacity hover:opacity-80 sm:!h-9"
              />
            </Link>

            <p className="mt-6 font-sans text-base font-normal leading-relaxed text-pure-white/72 sm:mt-7 sm:text-[1.0625rem]">
              {LANDING_FOOTER.tagline}
            </p>

            <address className="mt-6 space-y-1 not-italic">
              <p>
                <a
                  href={`mailto:${contact.email}`}
                  className="font-sans text-sm font-normal text-pure-white/58 transition-colors hover:text-pacific-teal"
                >
                  {contact.email}
                </a>
              </p>
              <p className="font-sans text-sm font-normal text-pure-white/48">{contact.entity}</p>
              <p className="font-sans text-sm font-normal leading-relaxed text-pure-white/48">
                {contact.address}
              </p>
            </address>
          </div>

          <nav
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-6"
            aria-label="Footer"
          >
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.id}>
                <p className="font-sans text-xs font-normal uppercase tracking-[0.08em] text-pure-white/38">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={`${column.id}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="font-sans text-sm font-normal text-pure-white/62 transition-colors hover:text-pure-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 border-t border-white/8 pt-8 sm:mt-14 sm:pt-10">
          <p className="max-w-4xl font-sans text-[0.8125rem] leading-[1.65] text-pure-white/58">
            {LANDING_FOOTER.disclaimer}
          </p>
        </div>

        <div className="mt-8 flex justify-end sm:mt-10">
          <div className="flex flex-col items-end gap-4 sm:flex-row sm:items-center sm:gap-8">
            <p className="font-sans text-xs font-normal text-pure-white/38">
              © {CURRENT_YEAR} {LANDING_FOOTER.copyright}
            </p>
            <ul className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2">
              {LANDING_FOOTER.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-xs font-normal text-pure-white/48 transition-colors hover:text-pure-white/72"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
