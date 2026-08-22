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

        <main className="w-full">
          <StatusBar />
          <div>{children}</div>
        </main>
      </SuperAdminProviders>
    </div>
  );
}
