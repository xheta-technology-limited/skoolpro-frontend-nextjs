"use client";

import { ReactNode, useMemo, useState } from "react";
import { Text } from "@/components/ui";
import { Spinner } from "@/components/animations";
import { MiniSelector } from "@/components/common";
import {
  TableWrapper,
  TableHeader,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { createSelectOptions, titleCase } from "@/lib/helpers";
import { useSearchParams } from "next/navigation";
import { useListComments } from "@/features/comment-bank/api/list-comments";
import { CreateCommentFormData } from "@/features/comment-bank/schemas/create-comment-schema";
import { NoData } from "@/components/icons";
import { Button } from "@/components/ui/custom-button";
import { X, XIcon } from "@phosphor-icons/react";
import { useListLevels } from "@/features/academic-year/api/list-levels";
import { useDeleteComment } from "@/features/comment-bank/api/delete-comment";
import { toast } from "sonner";
import AddComment from "./modals/add-comment";
import { useProgressRouter } from "@/features/page-loader";
import SeedScale from "./modals/seed";

const headRow = ["Score band", "Comment", "Status", "Action"];
export default function Body() {
  const [typeQuery, setTypeQuery] = useState<string>("form_teacher");
  const [levelQuery, setLevelQuery] = useState("");
  const router = useProgressRouter();
  const searchParams = useSearchParams();
  const commentId = searchParams.get("comment-id");

  const {
    data,
    isPending,
    isRefetching,
    error,
    isFetching,
    isFetched,
    refetch,
    isSuccess,
  } = useListComments(
    { type: typeQuery, education_level_id: levelQuery },
    { refetchOnWindowFocus: false }
  );

  const { isPending: isDeletePending, mutate: deleteMutate } =
    useDeleteComment();
  const onDelete = (id: string) => {
    deleteMutate(
      { commentId: id },
      { onError: (err) => toast.error(err.message) }
    );
  };

  const { data: levelData, isPending: isLevelsPending } = useListLevels({
    refetchOnWindowFocus: false,
  });
  const q = createSelectOptions(levelData, "id", "name");
  const levelOptions = [
    { value: "all", label: "All levels(school wide)" },
    ...(q || []),
  ];
  const typeOptions = [{ value: "form_teacher", label: "Form teacher" }];

  const defaults = useMemo<CreateCommentFormData | undefined>(() => {
    if (!commentId) return undefined;
    const comment = data?.find((c) => c.id === commentId);
    if (!comment) return undefined;
    return {
      type: comment.type as CreateCommentFormData["type"],
      education_level_id: comment.education_level_id ?? undefined,
      min_score: String(comment.min_score),
      max_score: String(comment.max_score),
      body: comment.body,
      sequence: comment.sequence != null ? String(comment.sequence) : undefined,
    };
  }, [commentId, data]);

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

  if (isSuccess && !isFetched && data.length === 0) {
    return (
      <Modals defaults={defaults}>
        <div className="w-fit mx-auto">
          {" "}
          <NoData
            variant="page"
            title="No comments yet"
            subTitle={"You can create a new comment with the button above"}
            className="w-97.5 h-143.75"
          />
        </div>
      </Modals>
    );
  }
  return (
    <Modals defaults={defaults}>
      <div className="flex w-full flex-col gap-8 rounded-2xl border border-grays-borders bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Text className="text-neutrals-600">COMMENT BANK</Text>
            {isRefetching && <Spinner size={16} color="#5A5555" />}
          </div>

          <div className="flex gap-4 items-center mb-4">
            <Text className="text-neutrals-600" scale={"caption"}>
              {`${data.length} ${data.length > 1 ? "comments" : "comment"}`}
            </Text>
            {/* TODO: Eventually list teachers */}
            <MiniSelector
              label="Form Teacher"
              defaultValue={"form_teacher"}
              items={typeOptions}
              onValueChange={(e) => setTypeQuery(e as string)}
            />
            <MiniSelector
              disabled={isLevelsPending}
              defaultValue={"all"}
              onValueChange={(e) => {
                if (e === "all") {
                  setLevelQuery("");
                } else {
                  setLevelQuery(e as string);
                }
              }}
              items={levelOptions || []}
              label="All level(school wide)"
            />
          </div>
        </div>

        <TableWrapper>
          <Table>
            <TableHeader>
              <TableRow>
                {headRow.map((col, index) => {
                  const isMiddle = index != 0 && index != headRow.length - 1;
                  const style = isMiddle ? "border-t-[1px] border-b-[1px]" : "";
                  return (
                    <TableHead className={style} key={col}>
                      {col}
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((c, index) => (
                <TableRow key={index}>
                  <TableCell className="text-success-300">
                    {`${Math.floor(c.min_score)} - ${Math.floor(c.max_score)}`}
                  </TableCell>
                  <TableCell>{c.body}</TableCell>
                  <TableCell>{c.is_active ? "Active" : "Inactive"}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <button
                        className="py-1.5 px-2 rounded-[12px] text-[0.75rem] flex items-center border border-grays-borders"
                        onClick={() =>
                          router.push(`?add-comment=true&comment-id=${c.id}`)
                        }
                      >
                        <Text
                          scale={"captionMobile"}
                          className="text-neutrals-700"
                        >
                          Edit
                        </Text>
                      </button>

                      <button
                        disabled={isDeletePending}
                        onClick={() => onDelete(c.id)}
                      >
                        <XIcon size={20} color="rgba(112,113,112,1)" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      </div>
    </Modals>
  );
}

const Modals = ({
  children,
  defaults,
}: {
  children: ReactNode;
  defaults?: CreateCommentFormData;
}) => {
  return (
    <>
      <AddComment defaults={defaults} />
      <SeedScale />
      {children}
    </>
  );
};
