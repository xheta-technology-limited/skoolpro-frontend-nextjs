"use client";

import FlatTable, {
  type FlatTableRow,
} from "../../_components/FlatTable"

const PAYMENT_COLUMNS = [
  { key: "date", label: "Date" },
  { key: "description", label: "Description" },
  {
    key: "amount",
    label: "Amount",
    valueClassName: "font-semibold text-[#15B097]",
  },
];

const MOCK_PAYMENT_ROWS: FlatTableRow[] = Array.from(
  { length: 8 },
  (_, index) => ({
    id: `payment-${index}`,
    cells: {
      date: "01/08/2025",
      description: "First term 01/09/2025 - 12/12/2025",
      amount: "₦320,000",
    },
  })
);

export default function StudentBillingPage() {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-[12px] font-medium uppercase tracking-wide text-neutrals-500">
        Student payments
      </span>

      <FlatTable
        columns={PAYMENT_COLUMNS}
        rows={MOCK_PAYMENT_ROWS}
        emptyLabel="No payments recorded yet."
      />
    </div>
  );
}