import { AlertTriangle } from "lucide-react";

const ErrorState = ({
  message = "Something went wrong.",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-64">

      <AlertTriangle
        size={60}
        className="text-red-500"
      />

      <h2 className="mt-4 text-xl">
        {message}
      </h2>

      <button
        onClick={onRetry}
        className="btn-primary mt-5"
      >
        Retry
      </button>

    </div>
  );
};

export default ErrorState;