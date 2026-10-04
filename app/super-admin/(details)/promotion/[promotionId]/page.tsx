"use client";
import { useGetSinglePromotion } from "@/features/promotion/api/get-single-promotion";
import Header from "../_components/single-promotion/header";
import { Text } from "@/components/ui";
import { useParams } from "next/navigation";
import { Spinner } from "@/components/animations";
import { NoData } from "@/components/icons";
import { Button } from "@/components/ui/custom-button";
import CurrentStage from "../_components/single-promotion/steps";
import { useEffect } from "react";
import Counts from "../_components/single-promotion/card";
import BottomSection from "../_components/single-promotion/bottom-section";

export default function SinglePromotion() {
  const params = useParams<{ promotionId: string }>();
  const id = params.promotionId;

  const { data, isPending, isFetching, error, refetch, isSuccess, isError } =
    useGetSinglePromotion(id || "", { enabled: !!id });
  const stage =
    data?.status === "committed" //TODO: Change back to data
      ? 3
      : data?.status === "prepared"
      ? 2
      : data?.status === "discarded"
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
                {`Review promotion · ${data.source_year?.name} → ${data.target_year?.name}`}
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
            <BottomSection data={data} />
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
