'use client';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
      <h1 className="text-4xl font-bold text-red-600 mb-4">🚫 Access Denied</h1>
      <p className="text-lg text-gray-700 mb-6">
        You don’t have permission to view this page.
      </p>
      <Link
        href='/dashboard'
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor"
      >
        Go back to Dashboard
      </Link>
    </div>
  );
}
