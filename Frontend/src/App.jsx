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
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;