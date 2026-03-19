export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f8f7ff] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center animate-pulse">
          <span className="text-white text-xl">🏠</span>
        </div>
        <div className="text-gray-400 text-sm font-medium">Loading Gharpayy...</div>
      </div>
    </div>
  );
}
