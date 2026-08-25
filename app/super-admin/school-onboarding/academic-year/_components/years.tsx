import { Text } from "@/components/ui";
import { dummyData } from "../constants";
import { Button } from "@/components/ui/custom-button";
import { Add } from "iconsax-reactjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWrapper,
} from "@/components/ui/table";
import { MiniSelector } from "@/components/common";

const headRow = ["Name", "Start", "End", "Status", "Action"];
export default function AcademicYears() {
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <span className="bg-secondary-700 h-4 w-4 rounded-full inline-block mr-2" />
          <Text weight={"accent"} scale={"highlight"}>
            {dummyData.name.toUpperCase()}
          </Text>
        </div>

        <MiniSelector
          items={[
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
        />
      </div>

      <div className="mb-4 flex justify-between text-neutrals-text-body-light-1 text-[1rem] items-center">
        <span>TERM</span>
        <Button variant="secondary" className="text-primary">
          <Add variant="Bulk" size={16} />
          <Text weight={"standard"} scale={"caption"}>
            Edit
          </Text>
        </Button>
      </div>

      <div className="rounded-ml bg-primary-bg p-6 border border-primary-100">
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
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow>
                  <TableCell>First Term</TableCell>
                  <TableCell>17/08/2026</TableCell>
                  <TableCell>17/08/2026</TableCell>
                  <TableCell>Current</TableCell>
                  <TableCell>
                    <MiniSelector
                      items={[
                        { label: "Active", value: "active" },
                        { label: "Inactive", value: "inactive" },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      </div>
    </>
  );
}
