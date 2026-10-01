"use client";
import { Spinner } from "@/components/animations";
import { StatusBadge } from "@/components/common";
import { NoData } from "@/components/icons";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { useProgressRouter } from "@/features/page-loader";
import { useGetPromotions } from "@/features/promotion/api/get-promotions";
import { Promotion } from "@/features/promotion/types/api/promotion";
import { titleCase } from "@/lib/helpers";
import { isoToLongDate } from "@/lib/helpers/convert-dates";
import { ArrowRight3 } from "iconsax-reactjs";

const DUMMY_PROMOTIONS: Promotion[] = [
  {
    id: "dummy-prepared-1",
    school_id: "dummy-school",
    source_academic_year_id: "dummy-year-1",
    target_academic_year_id: "dummy-year-2",
    status: "prepared",
    counts: { promoted: 0, graduated: 0, repeated: 0, held: 0 },
    prepared_at: "2027-08-01T09:00:00+00:00",
    committed_at: null,
    source_year: { id: "dummy-year-1", name: "2026 / 2027" },
    target_year: { id: "dummy-year-2", name: "2027 / 2028" },
    created_at: "2027-08-01T09:00:00+00:00",
    updated_at: "2027-08-01T09:00:00+00:00",
  },
  {
    id: "dummy-committed-1",
    school_id: "dummy-school",
    source_academic_year_id: "dummy-year-3",
    target_academic_year_id: "dummy-year-4",
    status: "committed",
    counts: { promoted: 142, graduated: 11, repeated: 4, held: 0 },
    prepared_at: "2026-08-01T09:00:00+00:00",
    committed_at: "2026-08-12T14:30:00+00:00",
    source_year: { id: "dummy-year-3", name: "2025 / 2026" },
    target_year: { id: "dummy-year-4", name: "2026 / 2027" },
    created_at: "2026-08-01T09:00:00+00:00",
    updated_at: "2026-08-12T14:30:00+00:00",
  },
  {
    id: "dummy-discarded-1",
    school_id: "dummy-school",
    source_academic_year_id: "dummy-year-5",
    target_academic_year_id: "dummy-year-6",
    status: "discarded",
    counts: { promoted: 0, graduated: 0, repeated: 0, held: 23 },
    prepared_at: "2025-08-01T09:00:00+00:00",
    committed_at: null,
    source_year: { id: "dummy-year-5", name: "2024 / 2025" },
    target_year: { id: "dummy-year-6", name: "2025 / 2026" },
    created_at: "2025-08-01T09:00:00+00:00",
    updated_at: "2025-08-03T10:15:00+00:00",
  },
  {
    id: "dummy-committed-1",
    school_id: "dummy-school",
    source_academic_year_id: "dummy-year-3",
    target_academic_year_id: "dummy-year-4",
    status: "committed",
    counts: { promoted: 142, graduated: 11, repeated: 4, held: 0 },
    prepared_at: "2026-08-01T09:00:00+00:00",
    committed_at: "2026-08-12T14:30:00+00:00",
    source_year: { id: "dummy-year-3", name: "2025 / 2026" },
    target_year: { id: "dummy-year-4", name: "2026 / 2027" },
    created_at: "2026-08-01T09:00:00+00:00",
    updated_at: "2026-08-12T14:30:00+00:00",
  },
  {
    id: "dummy-discarded-1",
    school_id: "dummy-school",
    source_academic_year_id: "dummy-year-5",
    target_academic_year_id: "dummy-year-6",
    status: "discarded",
    counts: { promoted: 0, graduated: 0, repeated: 0, held: 23 },
    prepared_at: "2025-08-01T09:00:00+00:00",
    committed_at: null,
    source_year: { id: "dummy-year-5", name: "2024 / 2025" },
    target_year: { id: "dummy-year-6", name: "2025 / 2026" },
    created_at: "2025-08-01T09:00:00+00:00",
    updated_at: "2025-08-03T10:15:00+00:00",
  },
  {
    id: "dummy-committed-1",
    school_id: "dummy-school",
    source_academic_year_id: "dummy-year-3",
    target_academic_year_id: "dummy-year-4",
    status: "committed",
    counts: { promoted: 142, graduated: 11, repeated: 4, held: 0 },
    prepared_at: "2026-08-01T09:00:00+00:00",
    committed_at: "2026-08-12T14:30:00+00:00",
    source_year: { id: "dummy-year-3", name: "2025 / 2026" },
    target_year: { id: "dummy-year-4", name: "2026 / 2027" },
    created_at: "2026-08-01T09:00:00+00:00",
    updated_at: "2026-08-12T14:30:00+00:00",
  },
  {
    id: "dummy-discarded-1",
    school_id: "dummy-school",
    source_academic_year_id: "dummy-year-5",
    target_academic_year_id: "dummy-year-6",
    status: "discarded",
    counts: { promoted: 0, graduated: 0, repeated: 0, held: 23 },
    prepared_at: "2025-08-01T09:00:00+00:00",
    committed_at: null,
    source_year: { id: "dummy-year-5", name: "2024 / 2025" },
    target_year: { id: "dummy-year-6", name: "2025 / 2026" },
    created_at: "2025-08-01T09:00:00+00:00",
    updated_at: "2025-08-03T10:15:00+00:00",
  },
];

export default function PromotionList() {
  const { isPending, error, isFetching, refetch } = useGetPromotions();

  if (isPending) {
    return (
      <div className="w-full flex items-center justify-center py-7">
        <Spinner size={70} />
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-fit mx-auto">
        {" "}
        <NoData
          variant="signal"
          title="Something went Wrong"
          subTitle={error.message || ""}
          className="w-97.5 h-143.75"
        />
        <Button
          className="mt-3 w-full"
          loading={isFetching}
          onClick={() => refetch()}
          size="lg"
        >
          Retry
        </Button>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {DUMMY_PROMOTIONS.map((d) => (
        <Item key={d.id} promotion={d} />
      ))}
    </div>
  );
}

interface Props {
  promotion: Promotion;
}
function Item({ promotion: p }: Props) {
  const router = useProgressRouter();
  const onButtonClick = () =>
    router.push(`/super-admin/promotion/${p.id}`);
  return (
    <div className="rounded-ml border border-grays-borders flex justify-between px-4 py-6 items-center">
      <div className="gap-2 flex flex-col">
        <Text
          className="text-neutrals-800"
          scale={"highlightMobile"}
          weight={"standard"}
        >
          {`${p.source_year.name} > ${p.target_year.name}`}
        </Text>
        <Text
          className="text-neutrals-800"
          scale={"contentMobile"}
          weight={"standard"}
        >
          {`${titleCase(p.status)} · ${
            isoToLongDate(p.committed_at || "") ??
            isoToLongDate(p.prepared_at || "")
          }`}
          {p.status === "committed"
            ? ` · ${p.counts.promoted} promoted · ${p.counts.graduated} graduated · ${p.counts.repeated} repeated`
            : p.status === "prepared"
            ? ""
            : ""}
        </Text>
      </div>

      <div className="flex items-center gap-4">
        <StatusBadge
          scale="captionMobile"
          data={titleCase(p.status)}
          variant={
            p.status === "committed"
              ? "green"
              : p.status === "prepared"
              ? "orange"
              : "red"
          }
        />
        {p.status === "committed" ? (
          <Button
            variant="secondary"
            onClick={onButtonClick}
            size="sm"
            rightIcon={
              <ArrowRight3 variant="Bulk" size={16} className="text-primary" />
            }
          >
            Review
          </Button>
        ) : (
          <Button variant="tertiary" size="sm" onClick={onButtonClick}>
            View
          </Button>
        )}
      </div>
    </div>
  );
}
