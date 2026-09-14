interface FlatTableColumn {
  key: string;
  label: string;
  valueClassName?: string;
}

interface FlatTableRow {
  id: string;
  cells: Record<string, string>;
}

interface FlatTableProps {
  columns: FlatTableColumn[];
  rows: FlatTableRow[];
  emptyLabel?: string;
}


export default function FlatTable({
  columns,
  rows,
  emptyLabel = "Nothing to show yet.",
}: FlatTableProps) {
  const gridTemplate = `repeat(${columns.length}, minmax(0, 1fr))`;

  if (rows.length === 0) {
    return (
      <div className="flex w-full flex-col gap-1">
        <div
          className="grid w-full gap-1"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          {columns.map((column) => (
            <div
              key={column.key}
              className="flex h-10.25 items-center bg-[#F8F7FC] p-3"
            >
              <span className="truncate text-[13px] font-semibold text-neutrals-900">
                {column.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex min-h-10.25 items-center px-3">
          <span className="text-[13px] text-neutrals-500">{emptyLabel}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-1">
      <div
        className="grid w-full gap-1"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        {columns.map((column) => (
          <div
            key={column.key}
            className="flex h-10.25 items-center bg-[#F8F7FC] p-3"
          >
            <span className="truncate text-[13px] font-semibold text-neutrals-900">
              {column.label}
            </span>
          </div>
        ))}
      </div>

      {rows.map((row) => (
        <div
          key={row.id}
          className="grid w-full gap-1"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          {columns.map((column) => (
            <div
              key={column.key}
              className="flex h-10.25 items-center bg-[#F8F7FC] p-3"
            >
              
              <span
                className={`truncate text-[13px] ${
                  column.valueClassName ?? "text-neutrals-900"
                }`}
              >
                {row.cells[column.key] ?? ""}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export type { FlatTableColumn, FlatTableRow };