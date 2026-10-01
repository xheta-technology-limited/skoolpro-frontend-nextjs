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

export default async function SinglePromotion() {
  const searchParams = useSearchParams();
  const id = searchParams.get("promotionId");

  const { data, isPending, isFetching, error, refetch, isSuccess, isError } =
    useGetSinglePromotion(id || "");
  const stage =
    data?.status === "committed"
      ? 3
      : data?.status === "prepared"
      ? 2
      : data?.status === "discarded"
      ? 1
      : 0;

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
                {`Review promotion · ${data.source_year} → ${data.target_year}`}
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
