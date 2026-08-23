import { AdminSideBar, StatusBar } from "./_components";
import SuperAdminProviders from "./providers";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SuperAdminProviders>
        <AdminSideBar />

        <main className="w-full flex flex-col">
          <StatusBar />
          <div className="w-full flex-1 pl-12 py-8 bg-primary-bg">
            <div className="xl:m-auto max-w-254">{children}</div>
          </div>
        </main>
      </SuperAdminProviders>
    </div>
  );
}
