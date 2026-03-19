"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f8f7ff] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-6">😕</div>
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">Something went wrong</h1>
      <p className="text-gray-500 mb-8 max-w-md">An unexpected error occurred. Please try again.</p>
      <div className="flex gap-4">
        <button onClick={reset} className="btn-primary">Try Again</button>
        <Link href="/" className="btn-secondary">Go Home</Link>
      </div>
    </div>
  );
}
