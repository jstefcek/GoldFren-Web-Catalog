import {
  Building,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Smartphone,
} from 'lucide-react';
import { useTranslation } from "react-i18next";

const MAP_LINK = "https://www.google.com/maps/search/?api=1&query=GOLD%20FREN%20s.r.o.";
const MAP_EMBED_URL = "https://maps.google.com/maps?width=100%25&height=520&hl=en&q=GOLD%20FREN%20s.r.o.+(GOLD%20FREN%20s.r.o.)&t=&z=13&ie=UTF8&iwloc=B&output=embed";

export default function Contact_Layout() {
  const { t } = useTranslation();

  const primaryContacts = [
    {
      icon: Phone,
      label: t("contact.telephone"),
      value: "+420 466 682 065",
      href: "tel:+420466682065",
    },
    {
      icon: Smartphone,
      label: t("contact.mobile"),
      value: "+420 724 373 127",
      href: "tel:+420724373127",
    },
    {
      icon: Mail,
      label: t("contact.email"),
      value: "goldfren@goldfren.cz",
      href: "mailto:goldfren@goldfren.cz",
    },
  ];

  const renderDetail = (Icon, title, children) => (
    <div className="flex gap-4 border-t border-gray-200 pt-5">
      <Icon className="mt-1 h-5 w-5 shrink-0 text-red-700" aria-hidden="true" />
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">{title}</h2>
        <div className="mt-2 space-y-1 text-base leading-7 text-gray-800">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative flex min-h-[420px] flex-col justify-between border-b border-gray-200 bg-white p-6 text-gray-950 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
              <div className="absolute left-0 top-8 h-24 w-1.5 bg-red-700" aria-hidden="true" />

              <div>
                <p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-red-700">
                  <MapPin size={17} aria-hidden="true" />
                  {t("contact.location_map")}
                </p>
                <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
                  {t("contact.main_title")}
                </h1>
                <p className="mt-5 max-w-lg text-base leading-7 text-gray-600">
                  {t("contact.intro")}
                </p>
              </div>

              <div className="mt-10 space-y-6">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">
                    {t("contact.contact_info")}
                  </h2>
                  <address className="mt-3 space-y-1 text-lg not-italic leading-7">
                    <p className="font-bold">GOLD FREN s.r.o.</p>
                    <p>Poběžovice 29</p>
                    <p>Poběžovice u Holic 130</p>
                    <p>CZ – 534 01 Poběžovice u Holic</p>
                    <p>{t("contact.czech_republic")}</p>
                  </address>
                </div>

                <a
                  href={MAP_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-red-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-white sm:w-auto"
                >
                  {t("contact.open_map")}
                  <ExternalLink size={17} aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="relative min-h-[360px] bg-gray-100 sm:min-h-[440px] lg:min-h-[560px]">
              <iframe
                title={t("contact.map_title")}
                className="absolute inset-0 h-full w-full border-0"
                src={MAP_EMBED_URL}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {primaryContacts.map(({ icon: Icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              className="group flex min-h-28 items-center gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-700 transition group-hover:bg-red-700 group-hover:text-white">
                <Icon size={22} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold uppercase tracking-wide text-gray-500">
                  {label}
                </span>
                <span className="mt-1 block break-words text-lg font-bold text-gray-950">
                  {value}
                </span>
              </span>
            </a>
          ))}
        </section>

        <section className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            {renderDetail(
              Clock,
              t("contact.opening_hours"),
              <>
                <p>{t("contact.opening_hours_text")}</p>
                <p className="font-bold text-gray-950">{t("contact.opening_hours_text_clock")}</p>
              </>
            )}

            {renderDetail(
              Building,
              t("contact.company_info"),
              <>
                <p>IČO: 25997971</p>
                <p>DIČ: CZ25997971</p>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
