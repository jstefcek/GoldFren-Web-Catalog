import React from 'react';
import Hadicka_Layout from "../../components/DetailsPages/Prislusenstvi_Layout";
const serverUrl = import.meta.env.VITE_API_URL;

function prislusenstvi_detail() {
  return (
    <div className="container mx-auto">
      <Hadicka_Layout category="prislusenstvi_detail" apiUrl={`${serverUrl}/api/goldfren/internal/prislusenstvi/`} />
    </div>
  );
}

export default prislusenstvi_detail;