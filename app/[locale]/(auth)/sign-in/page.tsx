import { Metadata } from "next";
import SignInLdapForm from "~/app/[locale]/(auth)/sign-in/form";

export const metadata: Metadata = {
  title: "MobiFone - Trợ lý Trực ảo AI",
};

export default async function UserPage() {
  return (
    <main
      style={{
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat", // Không lặp lại ảnh nền,
        backgroundPosition: "center",
        backgroundImage: "url('/images/backdrop4.jpg')",
      }}
    >
      <div className="container flex h-screen w-screen flex-col items-center">
        <SignInLdapForm />
      </div>
    </main>
  );
}
