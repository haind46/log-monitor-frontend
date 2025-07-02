import { Metadata } from "next";
import UserHeading from "./heading";
import SystemTable from "./table";
import SheetContainer from './form-container'

export const metadata: Metadata = {
  title: "Tra cứu log/event",
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
