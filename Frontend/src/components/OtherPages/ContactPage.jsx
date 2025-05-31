import { MapPin, Phone, Mail, Clock, Building } from 'lucide-react';
import { useTranslation } from "react-i18next";

export default function Contact_Layout() {
  const { t } = useTranslation();

  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mt-4 mb-4">{t("contact.main_title")}</h1>
        
        <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="flex items-start">
                <MapPin className="text-red-600 mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h2 className="font-bold mb-2">{t("contact.contact_info")}</h2>
                  <p className="font-bold">GOLD FREN s.r.o.</p>
                  <p className="font-light">Poběžovice 29</p>
                  <p className="font-light">Poběžovice u Holic 130</p>
                  <p className="font-light">CZ – 534 01 Poběžovice u Holic</p>
                  <p>{t("contact.czech_republic")}</p>
                </div>
              </div>

              {/* Telefon Information */}
              <div className="flex items-start">
                <Phone className="text-red-600 mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <p className="font-bold mb-1">{t("contact.telephone")}</p>
                  <a href="tel:+420466682065" className="underline hover:text-red-600 font-light">
                    +420 466 682 065
                  </a>
                </div>
              </div>

              {/* Mobile Information */}
              <div className="flex items-start">
                <Phone className="text-red-600 mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <p className="font-bold mb-1">{t("contact.mobile")}</p>
                  <a href="tel:+420724373127" className="underline hover:text-red-600 font-light">
                    +420 724 373 127
                  </a>
                </div>
              </div>

              {/* Email Information */}
              <div className="flex items-start">
                <Mail className="text-red-600 mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <p className="font-bold mb-1">{t("contact.email")}</p>
                  <a href="mailto:goldfren@goldfren.cz" className="underline hover:text-red-600 font-light">
                    goldfren@goldfren.cz
                  </a>
                </div>
              </div>

              {/* Openning Information */}
              <div className="flex items-start">
                <Clock className="text-red-600 mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <p className="font-bold mb-1">{t("contact.opening_hours")}</p>
                  <p className="font-light">{t("contact.opening_hours_text")}</p>
                  <p className="font-light">{t("contact.opening_hours_text_clock")}</p>
                </div>
              </div>

              {/* Company Information */}
              <div className="flex items-start">
                <Building className="text-red-600 mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <p className="font-bold mb-1">{t("contact.company_info")}</p>
                  <p className="font-light">IČO: 25997971</p>
                  <p className="font-light">DIČ: CZ25997971</p>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="h-full">
              <div className="bg-gray-200 rounded-lg h-full min-h-64 flex items-center justify-center">
                <div className="w-full h-[400px] md:h-[700px] lg:h-[700px]">
                  <iframe
                    title="GOLD FREN s.r.o."
                    className="w-full h-full rounded-lg border border-gray-300 shadow-md"
                    src="https://maps.google.com/maps?width=100%25&amp;height=700&amp;hl=en&amp;q=GOLD%20FREN%20s.r.o.+(GOLD%20FREN%20s.r.o.)&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}