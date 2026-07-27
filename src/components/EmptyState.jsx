import { Database } from "lucide-react";

const EmptyState = ({
  message = "Data is not available."
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-dark-400">
      <Database size={60} />
      <h2 className="text-xl font-semibold mt-4">
        {message}
      </h2>
    </div>
  );
};

export default EmptyState;