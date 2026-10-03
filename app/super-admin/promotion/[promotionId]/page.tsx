"use client";
import { useGetSinglePromotion } from "@/features/promotion/api/get-single-promotion";
import Header from "../_components/single-promotion/header";
import { Text } from "@/components/ui";
import { getPromotions } from "@/features/promotion/api/get-promotions";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@/components/animations";
import { NoData } from "@/components/icons";
import { Button } from "@/components/ui/custom-button";
import CurrentStage from "../_components/single-promotion/steps";
import { useEffect } from "react";
import Counts from "../_components/single-promotion/card";

const dummy = {
  id: "dummy-discarded-1",
  school_id: "dummy-school",
  source_academic_year_id: "dummy-year-5",
  target_academic_year_id: "dummy-year-6",
  status: "prepared",
  counts: { promoted: 0, graduated: 0, repeated: 0, held: 23 },
  prepared_at: "2025-08-01T09:00:00+00:00",
  committed_at: null,
  source_year: { id: "dummy-year-5", name: "2024 / 2025" },
  target_year: { id: "dummy-year-6", name: "2025 / 2026" },
  created_at: "2025-08-01T09:00:00+00:00",
  updated_at: "2025-08-03T10:15:00+00:00",
};
export default function SinglePromotion() {
  const searchParams = useSearchParams();
  const id = searchParams.get("promotionId");

  const { data, isPending, isFetching, error, refetch, isSuccess, isError } =
    useGetSinglePromotion(id || "");
  const stage =
    dummy.status === "committed" //TODO: Change back to data
      ? 3
      : dummy.status === "prepared"
      ? 2
      : dummy.status === "discarded"
      ? 1
      : 0;

  useEffect(() => {
    console.log("le stage: ", stage);
  }, [stage]);

  return (
    <>
      <Header />
      <div className="p-6 rounded-ml bg-white flex flex-col">
        {isSuccess ? (
          <>
            <div className="gap-2 flex flex-col mb-8">
              <Text
                scale={"highlight"}
                weight={"accent"}
                className="text-neutrals-800"
              >
                {`Review promotion · ${dummy.source_year.name} → ${dummy.target_year.name}`}
              </Text>
              <Text
                scale={"content"}
                weight={"standard"}
                className="text-neutrals-700"
              >
                SkoolPro proposes what happens to each student. Adjust the ones
                that need it — hold students back, place the ones with no
                matching class — then commit.
              </Text>
            </div>

            {stage !== 0 && <CurrentStage stage={stage} />}
            <Counts data={data.counts} />
          </>
        ) : isPending ? (
          <>
            <div className="w-full flex items-center justify-center py-7">
              <Spinner size={70} />
            </div>
          </>
        ) : isError ? (
          <>
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
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
