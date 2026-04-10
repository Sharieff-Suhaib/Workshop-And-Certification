import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <nav className="p-4 bg-blue-600 text-white">
        <Link href="/dashboard">Dashboard</Link>
      </nav>

      <main className="p-6">
        <h1 className="text-3xl font-bold">Home Page</h1>
      </main>
    </div>
  );
}