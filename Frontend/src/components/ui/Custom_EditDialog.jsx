import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import ConfirmDialog from "../ui/Custom_ConfirmDialog";
import AlertDialog from "../ui/Custom_AlertDialog";
import { dialogColumnsConfig } from "../../config/ColumnConfigs/EditDialog_Config";
import { SelectValueConfig } from "../../config/ColumnConfigs/EditDialog_Config";
import { transformFormData } from "../../config/DataTransormation/EditDialog_Transformation";
import FieldRenderer from "../FolderComponents/Field_Renderer";
import { uploadImage } from "../../hooks/UploadImage_APIHook";
import { isFileObject } from "../../utils/utils";

const toStr = (v) => (v === null || v === undefined ? "" : String(v));
const norm = (v) => toStr(v).trim().toLowerCase();

// Find option by value or label
const findByValueOrLabel = (opts, raw) => {
  const needle = norm(raw);
  if (!needle) return undefined;
  return (opts || []).find(
    (o) => norm(o.value) === needle || norm(o.label) === needle
  );
};

export default function CustomEditDialog({
  isOpen,
  onClose,
  dialogTitle,
  rowData,
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

  // Check for form field errors
  const isDisabled = (col) => col.editable === false;

  const requiredKeys = useMemo(
    () =>
      (config?.fields || [])
        .filter((f) => f.required && f.show !== false && f.editable !== false)
        .map((f) => f.key),
    [config]
  );

  // Initialize form data from rowData
  useEffect(() => {
    if (!isOpen || !config || !rowData) return;

    const initial = {};
    (config.fields || []).forEach((col) => {
      initial[col.key] =
        rowData[col.key] !== undefined && rowData[col.key] !== null
          ? rowData[col.key]
          : "";

      // Special handling for setup_board type
      if (col.type === "setup_board") {
        const buildInitial = col.buildInitial || (() => ({}));
        initial[col.key] = buildInitial(rowData) || {
          assigned: [],
          available: [],
          changes: [],
        };
      }
    });

    // Normalize kategorie to option.value (accept label or value)
    const katOpt = findByValueOrLabel(
      SelectValueConfig.kategorie_vozidel,
      rowData.kategorie
    );
    if (katOpt) initial.kategorie = String(katOpt.value);

    // Build filtered subkategorie from normalized kategorie
    const katLabel =
      katOpt?.label ||
      (findByValueOrLabel(
        SelectValueConfig.kategorie_vozidel,
        initial.kategorie
      )?.label ??
        "");
    const subFiltered = (SelectValueConfig.subkategorie_vozidel || []).filter(
      (s) => s.category === katLabel
    );
    setFilteredSubkategorie(subFiltered);

    // Normalize subkategorie to option.value
    const subOpt = findByValueOrLabel(subFiltered, rowData.subkategorie);
    if (subOpt) initial.subkategorie = String(subOpt.value);

    // Normalize typ_desticky
    const typOpt = findByValueOrLabel(SelectValueConfig.typ_desticky, rowData.typ);
    if (typOpt) initial.typ = String(typOpt.value);

    // Manufacturer label (may not come from API yet)
    initial.vyrobce_label = rowData.vyrobce_label || "";

    // Ensure vyrobce stored as string (can be label or value for now; we reconcile later)
    if (rowData.vyrobce !== undefined && rowData.vyrobce !== null) {
      initial.vyrobce = String(rowData.vyrobce);
    }

    setFormData(initial);
    setTouched({});
    setErrors({});

    // Prepare static vyrobce fallback first (API may override)
    const staticVyrobce = Array.isArray(SelectValueConfig.vyrobce)
      ? SelectValueConfig.vyrobce
      : [];
    setVyrobceOptions(
      staticVyrobce.map((o) => ({ ...o, value: String(o.value) }))
    );
  }, [isOpen, config, rowData, category]);

  // Subkategorie reacts to Kategorie
  useEffect(() => {
    if (!formData.kategorie) {
      setFilteredSubkategorie([]);
      return;
    }
    const selected = findByValueOrLabel(
      SelectValueConfig.kategorie_vozidel,
      formData.kategorie
    );
    if (!selected) {
      setFilteredSubkategorie([]);
      return;
    }
    const filtered = (SelectValueConfig.subkategorie_vozidel || []).filter(
      (sub) => sub.category === selected.label
    );
    setFilteredSubkategorie(filtered);

    if (
      formData.subkategorie &&
      !filtered.some((sub) => toStr(sub.value) === toStr(formData.subkategorie))
    ) {
      setFormData((prev) => ({ ...prev, subkategorie: "" }));
    }
  }, [formData.kategorie]);

  // Get vyrobce options
  useEffect(() => {
    const dynamicConfig = SelectValueConfig.vyrobce?.[0];
    if (!formData.kategorie) return;

    if (!dynamicConfig) {
      const staticVyrobce = Array.isArray(SelectValueConfig.vyrobce)
        ? SelectValueConfig.vyrobce
        : [];
      const nextOpts = staticVyrobce.map((o) => ({
        ...o,
        value: String(o.value),
      }));
      setVyrobceOptions(nextOpts);
      setFormData((prev) => {
        if (!prev.vyrobce) return prev;
        const found = findByValueOrLabel(nextOpts, prev.vyrobce);
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

        const staticVyrobce = Array.isArray(SelectValueConfig.vyrobce)
          ? SelectValueConfig.vyrobce
          : [];
        const staticNorm = staticVyrobce.map((o) => ({
          ...o,
          value: String(o.value),
        }));

        const nextOpts = mapped.length > 0 ? mapped : staticNorm;
        setVyrobceOptions(nextOpts);
      })
      .catch(() => {
        const staticVyrobce = Array.isArray(SelectValueConfig.vyrobce)
          ? SelectValueConfig.vyrobce
          : [];
        const nextOpts = staticVyrobce.map((o) => ({
          ...o,
          value: String(o.value),
        }));
        setVyrobceOptions(nextOpts);
      });
  }, [formData.kategorie]);

  // Check for vyrobce name and match by value or label
  useEffect(() => {
    if (!vyrobceOptions.length) return;
    setFormData((prev) => {
      // Try to match by both value and label
      const match =
        findByValueOrLabel(vyrobceOptions, prev.vyrobce) ||
        findByValueOrLabel(vyrobceOptions, prev.vyrobce_label);

      if (!match) return prev;

      const updates = {};
      if (toStr(prev.vyrobce) !== toStr(match.value))
        updates.vyrobce = String(match.value);
      if (prev.vyrobce_label !== match.label)
        updates.vyrobce_label = match.label;

      return Object.keys(updates).length ? { ...prev, ...updates } : prev;
    });
  }, [vyrobceOptions]);

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

  // Validate a single form field
  const validateField = (key) => {
    const col = config?.fields.find((f) => f.key === key);
    if (!col || !col.required || isDisabled(col)) return null;
    const hasError = isEmptyValue(formData[key], col.dataType, col.type);
    return hasError ? t("Toto pole je povinné.") : null;
  };

  // Validate all required fields
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

  // Handle form field changes
  const handleChange = (key, value) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "vyrobce") {
        const opt = findByValueOrLabel(vyrobceOptions, value);
        next.vyrobce_label = opt?.label || "";
      }
      return next;
    });
    if (touched[key]) {
      const msg = validateField(key);
      setErrors((prev) => ({ ...prev, [key]: msg || undefined }));
    }
  };

  // Open confirmation dialog and check for required fields
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

  // Confirm edit action
  const handleConfirmEdit = async () => {
    try {
      const { primaryKey, editEndpoint } = config || {};
      const id = rowData?.[primaryKey];
      if (!id || !editEndpoint) throw new Error("Chybí identifikátor záznamu.");

      // First upload images if they exist and are File objects
      if (isFileObject(formData.obrazek)) {
        await uploadImage(formData.obrazek, category, 'image', id, access_token);
      }

      if (isFileObject(formData.vektor)) {
        await uploadImage(formData.vektor, category, 'vector', id, access_token);
      }

      // Then save the record (pass the component ID for filename generation)
      const response = await fetch(editEndpoint(id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(access_token && { Authorization: `Bearer ${access_token}` }),
        },
        body: JSON.stringify(transformFormData(category, formData, id)),
      });

      if (!response.ok) {
        // Handle specific 401 error
        if (response.status === 401) {
          throw new Error("Nemáte oprávnění k provedení této operace. Zkuste se znovu přihlásit.");
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Chyba při ukládání dat (${response.status}).`);
      }

      // Close the dialog
      setShowConfirm(false);
      onClose();
      onSuccess();
      
      // Show success message
      setAlert({
        title: "Úspěch",
        message: "Záznam byl úspěšně upraven.",
        type: "success",
        duration: 3,
        onClose: () => setAlert(null),
      });
    } catch (error) {
      console.error("Error during edit:", error);
      
      // Extract error message string
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Call the onError callback with the error message string
      onError(errorMessage);
      
      // Show error in AlertDialog
      setAlert({
        title: "Chyba",
        message: errorMessage,
        type: "error",
        duration: 5,
        onClose: () => setAlert(null),
      });
    } finally {
      setShowConfirm(false);
    }
  };

  // Check for form field errors
  if (!isOpen || !config || !rowData) return null;
  const { fields } = config;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 sm:p-8">
        <div className="bg-white w-full max-w-7xl p-6 sm:p-8 rounded-2xl shadow-xl relative border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">
            {dialogTitle}
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

          {/* Footer */}
          <div className="mt-8 flex justify-end gap-3">
            <button
              className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={onClose}
            >
              {t("Zavřít")}
            </button>

            <button
              className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              onClick={handleOpenConfirm}
            >
              {t("Uložit")}
            </button>
          </div>
        </div>
      </div>

      {/* Confirm */}
      {showConfirm && (
        <ConfirmDialog
          title={t("Potvrdit úpravy")}
          message={t("Opravdu chcete uložit změny?")}
          onConfirm={() => {
            handleConfirmEdit();
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* Alert */}
      {alert && <AlertDialog {...alert} />}
    </>
  );
}
