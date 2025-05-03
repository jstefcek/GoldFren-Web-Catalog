import { Routes, Route } from "react-router-dom";
import Header from "/src/layouts/Header";
import Home from "/src/pages/Home";
import Adaptery from "./pages/Adaptery";
import Adapter_Detail from "./pages/DetailPages/Adapter_Detail";
import Desticky from "./pages/Desticky";
import Desticka_Detail from "./pages/DetailPages/Desticka_Detail"
import Brzdice from "./pages/Brzdice";
import Brzdic_Detail from "./pages/DetailPages/Brzdic_Detail";
import Kotouce from "./pages/Kotouce";
import Kotouc_Detail from "./pages/DetailPages/Kotouc_Detail";
import Hadicky from "./pages/Hadicky";
import Hadicka_Detail from "./pages/DetailPages/Hadicka_Detail";
import Pumpy from "./pages/Pumpy";
import Pumpa_Detail from "./pages/DetailPages/Pumpa_Detail";
import Prislusenstvi from "./pages/Prislusenstvi";
import Prislusenstvi_Detail from "./pages/DetailPages/Prislusenstvi_Detail";
import Contact from "./pages/Contact";
import "/src/localization/language_setup";
import Footer from "./layouts/Footer"

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/adaptery" element={<Adaptery />} />
          <Route path="/adaptery/:id" element={<Adapter_Detail />} />
          <Route path="/desticky" element={<Desticky />} />
          <Route path="/desticky/:id" element={<Desticka_Detail />} />
          <Route path="/brzdice" element={<Brzdice />} />
          <Route path="/brzdice/:id" element={<Brzdic_Detail />} />
          <Route path="/kotouce" element={<Kotouce />} />
          <Route path="/kotouce/:id" element={<Kotouc_Detail />} />
          <Route path="/hadicky" element={<Hadicky />} />
          <Route path="/hadicky/:id" element={<Hadicka_Detail />} />
          <Route path="/pumpy" element={<Pumpy />} />
          <Route path="/pumpy/:id" element={<Pumpa_Detail />} />
          <Route path="/prislusenstvi" element={<Prislusenstvi />} />
          <Route path="/prislusenstvi/:id" element={<Prislusenstvi_Detail />} />
          <Route path="/kontakt" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;