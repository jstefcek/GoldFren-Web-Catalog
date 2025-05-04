import React, { useState, useRef, useEffect } from "react";
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
  resetSignal,
  ...otherProps
}) => {
  const [localMin, setLocalMin] = useState(valueMin || min);
  const [localMax, setLocalMax] = useState(valueMax || max);
  const [activeThumb, setActiveThumb] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const rangeContainerRef = useRef(null);

  // Reset the values if user want to
  useEffect(() => {
    setLocalMin(valueMin ?? min);
    setLocalMax(valueMax ?? max);
  }, [resetSignal]);

  // Determine if the component should be active based on dependencies
  const isDisabled = disabled;
  
  // Calculate percentages for positioning
  const minPos = ((localMin - min) / (max - min)) * 100;
  const maxPos = ((localMax - min) / (max - min)) * 100;

  // Format display values
  const formatValue = (value) => {
    return Number.isInteger(Number(value)) ? value : Number(value).toFixed(1);
  };

  // Handle input changes
  const handleMinInputChange = (e) => {
    const newValue = Math.min(Math.max(Number(e.target.value), min), localMax);
    setLocalMin(newValue);
    onChangeMin(newValue);
  };
  
  // Ensure max is always greater than min
  const handleMaxInputChange = (e) => {
    const newValue = Math.max(Math.min(Number(e.target.value), max), localMin);
    setLocalMax(newValue);
    onChangeMax(newValue);
  };

  // Handle mouse/touch events for slider
  const handleStart = (thumb) => (e) => {
    if (isDisabled) return;
    
    e.preventDefault();
    setActiveThumb(thumb);
    setIsDragging(true);
    
    const handleMove = thumb === 'min' ? handleMove_min : handleMove_max;
    
    // Use window to capture events even when cursor moves outside the component
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: false });
    
    const handleEnd = () => {
      setActiveThumb(null);
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
      
      // Commit final values
      if (thumb === 'min') {
        onChangeMin(localMin);
      } else {
        onChangeMax(localMax);
      }
    };
    
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);
  };

  const calculateValueFromPosition = (clientX) => {
    if (!rangeContainerRef.current) return min;
    
    const rect = rangeContainerRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawValue = min + ratio * (max - min);
    
    // Snap to step
    const snappedValue = Math.round(rawValue / step) * step;
    return Math.min(Math.max(snappedValue, min), max);
  };

  const handleMove_min = (e) => {
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const newValue = calculateValueFromPosition(clientX);
    const boundedValue = Math.min(newValue, localMax - step);
    setLocalMin(boundedValue);
    onChangeMin(boundedValue);
    
    // Prevent default to stop page scrolling on touch devices
    if (e.type.includes('touch')) {
      e.preventDefault();
    }
  };

  const handleMove_max = (e) => {
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const newValue = calculateValueFromPosition(clientX);
    const boundedValue = Math.max(newValue, localMin + step);
    setLocalMax(boundedValue);
    // Immediately call onChangeMax instead of only on mouse up
    onChangeMax(boundedValue);
    
    // Prevent default to stop page scrolling on touch devices
    if (e.type.includes('touch')) {
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full" {...otherProps}>
      <div className="flex justify-between items-center">
        <label className="font-sm text-medium text-gray-800">
          {label && i18next.t ? i18next.t(label) : label}
        </label>
        <div className="flex gap-3 items-center">
          <input
            type="number"
            className={`w-16 border border-gray-800 rounded-lg px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-red-600 ${
              isDisabled ? "bg-gray-100 cursor-not-allowed opacity-50" : ""
            }`}
            value={formatValue(localMin)}
            onChange={handleMinInputChange}
            min={min}
            max={localMax - step}
            step={step}
            disabled={isDisabled}
            aria-label={`Minimum ${label} value`}
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            className={`w-16 border rounded-lg px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-red-600 ${
              isDisabled ? "bg-gray-100 cursor-not-allowed opacity-50" : ""
            }`}
            value={formatValue(localMax)}
            onChange={handleMaxInputChange}
            min={localMin + step}
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
        {/* Track background */}
        <div
          className="absolute h-2 rounded-full w-full top-1/2 -translate-y-1/2 bg-gray-200"
        ></div>

        {/* Active track area */}
        <div
          className={`absolute h-2 rounded-full top-1/2 -translate-y-1/2 ${
            isDisabled ? "bg-gray-300" : "bg-red-500"
          }`}
          style={{
            left: `${minPos}%`,
            width: `${maxPos - minPos}%`,
          }}
        ></div>

        {/* Min thumb */}
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
          aria-valuemax={localMax}
          aria-valuenow={localMin}
          aria-label={`Minimum ${label} value`}
          aria-disabled={isDisabled}
          onKeyDown={(e) => {
            if (isDisabled) return;
            if (e.key === 'ArrowRight') {
              const newValue = Math.min(localMin + step, localMax - step);
              setLocalMin(newValue);
              onChangeMin(newValue);
            } else if (e.key === 'ArrowLeft') {
              const newValue = Math.max(localMin - step, min);
              setLocalMin(newValue);
              onChangeMin(newValue);
            }
          }}
        ></div>

        {/* Max thumb */}
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
          aria-valuemin={localMin}
          aria-valuemax={max}
          aria-valuenow={localMax}
          aria-label={`Maximum ${label} value`}
          aria-disabled={isDisabled}
          onKeyDown={(e) => {
            if (isDisabled) return;
            if (e.key === 'ArrowRight') {
              const newValue = Math.min(localMax + step, max);
              setLocalMax(newValue);
              onChangeMax(newValue);
            } else if (e.key === 'ArrowLeft') {
              const newValue = Math.max(localMax - step, localMin + step);
              setLocalMax(newValue);
              onChangeMax(newValue);
            }
          }}
        ></div>
      </div>

      {/* Min-max labels */}
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
};