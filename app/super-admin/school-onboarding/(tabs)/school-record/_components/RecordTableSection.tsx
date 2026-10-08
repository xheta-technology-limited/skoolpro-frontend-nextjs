import { Edit, AddSquare, Trash } from "iconsax-reactjs";
import { Button } from "@/components/ui/custom-button";

export interface RecordTableColumn {
  key: string;
  label: string;
  isColor?: boolean;
}

export interface RecordTableRow {
  id: string;
  cells: Record<string, string>;
}

interface RecordTableSectionProps {
  title: string;
  columns: RecordTableColumn[];
  rows: RecordTableRow[];
  onAdd?: () => void;
  onEditRow?: (rowId: string) => void;
  onDeleteRow?: (rowId: string) => void;
  deletingRowId?: string | null;
  emptyLabel?: string;
}

export default function RecordTableSection({
  title,
  columns,
  rows,
  onAdd,
  onEditRow,
  onDeleteRow,
  deletingRowId = null,
  emptyLabel = "Nothing added yet",
}: RecordTableSectionProps) {
  const gridTemplate = `repeat(${columns.length}, minmax(0, 1fr)) 128px`;

  return (
    <section className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[16px] font-normal leading-6 text-neutrals-text-body-light-1 [font-family:var(--font-inter)]">
          {title.toUpperCase()}
        </span>

        {onAdd && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onAdd}
            leftIcon={<AddSquare size={16} variant="Bulk" color="#010081" />}
          >
            Add
          </Button>
        )}
      </div>

      <div className="w-full rounded-2xl border border-primary-100 bg-primary-bg p-2">
        <div
          className="grid h-8.5 items-center rounded-t-2xl border border-grays-borders bg-[#FFFFFF] px-2"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          {columns.map((column) => (
            <span
              key={column.key}
              className="min-w-0 truncate pr-2 text-[12px] font-medium leading-[1.2] text-neutrals-700"
            >
              {column.label}
            </span>
          ))}
          <span className="text-[12px] font-medium leading-[1.2] text-neutrals-700">
            Action
          </span>
        </div>

        {rows.length === 0 && (
          <div className="mt-1 flex h-12.5 items-center bg-[#FFFFFF] px-2">
            <span className="text-[13px] text-neutrals-500">
              {emptyLabel}
            </span>
          </div>
        )}

        {rows.map((row, index) => {
          const isLast = index === rows.length - 1;

          return (
            <div
              key={row.id}
              className={`mt-1 grid h-12.5 items-center bg-[#FFFFFF] px-2 ${
                !isLast ? "border-b border-neutrals-100" : "rounded-b-2xl"
              }`}
              style={{ gridTemplateColumns: gridTemplate }}
            >
              {columns.map((column) => {
                const value = row.cells[column.key];

                return (
                  <span
                    key={column.key}
                    className="flex min-w-0 items-center gap-2 pr-2"
                  >
                    {column.isColor && value && (
                      <span
                        className="h-3.5 w-3.5 shrink-0 rounded-[4px] border border-neutrals-100"
                        style={{ backgroundColor: value }}
                        aria-hidden="true"
                      />
                    )}
                    <span className="truncate text-[13px] font-normal leading-[1.2] text-neutrals-900">
                      {value || "—"}
                    </span>
                  </span>
                );
              })}

              <div className="flex items-center justify-between gap-2">
                {onEditRow && (
                  <button
                    type="button"
                    onClick={() => onEditRow(row.id)}
                    className="flex h-6.5 w-fit items-center gap-1 rounded-xl border border-grays-borders py-1.5 pl-2 pr-2 text-[13px] font-normal text-neutrals-700 transition-opacity duration-300 ease-out"
                  >
                    <Edit size={16} variant="Bulk" color="#5a5555" />
                    Edit
                  </button>
                )}

                {rows.length > 1 && onDeleteRow && (
                  <button
                    type="button"
                    onClick={() => onDeleteRow(row.id)}
                    disabled={deletingRowId === row.id}
                    className="flex w-fit items-center text-[13px] font-normal text-[#D92D20] disabled:cursor-not-allowed disabled:opacity-70"
                    aria-label="Delete"
                  >
                    {deletingRowId === row.id ? (
                      <span
                        className="h-4 w-4 animate-spin rounded-full border-2 border-[#D92D20]/30 border-t-[#D92D20]"
                        aria-hidden="true"
                      />
                    ) : (
                      <Trash size={16} variant="Bulk" color="#D92D20" />
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}