import React from 'react';
import Hadicka_Layout from "../../components/DetailsPages/Pumpa_Layout";
const serverUrl = import.meta.env.VITE_API_URL;

function pumpa_detail() {
  return (
    <div className="container mx-auto">
      <Hadicka_Layout category="pumpa_detail" apiUrl={`${serverUrl}/api/goldfren/internal/pumpy/`} />
    </div>
  );
}

export default pumpa_detail;