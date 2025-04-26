import React from 'react';
import Desticka_Layout from "../../components/DetailsPages/Desticka_Layout"

function desticka_detail() {
  return (
    <div className="container mx-auto">
      <Desticka_Layout category="desticka_detail" apiUrl={"http://localhost/api/goldfren/internal/desticky/"} />
    </div>
  );
}

export default desticka_detail;