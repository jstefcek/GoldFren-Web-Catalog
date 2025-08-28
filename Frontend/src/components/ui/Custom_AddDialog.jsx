import { useState, useEffect, useMemo } from "react";
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

  // Form state
  const [formData, setFormData] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [vyrobceOptions, setVyrobceOptions] = useState([]);
  const [filteredSubkategorie, setFilteredSubkategorie] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState(null);

  // validation state
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const isDisabled = (col) => col.editable === false;
  const normalizeInputType = (t) => (t === "input" ? "text" : t || "text");

  const requiredKeys = useMemo(
    () =>
      (config?.fields || [])
        .filter((f) => f.required && f.show !== false && f.editable !== false)
        .map((f) => f.key),
    [config]
  );

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

  // Init/reset form data when category changes + set static manufacturer fallback
  useEffect(() => {
    if (!config) return;
    const initial = {};
    config.fields.forEach((col) => (initial[col.key] = ""));
    // also track vyrobce_label
    initial.vyrobce_label = "";

    setFormData(initial);
    setTouched({});
    setErrors({});

    // ensure vyrobce select is never empty (static fallback) + normalize value to string
    const staticVyrobce =
      Array.isArray(SelectValueConfig.vyrobce) ? SelectValueConfig.vyrobce : [];
    setVyrobceOptions(staticVyrobce.map((o) => ({ ...o, value: String(o.value) })));
  }, [category, config]);

  // Update subkategorie when kategorie changes
  useEffect(() => {
    if (!formData.kategorie) {
      setFilteredSubkategorie([]);
      return;
    }
    const selected = SelectValueConfig.kategorie_vozidel.find(
      (kat) => Number(kat.value) === Number(formData.kategorie)
    );
    if (!selected) {
      setFilteredSubkategorie([]);
      return;
    }
    const filtered = SelectValueConfig.subkategorie_vozidel.filter(
      (sub) => sub.category === selected.label
    );
    setFilteredSubkategorie(filtered);

    if (
      formData.subkategorie &&
      !filtered.some((sub) => sub.value === formData.subkategorie)
    ) {
      setFormData((prev) => ({ ...prev, subkategorie: "" }));
    }
  }, [formData.kategorie]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update vyrobce when kategorie changes
  useEffect(() => {
    const dynamicConfig = SelectValueConfig.vyrobce?.[0];

    // If no category chosen, keep whatever we already have (static fallback from init)
    if (!formData.kategorie) return;

    if (!dynamicConfig) {
      const staticVyrobce =
        Array.isArray(SelectValueConfig.vyrobce) ? SelectValueConfig.vyrobce : [];
      const nextOpts = staticVyrobce.map((o) => ({ ...o, value: String(o.value) }));
      setVyrobceOptions(nextOpts);

      // sync label if we already have an ID selected
      setFormData((prev) => {
        if (!prev.vyrobce) return prev;
        const found = nextOpts.find((o) => String(o.value) === String(prev.vyrobce));
        const label = found?.label || "";
        return label && label !== prev.vyrobce_label
          ? { ...prev, vyrobce_label: label }
          : prev;
      });
      return;
    }

    const url = `${dynamicConfig.api}?${dynamicConfig.param_key}=${formData.kategorie}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const mapped = (data || []).map((item) => ({
          id: item.kod,
          value: String(item.kod), // normalize to string
          label: item.nazev,
        }));

        const staticVyrobce =
          Array.isArray(SelectValueConfig.vyrobce) ? SelectValueConfig.vyrobce : [];
        const staticNorm = staticVyrobce.map((o) => ({ ...o, value: String(o.value) }));

        // fallback to static if API returns empty
        const nextOpts = mapped.length > 0 ? mapped : staticNorm;
        setVyrobceOptions(nextOpts);

        // If current selected vyrobce not in new options, clear it. Else sync label.
        setFormData((prev) => {
          if (!prev.vyrobce) return prev;
          const exists = nextOpts.some(
            (o) => String(o.value) === String(prev.vyrobce)
          );
          if (!exists) return { ...prev, vyrobce: "", vyrobce_label: "" };
          const found = nextOpts.find(
            (o) => String(o.value) === String(prev.vyrobce)
          );
          const label = found?.label || "";
          return label && label !== prev.vyrobce_label
            ? { ...prev, vyrobce_label: label }
            : prev;
        });
      })
      .catch(() => {
        // On error, fallback to static
        const staticVyrobce =
          Array.isArray(SelectValueConfig.vyrobce) ? SelectValueConfig.vyrobce : [];
        const nextOpts = staticVyrobce.map((o) => ({ ...o, value: String(o.value) }));
        setVyrobceOptions(nextOpts);

        // sync label if we already have an ID selected
        setFormData((prev) => {
          if (!prev.vyrobce) return prev;
          const found = nextOpts.find((o) => String(o.value) === String(prev.vyrobce));
          const label = found?.label || "";
          return label && label !== prev.vyrobce_label
            ? { ...prev, vyrobce_label: label }
            : prev;
        });
      });
  }, [formData.kategorie]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-create username 
  useEffect(() => {
    const first = formData.first_name?.[0] || "";
    const last = formData.last_name || "";
    const username = removeDiacritics((first + last).toLowerCase());
    setFormData((prev) => ({ ...prev, username }));
  }, [formData.first_name, formData.last_name]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-create model name
  useEffect(() => {
    const parts = [
      formData.vyrobce_label,
      formData.typ,
      formData.oznaceni,
      formData.vykon,
    ]
      .map((p) => (typeof p === "string" ? p.trim() : p))
      .filter(Boolean);

    const built = parts.join(" ").replace(/\s+/g, " ").trim();
    setFormData((prev) =>
      prev.nazev_modelu === built ? prev : { ...prev, nazev_modelu: built }
    );
  }, [formData.vyrobce_label, formData.oznaceni, formData.typ, formData.vykon]); // eslint-disable-line react-hooks/exhaustive-deps

  // Validation helpers 
  const isEmptyValue = (val, dataType = "string", type = "input") => {
    if (type === "button") return false;
    if (val === null || val === undefined) return true;

    switch (dataType) {
      case "string":
        return String(val).trim() === "";
      case "number": {
        if (val === "") return true;
        const n = Number(val);
        return Number.isNaN(n);
      }
      case "boolean":
        return !(val === true || val === false);
      case "image":
        return !val; // empty URL or base64
      default:
        return String(val).trim() === "";
    }
  };

  const validateField = (key) => {
    const col = config?.fields.find((f) => f.key === key);
    if (!col || !col.required || isDisabled(col)) return null;
    const hasError = isEmptyValue(formData[key], col.dataType, col.type);
    return hasError ? "Toto pole je povinné." : null;
  };

  const validateAll = () => {
    const newErrors = {};
    for (const key of requiredKeys) {
      const msg = validateField(key);
      if (msg) newErrors[key] = msg;
    }
    setErrors(newErrors);
    return newErrors;
  };

  const handleBlur = (key) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const msg = validateField(key);
    setErrors((prev) => ({ ...prev, [key]: msg || undefined }));
  };

  // Handle field change
  const handleChange = (key, value) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: value };

      if (key === "vyrobce") {
        const opt = vyrobceOptions.find(
          (o) => String(o.value) === String(value)
        );
        next.vyrobce_label = opt?.label || "";
      }

      return next;
    });

    if (touched[key]) {
      const msg = validateField(key);
      setErrors((prev) => ({ ...prev, [key]: msg || undefined }));
    }
  };

  // Submit flow
  const handleOpenConfirm = () => {
    const errs = validateAll();
    if (Object.keys(errs).length > 0) {
      setAlert({
        title: t("Neúplný formulář"),
        message: t("Vyplňte prosím všechna povinná pole označená červeně."),
        type: "error",
        duration: 5,
        onClose: () => setAlert(null),
      });
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch(config.addEndpoint(""), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(access_token && { Authorization: `Bearer ${access_token}` }),
        },
        // Keep vyrobce as ID for the API. If needed, cast to number in transformFormData.
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

  // Styling helpers
  const errorClass = (col) =>
    errors[col.key]
      ? "border-red-600 focus:ring-red-600"
      : "border-gray-300 focus:ring-gray-600";

  const commonFieldClasses = (col) =>
    `${
      isDisabled(col) ? "text-gray-500" : "text-gray-900"
    } px-3 py-2 border ${errorClass(
      col
    )} text-gray-700 rounded-md text-sm focus:outline-none focus:ring-2`;

  const fieldWrapper = (col, control) => {
    const hasError = !!errors[col.key];
    return (
      <div key={col.key} className="flex flex-col">
        <label className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-1">
          {t(col.label)}
          {col.required && <span className="text-red-600">*</span>}
        </label>
        {control}
        {hasError && (
          <span className="mt-1 text-xs text-red-600">{errors[col.key]}</span>
        )}
      </div>
    );
  };

  // Field renderer
  const renderField = (col, value) => {
    // Image preview
    if (col.type === "image") {
      return value ? (
        <img
          src={value}
          alt={col.label}
          className={`max-w-full max-h-36 object-contain border ${errorClass(
            col
          )} rounded-md bg-white`}
          onBlur={() => handleBlur(col.key)}
        />
      ) : (
        <div
          className={`max-w-full h-48 flex items-center justify-center border ${errorClass(
            col
          )} rounded-md bg-gray-50 text-gray-400`}
          onBlur={() => handleBlur(col.key)}
          tabIndex={0}
        >
          <ImageOff size={32} />
        </div>
      );
    }

    // Toggle buttons
    if (col.type === "button") {
      return (
        <div onBlur={() => handleBlur(col.key)}>
          <BooleanToggleButton
            value={!!value}
            editable={col.editable !== false}
            onChange={(val) => handleChange(col.key, val)}
            labels={col.buttonValue || { true: "Ano", false: "Ne" }}
          />
        </div>
      );
    }

    // Vyrobce select (API + fallback)
    if (col.key === "vyrobce") {
      const noOptions = (vyrobceOptions || []).length === 0;
      return (
        <select
          value={value || ""}
          onChange={(e) => handleChange(col.key, e.target.value)}
          onBlur={() => handleBlur(col.key)}
          disabled={isDisabled(col)}
          className={`px-3 py-2 border ${errorClass(
            col
          )} text-gray-700 rounded-md text-sm focus:outline-none focus:ring-2`}
        >
          <option value="">
            {col.placeholder ||
              (noOptions
                ? t("Nejprve vyberte kategorii")
                : t("Vyberte výrobce"))}
          </option>
          {!noOptions &&
            vyrobceOptions.map((opt) => (
              <option key={opt.id ?? opt.value} value={String(opt.value)}>
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
          onBlur={() => handleBlur(col.key)}
          disabled={isDisabled(col)}
          className={`px-3 py-2 border ${errorClass(
            col
          )} text-gray-700 rounded-md text-sm focus:outline-none focus:ring-2`}
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
      return (
        <select
          value={value || ""}
          onChange={(e) => handleChange(col.key, e.target.value)}
          onBlur={() => handleBlur(col.key)}
          disabled={isDisabled(col)}
          className={`px-3 py-2 border ${errorClass(
            col
          )} text-gray-700 rounded-md text-sm focus:outline-none focus:ring-2`}
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
          onBlur={() => handleBlur(col.key)}
          disabled={isDisabled(col)}
          className={`px-3 py-2 border ${errorClass(
            col
          )} text-gray-700 rounded-md text-sm focus:outline-none focus:ring-2`}
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
          onBlur={() => handleBlur(col.key)}
          rows={5}
          placeholder={col.placeholder || ""}
          disabled={isDisabled(col)}
          readOnly={isDisabled(col)}
          className={commonFieldClasses(col) + " resize-y"}
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
            onBlur={() => handleBlur(col.key)}
            placeholder={col.placeholder || ""}
            disabled={isDisabled(col)}
            readOnly={isDisabled(col)}
            className={commonFieldClasses(col) + " w-full"}
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

    // Read-only username / nazev_modelu
    if (col.key === "username" || col.key === "nazev_modelu") {
      return (
        <input
          type="text"
          value={value || ""}
          disabled
          onBlur={() => handleBlur(col.key)}
          className={`px-3 py-2 border ${errorClass(
            col
          )} bg-gray-100 text-gray-500 rounded-md text-sm cursor-not-allowed`}
        />
      );
    }

    // Default input
    return (
      <input
        type={normalizeInputType(col.type)}
        value={value || ""}
        onChange={(e) => handleChange(col.key, e.target.value)}
        onBlur={() => handleBlur(col.key)}
        placeholder={col.placeholder || ""}
        disabled={isDisabled(col)}
        readOnly={isDisabled(col)}
        className={commonFieldClasses(col)}
      />
    );
  };

  if (!isOpen || !config) return null;
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
            {/* First prominent field */}
            <div className="grid grid-cols-1 gap-4 ml-4 mr-4">
              {fields
                .filter((f) => f.show !== false)
                .slice(0, 1)
                .map((col) =>
                  fieldWrapper(col, renderField(col, formData[col.key]))
                )}
            </div>

            {/* Remaining fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4 ml-4 mr-4">
              {fields
                .filter((f) => f.show !== false)
                .slice(1)
                .map((col) =>
                  fieldWrapper(col, renderField(col, formData[col.key]))
                )}
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
              onClick={handleOpenConfirm}
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