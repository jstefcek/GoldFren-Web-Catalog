import { useState, useEffect } from 'react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function NotFoundPage() {
  // Animation
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-start justify-center px-4 pt-24 pb-8">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-red-600 h-2 w-full"></div>
        
        <div className="p-8 flex flex-col items-center">
          {/* Error graphic */}
          <div className="relative mb-6">
            <div className="text-red-600">
              <AlertTriangle size={36} className="absolute -top-4 -right-4" />
              <div className="relative w-32 h-32 border-8 border-gray-300 rounded-full flex items-center justify-center" style={{ transform: `rotate(${rotation}deg)` }}>
                <div className="absolute top-0 w-6 h-6 bg-red-600 rounded-full"></div>
                <div className="absolute w-16 h-16 border-4 border-gray-400 rounded-full"></div>
                <div className="absolute w-6 h-6 bg-gray-800 rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Error message */}
          <h1 className="text-5xl font-bold text-gray-800 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Stránka nenalezena</h2>
          <p className="text-gray-600 text-center mb-8 max-w-md">
            Hledaná stránka neexistuje nebo byla přesunuta. <br></br>
            Vraťte se prosím na domovskou stránku.
          </p>
          
          {/* Home button */}
          <a href="/" className="flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
            <ArrowLeft size={18} className="mr-2" />
            Zpět na domovskou stránku
          </a>
        </div>
      </div>
    </div>
  );
}