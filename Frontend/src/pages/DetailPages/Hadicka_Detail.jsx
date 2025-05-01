import React from 'react';
import Hadicka_Layout from "../../components/DetailsPages/Hadicka_Layout";
const serverUrl = import.meta.env.VITE_API_URL;

function hadicka_detail() {
  return (
    <div className="container mx-auto">
      <Hadicka_Layout category="hadicka_detail" apiUrl={`${serverUrl}/api/goldfren/internal/hadicky/`} />
    </div>
  );
}

export default hadicka_detail;