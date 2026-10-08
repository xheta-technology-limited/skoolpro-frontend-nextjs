export default function SchoolOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //all children components should have a div with two parts: header(where back button stays) and content
  return <div className="flex flex-col gap-6">{children}</div>;
}
