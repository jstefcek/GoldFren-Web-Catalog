import React from 'react';
import Desticka_Layout from "../../components/DetailsPages/Desticka_Layout"
const serverUrl = import.meta.env.VITE_API_URL;

function desticka_detail() {
  return (
    <div className="container mx-auto">
      <Desticka_Layout category="desticka_detail" apiUrl={`${serverUrl}/api/goldfren/internal/desticky/`} />
    </div>
  );
}

export default desticka_detail;