import React from 'react';
import Adapter_Layout from "../../components/DetailsPages/Adapter_Layout";
const serverUrl = import.meta.env.VITE_API_URL;

function adapter_detail() {
  return (
    <div className="container mx-auto">
      <Adapter_Layout category="adapter_detail" apiUrl={`${serverUrl}/api/goldfren/internal/adaptery/`} />
    </div>
  );
}

export default adapter_detail;