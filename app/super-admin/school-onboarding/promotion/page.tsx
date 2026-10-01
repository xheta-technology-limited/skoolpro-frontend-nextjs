import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { getPromotions } from "@/features/promotion/api/get-promotions";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { AddSquare } from "iconsax-reactjs";
import PromotionList from "./_components/promotion-list";

export default async function Promotion() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["promotions"],
    queryFn: () => getPromotions(),
  });

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Text
            scale={"highlight"}
            weight={"accent"}
            className="mb-1 text-neutrals-800"
          >
            Promotion runs
          </Text>
          <Text scale={"content"} className="text-neutrals-700">
            Advancing a year’s students into the next. A run is prepared
            automatically when next year’s draft is generated review it, then
            commit. Nothing moves until you do.
          </Text>
        </div>

        <Button
          onClick={() => alert("Not implemented")}
          leftIcon={
            <AddSquare variant="Bulk" size={16} className="text-primary" />
          }
          variant="secondary"
          size="sm"
        >
          Prepare a Run
        </Button>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <PromotionList />
      </HydrationBoundary>
    </>
  );
}
