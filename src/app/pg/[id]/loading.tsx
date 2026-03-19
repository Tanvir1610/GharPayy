export default function PGLoading() {
  return (
    <div className="bg-gray-50 min-h-screen pb-24 lg:pb-8 pt-16">
      {/* Hero */}
      <div className="skeleton h-64 sm:h-80 lg:h-96 w-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left */}
          <div className="flex-1 space-y-5">
            {[120, 200, 280, 180].map((h, i) => (
              <div key={i} className="skeleton rounded-2xl" style={{ height: h }} />
            ))}
          </div>
          {/* Right */}
          <div className="lg:w-80">
            <div className="skeleton h-64 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
