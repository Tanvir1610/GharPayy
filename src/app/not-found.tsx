import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8f7ff] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl mb-6">🏠</div>
      <h1 className="font-display text-4xl font-bold text-gray-900 mb-3">Page not found</h1>
      <p className="text-gray-500 text-lg mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist, or the PG has been removed.
      </p>
      <div className="flex gap-4">
        <Link href="/" className="btn-primary">Go Home</Link>
        <Link href="/browse" className="btn-secondary">Browse PGs</Link>
      </div>
    </div>
  );
}
