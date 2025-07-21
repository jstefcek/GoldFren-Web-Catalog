import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import ConfirmDialog from "../ui/Custom_ConfirmDialog";
import { dialogColumnsConfig } from "../../config/EditDialog_Columns_Config";
import { formatDateLong } from "../../utils/utils";
import BooleanToggleButton from "../ui/Custom_ButtonToggle";

export default function CustomEditDialog({
  isOpen,
  onClose,
  dialogTitle,
  rowData,
  category,
}) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const config = dialogColumnsConfig[category];
  const [loaded, setLoaded] = useState(false);

  // Init form data when dialog opens
  useEffect(() => {
    let timeout;
    if (isOpen && rowData) {
      setFormData(rowData);
      timeout = setTimeout(() => setLoaded(true), 50);
    } else {
      setLoaded(false);
    }
    return () => clearTimeout(timeout);
  }, [isOpen, rowData]);

  // If dialog is not open or no rowData or config, return null
  if (!isOpen || !rowData || !config || !loaded) return null;

  const { fields, primaryKey, editEndpoint } = config;

  // Handle changes in form data
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Edit failed");

      onClose();
    } catch (err) {
      alert(t("Error saving changes: ") + err.message);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 sm:p-8">
        <div className="bg-white w-full max-w-2xl p-6 sm:p-8 rounded-2xl shadow-xl relative border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">
            {dialogTitle}
          </h2>
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-red-600 transition cursor-pointer"
            onClick={onClose}
          >
            <X size={36} />
          </button>

          <div className="flex flex-col gap-4">
            {fields
              .filter((col) => col.show !== false)
              .map((col) => {
                const value = formData[col.key];
                return (
                  <div key={col.key} className="flex flex-col">
                    <label className="text-sm font-bold text-gray-900 mb-1">
                      {t(col.label)}:
                    </label>

                    {/* Button-type toggle */}
                    {col.type === "button" ? (
                      <BooleanToggleButton
                        value={!!value}
                        editable={col.editable}
                        onChange={(newVal) => handleChange(col.key, newVal)}
                        labels={col.buttonValue || { true: "Ano", false: "Ne" }}
                      />
                    ) : col.editable ? (
                      col.dataType === "boolean" ? (
                        <input
                          type="checkbox"
                          checked={!!value}
                          onChange={(e) =>
                            handleChange(col.key, e.target.checked)
                          }
                          className="w-5 h-5 accent-red-600"
                        />
                      ) : (
                        <input
                          type={col.type || "text"}
                          value={value || ""}
                          onChange={(e) =>
                            handleChange(col.key, e.target.value)
                          }
                          className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                        />
                      )
                    ) : col.dataType === "date" ? (
                      <span className="text-gray-800 text-sm">
                        {value ? formatDateLong(value) : "—"}
                      </span>
                    ) : (
                      <span className="text-gray-800 text-sm">
                        {value?.toString() || "—"}
                      </span>
                    )}
                  </div>
                );
              })}
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              onClick={onClose}
            >
              {t("Close")}
            </button>
            <button
              className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
              onClick={() => setShowConfirm(true)}
            >
              {t("Save")}
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmDialog
          title={t("Confirm Save")}
          message={t("Are you sure you want to save changes?")}
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
