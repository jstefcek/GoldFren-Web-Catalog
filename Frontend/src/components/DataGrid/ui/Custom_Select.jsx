export function Select({ children, onValueChange, defaultValue }) {
    return (
      <select
        onChange={(e) => onValueChange(e.target.value)}
        defaultValue={defaultValue}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {children}
      </select>
    );
  }
  
  export function SelectItem({ children, value }) {
    return <option value={value}>{children}</option>;
  }