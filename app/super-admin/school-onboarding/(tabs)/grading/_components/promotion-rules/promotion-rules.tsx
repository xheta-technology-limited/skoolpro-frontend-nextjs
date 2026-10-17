"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWrapper,
} from "@/components/ui/table";
import GradeItem from "../grade-item";
import { titleCase } from "@/lib/helpers";
import { Text } from "@/components/ui";
import { Edit } from "iconsax-reactjs";
import { headRow } from "./constants";
import { useListPromotionRules } from "@/features/grade-scales/api/list-promotion-rules";
import { PromotionRule } from "@/features/grade-scales/types/api/promotion-rule";
import { CreatePromotionRuleFormData } from "@/features/grade-scales/schemas/create-promotion-rule-schema";
import AddPromotionRule from "../modals/add-promotion-rule";
import { useMemo, useState } from "react";

export default function PromotionRules() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PromotionRule | null>(null);
  const { data, isPending } = useListPromotionRules({
    refetchOnWindowFocus: false,
  });

  const defaults = useMemo<CreatePromotionRuleFormData | undefined>(() => {
    if (!editingRule) return undefined;
    const scope =
      editingRule.scope_type === "stage" || editingRule.scope_type === "level"
        ? editingRule.scope_type
        : "school";
    const { minimum_average, attendance_requirement, graduation_minimum_average } =
      editingRule;
    return {
      scope,
      education_stage_id: editingRule.education_stage_id ?? undefined,
      education_level_id: editingRule.education_level_id ?? undefined,
      minimum_average:
        minimum_average !== undefined && minimum_average !== null
          ? String(minimum_average)
          : undefined,
      require_all_compulsory: editingRule.require_all_compulsory ?? undefined,
      required_subject_assignment_ids:
        editingRule.required_subject_assignment_ids ?? undefined,
      attendance_requirement:
        attendance_requirement !== undefined && attendance_requirement !== null
          ? String(attendance_requirement)
          : undefined,
      auto_promote: editingRule.auto_promote ?? undefined,
      graduation_minimum_average:
        graduation_minimum_average !== undefined &&
        graduation_minimum_average !== null
          ? String(graduation_minimum_average)
          : undefined,
    };
  }, [editingRule]);

  const openModal = () => {
    setEditingRule(null);
    setModalOpen(true);
  };

  const openEditModal = (rule: PromotionRule) => {
    setEditingRule(rule);
    setModalOpen(true);
  };

  return (
    <GradeItem
      label="Promotion Rules"
      subLabel="The academic gates used to recommend promotion. Scoped school / stage / level (most specific wins). These feed the eligibility check shown on each student’s result."
      buttonText="Add Rule"
      buttonFunc={openModal}
      isLoading={isPending}
    >
      {!data ? (
        <></>
      ) : (
        <div className="rounded-ml bg-primary-bg p-6 border border-primary-100">
          {data.length === 0 ? (
            <></>
          ) : (
            <TableWrapper>
              <Table>
                <TableHeader>
                  <TableRow>
                    {headRow.map((col, index) => {
                      const isMiddle =
                        index != 0 && index != headRow.length - 1;
                      const style = isMiddle
                        ? "border-t-[1px] border-b-[1px]"
                        : "";
                      return (
                        <TableHead className={style} key={col}>
                          {col}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.map((rule, index) => (
                    <TableRow key={rule.id ?? index}>
                      <TableCell
                        style={{
                          color:
                            rule.scope_type === "stage"
                              ? "#CC7914"
                              : rule.scope_type === "level"
                              ? "#0088FF"
                              : undefined,
                        }}
                      >
                        {titleCase(rule.scope_type)}
                      </TableCell>
                      <TableCell>{rule.minimum_average ?? "-"}</TableCell>
                      <TableCell className="text-success-300">
                        {rule.require_all_compulsory
                          ? "All compulsory"
                          : rule.required_subject_assignment_ids?.length
                          ? `${rule.required_subject_assignment_ids.length} subject(s)`
                          : "-"}
                      </TableCell>
                      <TableCell>{rule.attendance_requirement ?? "-"}</TableCell>
                      <TableCell>
                        <button
                          className="py-1.5 px-2 rounded-[12px] text-[0.75rem] flex items-center border border-grays-borders"
                          onClick={() => openEditModal(rule)}
                        >
                          <Edit
                            variant="Bulk"
                            size={12}
                            className="text-neutrals-800"
                          />
                          <Text
                            scale={"captionMobile"}
                            className="text-neutrals-700"
                          >
                            Edit
                          </Text>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableWrapper>
          )}
          <AddPromotionRule
            isOpen={isModalOpen}
            handleClose={() => setModalOpen(false)}
            defaults={defaults}
          />
        </div>
      )}
    </GradeItem>
  );
}
