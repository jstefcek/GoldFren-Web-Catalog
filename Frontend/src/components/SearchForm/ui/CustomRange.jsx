import React from "react";

export const CustomRangeSlider = ({
  label,
  min = 0,
  max = 100,
  step = 1,
  valueMin,
  valueMax,
  disabled = false,
  onChangeMin,
  onChangeMax,
}) => {
  const getPercent = (val) => ((val - min) / (max - min)) * 100;

  return (
    <div className={`flex flex-col gap-2 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
      <label className="text-sm font-medium text-gray-800">{label}</label>

      <div className="relative w-full h-8">
        {/* Track */}
        <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 h-[6px] bg-gray-300 rounded-full" />

        {/* Highlight range */}
        <div
          className="absolute top-1/2 transform -translate-y-1/2 h-[6px] bg-gray-700 rounded-full"
          style={{
            left: `${getPercent(valueMin)}%`,
            width: `${getPercent(valueMax) - getPercent(valueMin)}%`,
          }}
        />

        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          disabled={disabled}
          onChange={onChangeMin}
          className="absolute w-full h-8 appearance-none bg-transparent z-30 pointer-events-none range-thumb"
        />

        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          disabled={disabled}
          onChange={onChangeMax}
          className="absolute w-full h-8 appearance-none bg-transparent z-20 pointer-events-none range-thumb"
        />
      </div>

      <div className="flex justify-between gap-4">
        <input
          type="number"
          value={valueMin}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={(e) => onChangeMin({ target: { value: Number(e.target.value) } })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
        <input
          type="number"
          value={valueMax}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={(e) => onChangeMax({ target: { value: Number(e.target.value) } })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
      </div>

      <style jsx>{`
        .range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 9999px;
          background-color: #111827; /* black */
          border: 2px solid white;
          cursor: pointer;
          margin-top: -7px; /* perfectly centers over a 6px track */
          pointer-events: auto;
        }

        .range-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 9999px;
          background-color: #111827;
          border: 2px solid white;
          cursor: pointer;
          pointer-events: auto;
        }

        input[type='range']:disabled::-webkit-slider-thumb,
        input[type='range']:disabled::-moz-range-thumb {
          background-color: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};
