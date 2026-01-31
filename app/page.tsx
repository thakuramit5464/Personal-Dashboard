import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-900">Personal Dashboard</h1>
      <div className="mt-8 flex gap-4">
        <Link
          href="/login"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
