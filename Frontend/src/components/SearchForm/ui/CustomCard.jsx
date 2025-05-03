// Use for card component
export const Card = ({ className = "", children }) => (
    <div className={`bg-white border rounded-2xl shadow-xl ${className}`}>
      {children}
    </div>
  );