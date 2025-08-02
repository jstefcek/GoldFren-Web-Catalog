import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import ConfirmDialog from "../ui/Custom_ConfirmDialog";
import { dialogColumnsConfig } from "../../config/ColumnConfigs/EditDialog_Config";
import { SelectValueConfig } from "../../config/ColumnConfigs/EditDialog_Config";
import { formatDateLong } from "../../utils/utils";
import BooleanToggleButton from "../ui/Custom_ButtonToggle";
import DetailImage from "../ui/Custom_DetailImage";
import { transformFormData } from "../../config/DataTransormation/EditDialog_Transformation";

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
  const [formData, setFormData] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const config = dialogColumnsConfig[category];
  const [loaded, setLoaded] = useState(false);
  const [filteredSubkategorie, setFilteredSubkategorie] = useState([]);

  // Initialize form data when dialog opens
  useEffect(() => {
    let timeout;
    if (isOpen && rowData) {
      const fixedData = { ...rowData };

      const categoryConfig = dialogColumnsConfig[category]?.fields || [];
      categoryConfig.forEach((col) => {
        if (col.type === "select" && Array.isArray(col.value)) {
          const match = col.value.find((opt) => {
            return (
              opt.value === rowData[col.key] ||
              opt.value?.toString() === rowData[col.key]?.toString() ||
              opt.label === rowData[col.key]
            );
          });
          if (match) fixedData[col.key] = match.value;
        }
      });

      // Set formData early
      setFormData(fixedData);

      // Ensure subkategorie gets mapped AFTER filtered options are available
      timeout = setTimeout(() => {
        const kategorieLabel = SelectValueConfig.kategorie_vozidel.find(
          (kat) => kat.value === fixedData.kategorie
        )?.label;

        const filtered = SelectValueConfig.subkategorie_vozidel.filter(
          (sub) => sub.category === kategorieLabel
        );
        setFilteredSubkategorie(filtered);

        const matchSub = filtered.find(
          (sub) =>
            sub.value === rowData.subkategorie ||
            sub.value?.toString() === rowData.subkategorie?.toString() ||
            sub.label === rowData.subkategorie
        );

        if (matchSub) {
          setFormData((prev) => ({
            ...prev,
            subkategorie: matchSub.value,
          }));
        }

        setLoaded(true);
      }, 50);
    } else {
      setLoaded(false);
    }
    return () => clearTimeout(timeout);
  }, [isOpen, rowData]);

  // Select subkategorii based on selected kategorie
  useEffect(() => {
    const kategorieLabel = SelectValueConfig.kategorie_vozidel.find(
      (kat) => kat.value === formData.kategorie
    )?.label;

    const filtered = SelectValueConfig.subkategorie_vozidel.filter(
      (sub) => sub.category === kategorieLabel
    );

    setFilteredSubkategorie(filtered);
  }, [formData.kategorie]);

  // Clear subkategorie when kategorie changes
  useEffect(() => {
    if (
      formData.subkategorie &&
      !filteredSubkategorie.some((sub) => sub.value === formData.subkategorie)
    ) {
      setFormData((prev) => ({ ...prev, subkategorie: "" }));
    }
  }, [filteredSubkategorie]);

  // If dialog is not open or no rowData, return null
  if (!isOpen || !rowData || !config || !loaded) return null;

  // Ensure formData has all necessary fields
  const { fields, primaryKey, editEndpoint } = config;

  // Ensure primary key exists in rowData
  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle confirm edit action
  const handleConfirmEdit = async () => {
    try {
      const id = rowData[primaryKey];
      const response = await fetch(editEndpoint(id), {
        method: "PUT",
        headers: !access_token
          ? { "Content-Type": "application/json" }
          : {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
        body: JSON.stringify(transformFormData(category, formData)),
      });

      // Check if the response is successful
      if (!response.ok) throw new Error("Editing the data failed... Error: " + response.statusText);

      // Log the response and form data for debug
      console.log("Response: ", response);
      console.log("Body: ", formData);
      console.log("Transformed Data: ", transformFormData(category, formData));

      // Call onSuccess callback if provided and close the dialog
      onSuccess();
    } catch (error) {
      // Show alert dialog with error message
      onError(error.message);
    }
  };

  // Render each field based on its type
  const renderField = (col, value) => {
    // Handle boolean toggle button
    if (col.type === "button") {
      return (
        <BooleanToggleButton
          value={!!value}
          editable={col.editable}
          onChange={(newVal) => handleChange(col.key, newVal)}
          labels={col.buttonValue || { true: "Ano", false: "Ne" }}
        />
      );
    }

    // Handle other editable fields
    if (col.editable) {
      // Handle select input for subkategorie with filtered options
      if (col.key === "subkategorie" && col.type === "select") {
        const options = filteredSubkategorie;

        return (
          <select
            value={value ?? ""}
            onChange={(e) => {
              const selected = options.find(
                (opt) => opt.value.toString() === e.target.value
              );
              handleChange(col.key, selected ? selected.value : e.target.value);
            }}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
          >
            <option value="" disabled>
              {col.placeholder || t("Vyberte možnost")}
            </option>
            {options.map((option) => (
              <option key={option.id} value={option.value}>
                {t(option.label)}
              </option>
            ))}
          </select>
        );
      }

      // Select input type
      if (col.type === "select" && Array.isArray(col.value)) {
        return (
          <select
            value={value ?? ""}
            onChange={(e) => {
              const selected = col.value.find(
                (opt) => opt.value.toString() === e.target.value
              );
              handleChange(col.key, selected ? selected.value : e.target.value);
            }}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
          >
            <option value="" disabled>
              {col.placeholder || t("Vyberte možnost")}
            </option>
            {col.value.map((option) => (
              <option key={option.id} value={option.value}>
                {t(option.label)}
              </option>
            ))}
          </select>
        );
      }

      // Handle boolean as checkbox
      if (col.dataType === "boolean") {
        return (
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => handleChange(col.key, e.target.checked)}
            className="w-5 h-5 accent-red-600"
          />
        );
      }

      // Handle text input or textarea
      if (col.type === "textarea") {
        return (
          <textarea
            value={value || ""}
            onChange={(e) => handleChange(col.key, e.target.value)}
            placeholder={col.placeholder || ""}
            rows={5}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md text-sm resize-y focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        );
      }

      // Default input type
      return (
        <input
          type={col.type || "text"}
          value={value || ""}
          placeholder={col.placeholder || ""}
          onChange={(e) => handleChange(col.key, e.target.value)}
          className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
        />
      );
    }

    // Non-editable fields
    if (col.dataType === "date") {
      return (
        <span className="text-gray-800 text-sm">
          {value ? formatDateLong(value) : "—"}
        </span>
      );
    }

    // Handle image fields
    if (col.dataType === "image") {
      return (
        <DetailImage
          imageUrl={value}
          altText={`Image for ${t(col.label)}`}
          noImageText={t("datagrid.no_image") || "No image available"}
          className="max-w-full max-h-36 object-contain block"
          imageAllign="center"
        />
      );
    }

    // Default text display
    return (
      <span className="text-gray-800 text-sm">{value?.toString() || "—"}</span>
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 sm:p-8">
        <div className="bg-white w-full max-w-4xl p-6 sm:p-8 rounded-2xl shadow-xl relative border border-gray-200">
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
            {/* First field with full width */}
            <div className="grid grid-cols-1 gap-4 ml-4 mr-4">
              {fields
                .filter((col) => col.show !== false)
                .slice(0, 1)
                .map((col) => {
                  const value = formData[col.key];
                  return (
                    <div key={col.key} className="flex flex-col mb-4">
                      <label className="text-lg font-bold text-gray-900 mb-1">
                        {t(col.label)}
                      </label>
                      {renderField(col, value)}
                    </div>
                  );
                })}
            </div>

            {/* Remaining fields with 2 columns next to each other */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4 ml-4 mr-4">
              {fields
                .filter((col) => col.show !== false)
                .slice(1)
                .map((col) => {
                  const value = formData[col.key];
                  return (
                    <div key={col.key} className="flex flex-col">
                      <label className="text-sm font-bold text-gray-900 mb-1">
                        {t(col.label)}
                      </label>
                      {renderField(col, value)}
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              onClick={onClose}
            >
              {t("Zavřít")}
            </button>
            <button
              className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
              onClick={() => setShowConfirm(true)}
            >
              {t("Uložit")}
            </button>
          </div>
        </div>
      </div>

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
    </>
  );
}
