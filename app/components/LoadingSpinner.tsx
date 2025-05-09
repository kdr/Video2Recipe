export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      <span className="text-blue-500 font-medium">Cooking...</span>
    </div>
  );
} 