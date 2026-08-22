import { StatusBar } from "./_components";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <StatusBar />
      {children}
    </div>
  );
}
