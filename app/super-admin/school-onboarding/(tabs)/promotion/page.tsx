import { Text } from "@/components/ui";
import { getPromotions } from "@/features/promotion/api/get-promotions";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import PromotionList from "./_components/promotion-list";
import Header from "../../_components/header";

export default async function Promotion() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["promotions"],
    queryFn: () => getPromotions(),
  });

  return (
    <div className="w-full h-[55vh] md:h-[65vh] overflow-auto p-6">
      <Header label="Promotion Run" />

      <div className="mb-8 flex w-full flex-col gap-4 rounded-2xl border border-grays-borders bg-white p-4">
        <div className="flex flex-wrap justify-between gap-8 items-center">
          <div className="max-w-146.5 min-w-70">
            <Text
              scale={"highlight"}
              weight={"accent"}
              className="mb-1 text-neutrals-800"
            >
              Promotion runs
            </Text>
            <Text mobile scale={"contentMobile"} className="text-neutrals-700">
              Advancing a year’s students into the next. A run is prepared
              automatically when next year’s draft is generated review it, then
              commit. Nothing moves until you do.
            </Text>
          </div>

          {/* <PrepareRunButton /> */}
        </div>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <PromotionList />
        </HydrationBoundary>
      </div>
    </div>
  );
}
