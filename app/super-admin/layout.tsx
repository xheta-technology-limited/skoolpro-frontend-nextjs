import { AdminSideBar, StatusBar } from "./_components";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSideBar />

      <main className="w-full min-h-0 min-w-0 flex flex-col">
        <StatusBar />
        <div className="w-full flex-1 min-h-0 overflow-y-scroll pl-2 md:pl-12 py-8 md:pr-20 pr-2 bg-primary-bg">
          <div className="w-full">{children}</div>
        </div>
      </main>
    </div>
  );
}
