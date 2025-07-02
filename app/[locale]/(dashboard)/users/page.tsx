import { Metadata } from "next";
import UserHeading from "~/app/[locale]/(dashboard)/users/heading";
import UserTable from "~/app/[locale]/(dashboard)/users/table";
import SheetContainer from './form-container'

export const metadata: Metadata = {
  title: "Quản lý Người dùng",
};

export default async function UserPage() {
  return (
    <div className="p-2">
      <UserHeading />
      <UserTable />
      <SheetContainer />
    </div>
  );
}
