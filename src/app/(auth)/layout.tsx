"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex max-h-screen items-center justify-center ">
      <main className="w-full max-w-md p-6">{children}</main>
    </div>
  );
}
