import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "home"
};

export default function Home() {
  return redirect("/users");
}
