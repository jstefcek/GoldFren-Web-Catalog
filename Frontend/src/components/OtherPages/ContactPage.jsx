import { MapPin, Phone, Mail, Clock, Building } from 'lucide-react';

export default function Contact_Layout() {
  return (
    <div className="py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10">Kontakt</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="flex items-start">
                <MapPin className="text-red-600 mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold mb-2">Adresa závodu, korespondenční, fakturační a dodací adresa:</h3>
                  <p className="font-bold">GOLD FREN s.r.o.</p>
                  <p>Poběžovice 29</p>
                  <p>Poběžovice u Holic 130</p>
                  <p>CZ – 534 01 Poběžovice u Holic</p>
                  <p>Czech Republic</p>
                </div>
              </div>

              {/* Telefon Information */}
              <div className="flex items-start">
                <Phone className="text-red-600 mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <p className="font-bold mb-1">Telefon:</p>
                  <p>00420 466 682 065</p>
                </div>
              </div>

              {/* Mobile Information */}
              <div className="flex items-start">
                <Phone className="text-red-600 mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <p className="font-bold mb-1">Mobil:</p>
                  <p>00420 724 373 127</p>
                </div>
              </div>

              {/* Email Information */}
              <div className="flex items-start">
                <Mail className="text-red-600 mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <p className="font-bold mb-1">E-mail:</p>
                  <p>goldfren@goldfren.cz</p>
                </div>
              </div>

              {/* Openning Information */}
              <div className="flex items-start">
                <Clock className="text-red-600 mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <p className="font-bold mb-1">Otevírací doba:</p>
                  <p>pouze v pracovní dny – pondělí až pátek:</p>
                  <p>7.00 – 15.30 hod.</p>
                </div>
              </div>

              {/* Company Information */}
              <div className="flex items-start">
                <Building className="text-red-600 mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <p className="font-bold mb-1">Firemní údaje:</p>
                  <p>IČO: 25997971</p>
                  <p>DIČ: CZ25997971</p>
                </div>
              </div>
            </div>

            {/* Picture */}
            <div className="h-full">
              <div className="bg-gray-200 rounded-lg h-full min-h-64 flex items-center justify-center">
                <img 
                  src="../public/goldfren_budova_cb.jpg"
                  alt="Mapa budovy GOLDfren" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}