"use client";
import { Construction } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next-intl/link";
import { useTranslations } from "next-intl";
import { Metadata } from "next";

export default function UnderConstruction() {
  const t = useTranslations("UnderConstruction");
  return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <Construction size={60} className="mb-6 text-yellow-500 animate-bounce" />
      <h2 className="text-2xl font-bold mb-2">{t("title")}</h2>
      <p className="mb-6 text-gray-500 text-center max-w-lg">
        {t("description")}
      </p>
      <Button variant="outline">
        <Link href="/">{t("back")}</Link>
      </Button>
    </div>
  );
}
