"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next-intl/client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const translations = ["en", "vn"];
  const t = useTranslations("LocaleSwitcher");

  function onSelectChange(event: String) {
    router.replace(`/${event}${pathname}`);
  }

  return (
    <Select defaultValue={locale} onValueChange={(event) => onSelectChange(event)}>
      <SelectTrigger
        className="w-[120px] px-3 py-1 text-white border border-white rounded-md bg-black/30 hover:bg-white hover:text-black transition duration-150"
      >
        <SelectValue defaultValue={locale} />
      </SelectTrigger>
      <SelectContent className="bg-white text-black">
        <SelectGroup>
          {translations.map((cur) => (
            <SelectItem key={cur} value={cur}>
              {t("locale", { locale: cur })}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
