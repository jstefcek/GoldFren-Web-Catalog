import React, { useRef, useState } from "react";
import i18next from 'i18next';

export const CustomRangeSlider = ({
  label,
  min,
  max,
  step = 1,
  valueMin,
  valueMax,
  disabled = false,
  onChangeMin,
  onChangeMax,
  ...otherProps
}) => {
  const [activeThumb, setActiveThumb] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const rangeContainerRef = useRef(null);

  const isDisabled = disabled;

  const minPos = ((valueMin - min) / (max - min)) * 100;
  const maxPos = ((valueMax - min) / (max - min)) * 100;

  const formatValue = (value) => {
    return Number.isInteger(Number(value)) ? value : Number(value).toFixed(1);
  };

  const handleMinInputChange = (e) => {
    const newValue = Math.min(Math.max(Number(e.target.value), min), valueMax - step);
    onChangeMin(newValue);
  };

  const handleMaxInputChange = (e) => {
    const newValue = Math.max(Math.min(Number(e.target.value), max), valueMin + step);
    onChangeMax(newValue);
  };

  const calculateValueFromPosition = (clientX) => {
    if (!rangeContainerRef.current) return min;
    const rect = rangeContainerRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawValue = min + ratio * (max - min);
    return Math.round(rawValue / step) * step;
  };

  const handleStart = (thumb) => (e) => {
    if (isDisabled) return;
    e.preventDefault();
    setActiveThumb(thumb);
    setIsDragging(true);
    const handleMove = thumb === 'min' ? handleMove_min : handleMove_max;

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: false });

    const handleEnd = () => {
      setActiveThumb(null);
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };

    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);
  };

  const handleMove_min = (e) => {
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const newValue = calculateValueFromPosition(clientX);
    const boundedValue = Math.min(newValue, valueMax - step);
    onChangeMin(boundedValue);
    if (e.type.includes('touch')) e.preventDefault();
  };

  const handleMove_max = (e) => {
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const newValue = calculateValueFromPosition(clientX);
    const boundedValue = Math.max(newValue, valueMin + step);
    onChangeMax(boundedValue);
    if (e.type.includes('touch')) e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-1 w-full text-sm md:text-base" {...otherProps}>
      <div className="flex justify-between items-center">
        <label className="font-sm text-medium text-gray-800">
          {label && i18next.t ? i18next.t(label) : label}
        </label>
        <div className="flex gap-2 items-center sm:gap-3">
          <input
            type="number"
            className={`w-14 sm:w-16 border border-gray-800 rounded-md px-1.5 py-1 text-center text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-600 ${isDisabled ? "bg-gray-100 cursor-not-allowed opacity-50" : ""}`}
            value={formatValue(valueMin)}
            onChange={handleMinInputChange}
            min={min}
            max={valueMax - step}
            step={step}
            disabled={isDisabled}
            aria-label={`Minimum ${label} value`}
          />
          <span className="text-gray-400 text-sm sm:text-base">-</span>
          <input
            type="number"
            className={`w-14 sm:w-16 border border-gray-800 rounded-md px-1.5 py-1 text-center text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-600 ${isDisabled ? "bg-gray-100 cursor-not-allowed opacity-50" : ""}`}
            value={formatValue(valueMax)}
            onChange={handleMaxInputChange}
            min={valueMin + step}
            max={max}
            step={step}
            disabled={isDisabled}
            aria-label={`Maximum ${label} value`}
          />
        </div>
      </div>

      <div
        className={`relative h-10 mt-1 ${isDisabled ? "opacity-50" : ""} ml-1 mr-1`}
        ref={rangeContainerRef}
        aria-disabled={isDisabled}
        role="group"
        aria-label={`${label} range slider`}
      >
        <div className="absolute h-2 rounded-full w-full top-1/2 -translate-y-1/2 bg-gray-200"></div>
        <div
          className={`absolute h-2 rounded-full top-1/2 -translate-y-1/2 ${isDisabled ? "bg-gray-300" : "bg-red-500"}`}
          style={{
            left: `${minPos}%`,
            width: `${maxPos - minPos}%`,
          }}
        ></div>

        {/* Min Thumb */}
        <div
          className={`absolute w-6 h-6 rounded-full shadow-md -translate-x-1/2 top-1/2 -translate-y-1/2 border-2 ${
            activeThumb === 'min' ? 'cursor-grabbing z-30' : 'cursor-grab z-20'
          } ${
            isDisabled 
              ? "border-gray-300 bg-gray-100 cursor-not-allowed" 
              : isDragging && activeThumb === 'min'
                ? "border-white bg-red-700" 
                : "border-white bg-red-600 hover:bg-red-700"
          }`}
          style={{ left: `${minPos}%` }}
          onMouseDown={handleStart('min')}
          onTouchStart={handleStart('min')}
          tabIndex={isDisabled ? -1 : 0}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={valueMax}
          aria-valuenow={valueMin}
          aria-disabled={isDisabled}
          onKeyDown={(e) => {
            if (isDisabled) return;
            if (e.key === 'ArrowRight') {
              const newValue = Math.min(valueMin + step, valueMax - step);
              onChangeMin(newValue);
            } else if (e.key === 'ArrowLeft') {
              const newValue = Math.max(valueMin - step, min);
              onChangeMin(newValue);
            }
          }}
        ></div>

        {/* Max Thumb */}
        <div
          className={`absolute w-6 h-6 rounded-full shadow-md -translate-x-1/2 top-1/2 -translate-y-1/2 border-2 ${
            activeThumb === 'max' ? 'cursor-grabbing z-30' : 'cursor-grab z-20'
          } ${
            isDisabled 
              ? "border-gray-300 bg-gray-100 cursor-not-allowed" 
              : isDragging && activeThumb === 'max'
                ? "border-white bg-red-700" 
                : "border-white bg-red-600 hover:bg-red-700"
          }`}
          style={{ left: `${maxPos}%` }}
          onMouseDown={handleStart('max')}
          onTouchStart={handleStart('max')}
          tabIndex={isDisabled ? -1 : 0}
          role="slider"
          aria-valuemin={valueMin}
          aria-valuemax={max}
          aria-valuenow={valueMax}
          aria-disabled={isDisabled}
          onKeyDown={(e) => {
            if (isDisabled) return;
            if (e.key === 'ArrowRight') {
              const newValue = Math.min(valueMax + step, max);
              onChangeMax(newValue);
            } else if (e.key === 'ArrowLeft') {
              const newValue = Math.max(valueMax - step, valueMin + step);
              onChangeMax(newValue);
            }
          }}
        ></div>
      </div>

      <div className="flex justify-between mt-1 text-xs md:text-sm text-gray-500">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
};
