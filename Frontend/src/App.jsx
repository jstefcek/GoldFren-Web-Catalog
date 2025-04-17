import { Routes, Route } from "react-router-dom";
import Header from "/src/layouts/Header";
import Home from "/src/pages/Home";
import "/src/localization/language_setup"

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Add other routes as needed */}
        </Routes>
      </main>
    </div>
  );
}

export default App;