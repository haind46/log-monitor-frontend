import { Metadata } from "next";
import { sleep } from "~/lib/utils";

export const metadata: Metadata = {
  title: "roles",
};

export default async function RolePage() {
  await sleep(3000);
  return <div>role</div>;
}
