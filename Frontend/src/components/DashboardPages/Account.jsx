import { useState } from "react";
import { ShieldCheck, Mail, User, Lock, ShieldUser } from "lucide-react";

export default function AccountLayout() {
  // Retrieve session data from sessionStorage
  const data = JSON.parse(sessionStorage.getItem("session_data") || "{}");
  console.log("Account data:", data);

  const user = {
    firstName: data.user.first_name || "XNA",
    lastName: data.user.last_name || "XNA",
    email: data.user.email || "XNA",
    isAdmin: data.user.isAdmin || false,
    isActive: true
  };

  // TODO: Implement password change functionality
  const [form, setForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  return (
    <div className="min-h-auto px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-auto mx-auto mt-4">
        
        {/* Admin section */}
        {user.isAdmin && (
          <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-400 rounded-lg p-2 shadow mb-4 flex items-center gap-6">
            <ShieldCheck className="w-12 h-12 text-yellow-700" strokeWidth={2.5} />
            <div>
              <div className="text-xl font-bold text-yellow-900">Administrátorský účet</div>
              <div className="text-yellow-800 mt-1 text-sm">
                Máte oprávnění administrátora. <br />
                <span className="italic text-sm">Máte k dispozici speciální funkce a ovládací prvky.</span>
              </div>
            </div>
          </div>
        )}

        {/* Main account info */}
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Přehled účtu</h1>
          <p className="text-gray-600 text-lg mb-4">Podrobnosti o vašem profilu</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <User className="w-8 h-8 text-red-700" />
              <div>
                <div className="text-gray-700 font-medium">Křestní jméno</div>
                <div className="text-gray-900 font-bold text-lg">{user.firstName}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <User className="w-8 h-8 text-red-700" />
              <div>
                <div className="text-gray-700 font-medium">Přijmení</div>
                <div className="text-gray-900 font-bold text-lg">{user.lastName}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <Mail className="w-8 h-8 text-red-700" />
              <div>
                <div className="text-gray-700 font-medium">E-mailová adresa</div>
                <div className="text-gray-900 font-bold text-lg">{user.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <ShieldUser className="w-8 h-8 text-red-700" />
              <div>
                <div className="text-gray-700 font-medium">Status účtu</div>
                <div className="text-gray-900 font-bold text-lg">{user.isActive && (
                  <span className="text-green-600">Aktivní</span>
                ) || (
                  <span className="text-red-800">Neaktivní</span>
                )}</div>
              </div>
            </div>

          </div>
        </div>

        {/* Password change section */}
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Změna hesla</h2>
          <p className="text-gray-600 mb-6">Níže můžete aktualizovat heslo k vašemu účtu.</p>
          <form
            className="grid grid-cols-1 gap-5 max-w-md"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Vaše aktuální heslo
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <Lock className="w-5 h-5 text-gray-400" />
                <input
                  className="bg-transparent outline-none flex-1"
                  type="password"
                  autoComplete="current-password"
                  value={form.current}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, current: e.target.value }))
                  }
                  placeholder="Vložte aktuální heslo"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Nové heslo
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <Lock className="w-5 h-5 text-gray-400" />
                <input
                  className="bg-transparent outline-none flex-1"
                  type="password"
                  autoComplete="new-password"
                  value={form.new}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, new: e.target.value }))
                  }
                  placeholder="Zadejte nové heslo"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Potvrzení nového hesla
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <Lock className="w-5 h-5 text-gray-400" />
                <input
                  className="bg-transparent outline-none flex-1"
                  type="password"
                  autoComplete="new-password"
                  value={form.confirm}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, confirm: e.target.value }))
                  }
                  placeholder="Zadejte znovu nové heslo"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg shadow cursor-pointer p-3"
            >
              Změnit heslo
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
