import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import ConfirmDialog from "../ui/Custom_ConfirmDialog";
import AlertDialog from "../ui/Custom_AlertDialog";
import { dialogColumnsConfig } from "../../config/ColumnConfigs/AddDialog_Config";
import { SelectValueConfig } from "../../config/ColumnConfigs/EditDialog_Config";
import { transformFormData } from "../../config/DataTransormation/AddDialog_Transformation";
import FieldRenderer from "../FolderComponents/Field_Renderer";
import { uploadImage } from "../../hooks/UploadImage_APIHook";
import { isFileObject } from "../../utils/utils";

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
  const [alert, setAlert] = useState(null);

  // Validation state
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  // Field validation
  const isDisabled = (col) => col.editable === false;

  // Required fields
  const requiredKeys = useMemo(
    () =>
      (config?.fields || [])
        .filter((f) => f.required && f.show !== false && f.editable !== false)
        .map((f) => f.key),
    [config]
  );

  // Remove diacritics
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

  // Init/reset + static fallback
  useEffect(() => {
    if (!config || !isOpen) return;
    const initial = {};
    config.fields.forEach((col) => (initial[col.key] = ""));
    initial.vyrobce_label = "";
    setFormData(initial);
    setTouched({});
    setErrors({});

    const staticVyrobce =
      Array.isArray(SelectValueConfig.vyrobce) ? SelectValueConfig.vyrobce : [];
    setVyrobceOptions(staticVyrobce.map((o) => ({ ...o, value: String(o.value) })));
  }, [category, config, isOpen]);

  // Subkategorie when kategorie changes
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
  }, [formData.kategorie]);

  // Vyrobce when kategorie changes
  useEffect(() => {
    const dynamicConfig = SelectValueConfig.vyrobce?.[0];
    if (!formData.kategorie) return;

    if (!dynamicConfig) {
      const staticVyrobce =
        Array.isArray(SelectValueConfig.vyrobce) ? SelectValueConfig.vyrobce : [];
      const nextOpts = staticVyrobce.map((o) => ({ ...o, value: String(o.value) }));
      setVyrobceOptions(nextOpts);
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
          value: String(item.kod),
          label: item.nazev,
        }));

        const staticVyrobce =
          Array.isArray(SelectValueConfig.vyrobce) ? SelectValueConfig.vyrobce : [];
        const staticNorm = staticVyrobce.map((o) => ({ ...o, value: String(o.value) }));

        const nextOpts = mapped.length > 0 ? mapped : staticNorm;
        setVyrobceOptions(nextOpts);

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
        const staticVyrobce =
          Array.isArray(SelectValueConfig.vyrobce) ? SelectValueConfig.vyrobce : [];
        const nextOpts = staticVyrobce.map((o) => ({ ...o, value: String(o.value) }));
        setVyrobceOptions(nextOpts);
        setFormData((prev) => {
          if (!prev.vyrobce) return prev;
          const found = nextOpts.find((o) => String(o.value) === String(prev.vyrobce));
          const label = found?.label || "";
          return label && label !== prev.vyrobce_label
            ? { ...prev, vyrobce_label: label }
            : prev;
        });
      });
  }, [formData.kategorie]);

  // Auto-create username
  useEffect(() => {
    const first = formData.first_name?.[0] || "";
    const last = formData.last_name || "";
    const username = removeDiacritics((first + last).toLowerCase());
    setFormData((prev) => ({ ...prev, username }));
  }, [formData.first_name, formData.last_name]);

  // Auto-create model name
  useEffect(() => {
    const parts = [
      formData.vyrobce_label,
      formData.typ,
      formData.objem,
      formData.oznaceni,
    ]
      .map((p) => (typeof p === "string" ? p.trim() : p))
      .filter(Boolean);

    const built = parts.join(" ").replace(/\s+/g, " ").trim();
    setFormData((prev) =>
      prev.nazev_modelu === built ? prev : { ...prev, nazev_modelu: built }
    );
  }, [formData.vyrobce_label, formData.oznaceni, formData.typ, formData.objem]);

  // Validation
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
        return !val;
      default:
        return String(val).trim() === "";
    }
  };

  // Field validation
  const validateField = (key) => {
    const col = config?.fields.find((f) => f.key === key);
    if (!col || !col.required || isDisabled(col)) return null;
    const hasError = isEmptyValue(formData[key], col.dataType, col.type);
    return hasError ? "Toto pole je povinné." : null;
  };

  // Validate all fields
  const validateAll = () => {
    const newErrors = {};
    for (const key of requiredKeys) {
      const msg = validateField(key);
      if (msg) newErrors[key] = msg;
    }
    setErrors(newErrors);
    return newErrors;
  };

  // Handle form field blur
  const handleBlur = (key) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const msg = validateField(key);
    setErrors((prev) => ({ ...prev, [key]: msg || undefined }));
  };

  // Change handler
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

  // Submit handler
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

  // Confirm dialog
  const handleConfirm = async () => {
    try {
      // First create the record to get the ID
      const response = await fetch(config.addEndpoint(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(access_token && { Authorization: `Bearer ${access_token}` }),
        },
        body: JSON.stringify(transformFormData(category, formData)),
      });

      if (!response.ok) {
        // try to extract server error message
        const errBody = await response.json().catch(() => ({}));
        const errMsg = errBody?.message || `Chyba při odeslání dat (${response.status})`;
        throw new Error(errMsg);
      }
      
      // Try to read response JSON; if none, treat as success without id
      const newRecord = await response.json().catch(() => ({}));
      if (!newRecord?.id) console.warn("Add returned no id:", newRecord);
      const newId = newRecord?.id;

      // Then upload the image if exists and we have an id
      if (newId && isFileObject(formData.obrazek)) {
        await uploadImage(
          formData.obrazek,
          category,
          newId,
          access_token
        );
      }

      if (newId && isFileObject(formData.vektor)) {
        await uploadImage(
          formData.vektor,
          category,
          newId,
          access_token
        );
      }

      onSuccess();
    } catch (error) {
      // normalize error message string
      const errorMessage = error instanceof Error ? error.message : String(error);

      setAlert({
        title: t("Chyba"),
        message: errorMessage,
        type: "error",
        duration: 5,
        onClose: () => setAlert(null),
      });

      // pass string to parent so parent can show it directly
      onError(errorMessage);
    } finally {
      setShowConfirm(false);
    }
  };

  // Dialog rendering
  if (!isOpen || !config) return null;
  const { fields } = config;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 sm:p-8">
        <div className="bg-white w-full max-w-5xl p-6 sm:p-8 rounded-2xl shadow-xl relative border border-gray-200">
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
                .map((col) => (
                  <FieldRenderer
                    key={col.key}
                    col={col}
                    value={formData[col.key]}
                    t={t}
                    isDisabled={isDisabled}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors[col.key]}
                    vyrobceOptions={vyrobceOptions}
                    filteredSubkategorie={filteredSubkategorie}
                  />
                ))}
            </div>

            {/* Remaining fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4 ml-4 mr-4">
              {fields
                .filter((f) => f.show !== false)
                .slice(1)
                .map((col) => (
                  <FieldRenderer
                    key={col.key}
                    col={col}
                    value={formData[col.key]}
                    t={t}
                    isDisabled={isDisabled}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors[col.key]}
                    vyrobceOptions={vyrobceOptions}
                    filteredSubkategorie={filteredSubkategorie}
                  />
                ))}
            </div>
          </div>

          {/* Footer part */}
          {/* Close button */}
          <div className="mt-8 flex justify-end gap-3">
            <button
              className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={onClose}
            >
              {t("Zavřít")}
            </button>

            {/* Add button */}
            <button
              className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              onClick={handleOpenConfirm}
            >
              {t("Přidat")}
            </button>
          </div>
        </div>
      </div>
      
      {/* Confirm dialog */}
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

      {/* Alert dialog */}
      {alert && <AlertDialog {...alert} />}
    </>
  );
}