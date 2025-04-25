import { Routes, Route } from "react-router-dom";
import Header from "/src/layouts/Header";
import Home from "/src/pages/Home";
import Adaptery from "./pages/Adaptery";
import Desticky from "./pages/Desticky";
import Desticka_Detail from "./pages/DetailPages/Desticka_Detail"
import Brzdice from "./pages/Brzdice";
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
          <Route path="/desticky" element={<Desticky />} />
          <Route path="/desticky/:id" element={<Desticka_Detail />} />
          <Route path="/brzdice" element={<Brzdice />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;