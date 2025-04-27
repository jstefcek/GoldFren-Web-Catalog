import React from 'react';
import Kotouc_Layout from "../../components/DetailsPages/Kotouc_Layout"
const serverUrl = import.meta.env.VITE_API_URL;

function kotouc_detail() {
  return (
    <div className="container mx-auto">
      <Kotouc_Layout category="kotouc_detail" apiUrl={`${serverUrl}/api/goldfren/internal/kotouce/`} />
    </div>
  );
}

export default kotouc_detail;