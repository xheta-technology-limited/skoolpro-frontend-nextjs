import { Text } from "@/components/ui";
import { ArrowLeft } from "iconsax-reactjs";
import Link from "next/link";
import HeaderButton from "./button";

export default function Header() {
  return (
    <div className="flex justify-between items-center flex-wrap md:min-w-xl lg:min-w-2xl mb-6 gap-4">
      <Link
        href={"/super-admin/user-management"}
        replace
        className="flex gap-3 cursor-pointer items-center"
      >
        <ArrowLeft variant="Bulk" size={24} />
        <Text weight={"accent"} scale={"feature"} className="text-neutrals-900">
          Role management
        </Text>
      </Link>

      <HeaderButton />
    </div>
  );
}
