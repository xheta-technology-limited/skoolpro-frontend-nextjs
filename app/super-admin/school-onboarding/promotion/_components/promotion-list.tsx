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

export default function PromotionList() {
  const { data, isSuccess, isPending, error, isFetching, refetch } =
    useGetPromotions();

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
  if (isSuccess && data.length === 0) {
    return (
      <div className="w-fit mx-auto">
        {" "}
        <NoData
          variant="page"
          title="No promotions created"
          subTitle={
            "You can create a new promotion with the button above or when drafting a new academic year"
          }
          className="w-97.5 h-143.75"
        />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {data.map((d) => (
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
  const onButtonClick = () => router.push(`/super-admin/promotion/${p.id}`);
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
