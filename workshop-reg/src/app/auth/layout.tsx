export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center px-4 py-20">
      <div className="absolute top-8 left-8">
        <h1 className="text-3xl font-bold text-white">Workshop</h1>
      </div>
      {children}
    </div>
  );
}