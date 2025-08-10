import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, Eye, EyeOff, ImageOff } from "lucide-react";
import ConfirmDialog from "../ui/Custom_ConfirmDialog";
import AlertDialog from "../ui/Custom_AlertDialog";
import BooleanToggleButton from "../ui/Custom_ButtonToggle";
import { dialogColumnsConfig } from "../../config/ColumnConfigs/AddDialog_Config";
import { SelectValueConfig } from "../../config/ColumnConfigs/EditDialog_Config";
import { transformFormData } from "../../config/DataTransormation/AddDialog_Transformation";

export default function CustomAddDialog({
  isOpen,
  onClose,
  category,
  access_token = null,
  onSuccess = () => {},
  onError = () => {},
}) {
  const { t } = useTranslation();
  const config = dialogColumnsConfig[category];
  const [formData, setFormData] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [vyrobceOptions, setVyrobceOptions] = useState([]);
  const [filteredSubkategorie, setFilteredSubkategorie] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState(null);
  const isDisabled = (col) => col.editable === false;
  const normalizeInputType = (t) => (t === "input" ? "text" : (t || "text"));

  // Remove diacritics for username generation
  const removeDiacritics = (str) =>
    str
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/č/g, "c")
      .replace(/ď/g, "d")
      .replace(/ě/g, "e")
      .replace(/ň/g, "n")
      .replace(/ř/g, "r")
      .replace(/š/g, "s")
      .replace(/ť/g, "t")
      .replace(/ů/g, "u")
      .replace(/ž/g, "z")
      .replace(/Č/g, "C")
      .replace(/Ď/g, "D")
      .replace(/Ě/g, "E")
      .replace(/Ň/g, "N")
      .replace(/Ř/g, "R")
      .replace(/Š/g, "S")
      .replace(/Ť/g, "T")
      .replace(/Ů/g, "U")
      .replace(/Ž/g, "Z");

  // Initial form data
  useEffect(() => {
    if (!config) return;
    const initial = {};
    config.fields.forEach((col) => (initial[col.key] = ""));
    setFormData(initial);
  }, [category]);

  // Update subkategorie when kategorie changes
  useEffect(() => {
    if (!formData.kategorie) {
      setFilteredSubkategorie([]);
      return;
    }

    // Convert both to numbers for comparison (or both to strings)
    const selected = SelectValueConfig.kategorie_vozidel.find((kat) => {
      // Convert both to numbers for comparison
      return Number(kat.value) === Number(formData.kategorie);
    });

    if (!selected) {
      setFilteredSubkategorie([]);
      return;
    }

    const filtered = SelectValueConfig.subkategorie_vozidel.filter((sub) => {
      return sub.category === selected.label;
    });

    setFilteredSubkategorie(filtered);

    // Only clear subkategorie if it's not valid for the current kategorie
    if (
      formData.subkategorie &&
      !filtered.some((sub) => sub.value === formData.subkategorie)
    ) {
      setFormData((prev) => ({ ...prev, subkategorie: "" }));
    }
  }, [formData.kategorie]);

  // Update vyrobce when kategorie changes
  useEffect(() => {
    const dynamicConfig = SelectValueConfig.vyrobce?.[0];

    if (!dynamicConfig || !formData.kategorie) return;

    const url = `${dynamicConfig.api}?${dynamicConfig.param_key}=${formData.kategorie}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((item) => ({
          id: item.kod,
          value: item.kod,
          label: item.nazev,
        }));
        setVyrobceOptions(mapped);
        setFormData((prev) => ({ ...prev, vyrobce: "" }));
      })
      .catch(() => setVyrobceOptions([]));
  }, [formData.kategorie]);

  // Auto create username
  useEffect(() => {
    const first = formData.first_name?.[0] || "";
    const last = formData.last_name || "";
    const username = removeDiacritics((first + last).toLowerCase());
    setFormData((prev) => ({ ...prev, username }));
  }, [formData.first_name, formData.last_name]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle confirm action
  const handleConfirm = async () => {
    try {
      const response = await fetch(config.addEndpoint(""), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(access_token && { Authorization: `Bearer ${access_token}` }),
        },
        body: JSON.stringify(transformFormData(category, formData)),
      });
      if (!response.ok) throw new Error("Chyba při odeslání dat");
      onSuccess();
    } catch (error) {
      setAlert({
        title: t("Chyba"),
        message: error.message,
        type: "error",
        duration: 5,
        onClose: () => setAlert(null),
      });
      onError(error.message);
    }
  };

  // Render form field
  const renderField = (col, value) => {
    // Image preview
    if (col.type === "image") {
      return value ? (
        <img
          src={value}
          alt={col.label}
          className="max-w-full max-h-36 object-contain border border-gray-300 rounded-md bg-white"
        />
      ) : (
        <div className="max-w-full h-48 flex items-center justify-center border border-gray-300 rounded-md bg-gray-50 text-gray-400">
          <ImageOff size={32} />
        </div>
      );
    }

    // Toggle buttons
    if (col.type === "button") {
      return (
        <BooleanToggleButton
          value={!!value}
          editable={col.editable !== false}
          onChange={(val) => handleChange(col.key, val)}
          labels={col.buttonValue || { true: "Ano", false: "Ne" }}
        />
      );
    }

    // Vyrobce select (from API)
    if (col.key === "vyrobce") {
      return (
        <select
          value={value || ""}
          onChange={(e) => handleChange(col.key, e.target.value)}
          disabled={isDisabled(col)}
          className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md text-sm"
        >
          <option value="">{col.placeholder || t("Vyberte výrobce")}</option>
          {vyrobceOptions.map((opt) => (
            <option key={opt.id} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    // Kategorie select
    if (col.key === "kategorie") {
      return (
        <select
          value={value || ""}
          onChange={(e) => handleChange(col.key, e.target.value)}
          disabled={isDisabled(col)}
          className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md text-sm"
        >
          <option value="">{col.placeholder || t("Vyberte kategorii")}</option>
          {col.value.map((opt) => (
            <option key={opt.id} value={opt.value}>
              {t(opt.label)}
            </option>
          ))}
        </select>
      );
    }

    // Subkategorie select
    if (col.key === "subkategorie") {
      console.log(
        "Rendering subkategorie, filtered options:",
        filteredSubkategorie
      );
      return (
        <select
          value={value || ""}
          onChange={(e) => handleChange(col.key, e.target.value)}
          disabled={isDisabled(col)}
          className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md text-sm"
        >
          <option value="">
            {col.placeholder || t("Vyberte subkategorii")}
          </option>
          {filteredSubkategorie.map((opt) => (
            <option key={opt.id} value={opt.value}>
              {t(opt.label)}
            </option>
          ))}
        </select>
      );
    }

    // Static select
    if (col.type === "select" && Array.isArray(col.value)) {
      return (
        <select
          value={value || ""}
          onChange={(e) => handleChange(col.key, e.target.value)}
          disabled={isDisabled(col)}
          className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md text-sm"
        >
          <option value="">{col.placeholder || t("Vyberte možnost")}</option>
          {col.value.map((opt) => (
            <option key={opt.id} value={opt.value}>
              {t(opt.label)}
            </option>
          ))}
        </select>
      );
    }

    // Textarea
    if (col.type === "textarea") {
      return (
        <textarea
          value={value || ""}
          onChange={(e) => handleChange(col.key, e.target.value)}
          rows={5}
          placeholder={col.placeholder || ""}
          disabled={isDisabled(col)}
          readOnly={isDisabled(col)}
          className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md text-sm resize-y"
        />
      );
    }

    // Password field
    if (col.type === "password") {
      return (
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={value || ""}
            onChange={(e) => handleChange(col.key, e.target.value)}
            placeholder={col.placeholder || ""}
            disabled={isDisabled(col)}
            readOnly={isDisabled(col)}
            className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isDisabled(col)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      );
    }

    // Read-only username
    if (col.key === "username" || col.key === "nazev_modelu") {
      return (
        <input
          type="text"
          value={value || ""}
          disabled
          className="px-3 py-2 border border-gray-300 bg-gray-100 text-gray-500 rounded-md text-sm cursor-not-allowed"
        />
      );
    }

    // Default input
    return (
      <input
        type={normalizeInputType(col.type)}
        value={value || ""}
        onChange={(e) => handleChange(col.key, e.target.value)}
        placeholder={col.placeholder || ""}
        disabled={isDisabled(col)}
        readOnly={isDisabled(col)}
        className={`${
          isDisabled(col) ? "text-gray-500" : "text-gray-900"
        } px-3 py-2 border border-gray-300 text-gray-700 rounded-md text-sm`}
      />
    );
  };

  // If dialog is not open or config is not available, return null
  if (!isOpen || !config) return null;

  // Fields configuration from file
  const { fields } = config;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 sm:p-8">
        <div className="bg-white w-full max-w-4xl p-6 sm:p-8 rounded-2xl shadow-xl relative border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">
            {t("Přidání nového záznamu")}
          </h2>
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-red-600 transition cursor-pointer"
            onClick={onClose}
          >
            <X size={36} />
          </button>

          <div className="overflow-y-auto max-h-[70vh] pr-2">
            <div className="grid grid-cols-1 gap-4 ml-4 mr-4">
              {fields
                .filter((f) => f.show !== false)
                .slice(0, 1)
                .map((col) => (
                  <div key={col.key} className="flex flex-col mb-4">
                    <label className="text-lg font-bold text-gray-900 mb-1">
                      {t(col.label)}
                    </label>
                    {renderField(col, formData[col.key])}
                  </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4 ml-4 mr-4">
              {fields
                .filter((f) => f.show !== false)
                .slice(1)
                .map((col) => (
                  <div key={col.key} className="flex flex-col">
                    <label className="text-sm font-bold text-gray-900 mb-1">
                      {t(col.label)}
                    </label>
                    {renderField(col, formData[col.key])}
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              onClick={onClose}
            >
              {t("Zavřít")}
            </button>
            <button
              className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700"
              onClick={() => setShowConfirm(true)}
            >
              {t("Přidat")}
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmDialog
          title={t("Potvrdit přidání")}
          message={t("Opravdu chcete přidat nový záznam?")}
          onConfirm={() => {
            handleConfirm();
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {alert && <AlertDialog {...alert} />}
    </>
  );
}
