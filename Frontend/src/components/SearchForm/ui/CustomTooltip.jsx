// Used for tooltip menu
export const Tooltip = ({ label, children }) => (
    <div className="group relative flex flex-col items-center">
      {children}
      <div className="absolute bottom-full mb-2 hidden group-hover:flex z-20">
        <span className="relative bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-gray-800">
          {label}
        </span>
      </div>
    </div>
  );