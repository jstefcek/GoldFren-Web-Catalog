import { Routes, Route } from "react-router-dom";
import Header from "/src/layouts/Header";
import Home from "/src/pages/Home";
import Adaptery from "./pages/Adaptery";
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
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;