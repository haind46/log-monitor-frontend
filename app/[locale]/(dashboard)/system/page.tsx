import { Metadata } from "next";
import UserHeading from "~/app/[locale]/(dashboard)/system/heading";
import SystemTable from "~/app/[locale]/(dashboard)/system/table";
import SheetContainer from './form-container'

export const metadata: Metadata = {
  title: "Danh mục Hệ thống",
};

export default async function UserPage() {
  return (
    <div className="p-2">
      <UserHeading />
      <SystemTable />
      <SheetContainer />
    </div>
  );
}
