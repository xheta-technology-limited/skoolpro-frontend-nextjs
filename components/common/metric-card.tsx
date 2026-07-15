interface cardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

export default function MetricCard() {
  return (
    <div className="rounded-ml bg-base-white p-4">
      <div className="flex gap-base justify-center">
        <div></div>
      </div>
    </div>
  );
}
