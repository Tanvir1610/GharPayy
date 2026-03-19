export default function BrowseLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      {/* Search skeleton */}
      <div className="flex gap-3 mb-6">
        <div className="skeleton h-12 flex-1 rounded-xl" />
        <div className="skeleton h-12 w-32 rounded-xl" />
        <div className="skeleton h-12 w-24 rounded-xl" />
      </div>
      {/* Filter chips skeleton */}
      <div className="flex gap-2 mb-6">
        {[80, 60, 70, 90, 65].map((w, i) => (
          <div key={i} className="skeleton h-8 rounded-full" style={{ width: w }} />
        ))}
      </div>
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="hidden lg:block w-64">
          <div className="skeleton h-96 rounded-2xl" />
        </div>
        {/* Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-gray-100">
              <div className="skeleton h-44" />
              <div className="p-4 space-y-3">
                <div className="skeleton h-5 w-3/4 rounded-lg" />
                <div className="skeleton h-4 w-1/2 rounded-lg" />
                <div className="flex gap-2">
                  <div className="skeleton h-6 w-16 rounded-full" />
                  <div className="skeleton h-6 w-16 rounded-full" />
                </div>
                <div className="flex justify-between pt-2">
                  <div className="skeleton h-6 w-24 rounded-lg" />
                  <div className="skeleton h-5 w-12 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
