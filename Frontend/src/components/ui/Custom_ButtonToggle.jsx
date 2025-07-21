import { ShieldCheck, ShieldX } from "lucide-react";

export default function BooleanToggleButton({
  value = false,
  onChange = () => {},
  editable = false,
  labels = { true: "Ano", false: "Ne" },
}) {
  const isTrue = !!value;
  const label = isTrue ? labels.true : labels.false;
  const Icon = isTrue ? ShieldCheck : ShieldX;

  // Base styles for the button
  const base = "flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition";
  
  // Conditional styles based on the value and interactivity
  const color = isTrue
    ? "bg-green-300 text-green-800 border border-green-400 hover:bg-green-300"
    : "bg-red-300 text-red-800 border border-red-400 hover:bg-red-300";

  // Interactivity styles based on whether the button is editable or not
  const interactivity = editable
    ? "hover:shadow-md hover:brightness-95 cursor-pointer"
    : "opacity-70 cursor-not-allowed";

  return (
    <button
      type="button"
      onClick={() => editable && onChange(!value)}
      disabled={!editable}
      role="button"
      aria-pressed={isTrue}
      className={`${base} ${color} ${interactivity}`}
      style={{ width: "fit-content" }}
    >
      <Icon className="w-6 h-6" />
      <span>{label}</span>
    </button>
  );
}
