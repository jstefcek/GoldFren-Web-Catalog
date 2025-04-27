import React from 'react';
import Brzdice_Layout from "../../components/DetailsPages/Brzdice_Layout";
const serverUrl = import.meta.env.VITE_API_URL;

function brzdic_detail() {
  return (
    <div className="container mx-auto">
      <Brzdice_Layout category="brzdic_detail" apiUrl={`${serverUrl}/api/goldfren/internal/brzdice/`} />
    </div>
  );
}

export default brzdic_detail;