"use client";

import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Input } from "~/components/ui/input";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { toast } from "~/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitButton } from "~/components/ui/button";
import { useForm } from "react-hook-form";
import { useStore } from "./store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSystemCrLog } from "~/core/api/systemCrLog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const CreateFormSchema = z.object({
  startTime: z.string(),
  endTime: z.string().optional(),
  impactedSystem: z.string(),
  implementUnit: z.string().optional(),
  implementer: z.string().optional(),
  approver: z.string().optional(),
  status: z.string(),
  procedureFile: z.string().optional(),
  description: z.string().optional(),
  note: z.string().optional(),
  sourceSystem: z.string().optional(),
  relatedSystems: z.string().optional(),
});

type CreateFormInput = z.infer<typeof CreateFormSchema>;

export default function FormCreateSystemCrLog() {
  const t = useTranslations("system-cr-log");
  const tGlobal = useTranslations("global");
  const queryClient = useQueryClient();
  const { setIsOpenSheet } = useStore((state) => state);

  const form = useForm<CreateFormInput>({
    resolver: zodResolver(CreateFormSchema),
  });

  const createMutation = useMutation({
    mutationFn: createSystemCrLog,
    onSuccess() {
      setIsOpenSheet(false);
      toast({
        title: t("form.addNewSuccess"),
      });
      queryClient.invalidateQueries({
        queryKey: ["getListSystemCrLog"],
      });
    },
    onError(error: any) {
      toast({
        variant: "destructive",
        title: t("form.errorTitle"),
        description: error.response?.data?.message || error.message,
      });
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    // Chuyển đổi startTime và endTime sang ISO 8601 (có giây và Z)
    const convertToISO = (val?: string) =>
      val ? new Date(val).toISOString() : undefined;

    const payload = {
      ...data,
      startTime: convertToISO(data.startTime) ?? "",
      endTime: convertToISO(data.endTime),
      relatedSystems: data.relatedSystems
        ? typeof data.relatedSystems === "string"
          ? data.relatedSystems
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : data.relatedSystems
        : [],
    };

    createMutation.mutateAsync(payload);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-2">
        <SheetHeader>
          <SheetTitle>
            [{tGlobal("create")}] {t("form.create")}
          </SheetTitle>
          <SheetDescription>{t("form.createDescription")}</SheetDescription>
        </SheetHeader>

        <FormField
          control={form.control}
          name={"startTime"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.startTime")}</FormLabel>
              <span className="text-[red]">*</span>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"endTime"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.endTime")}</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"impactedSystem"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.impactedSystem")}</FormLabel>
              <span className="text-[red]">*</span>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("table.impactedSystem")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Toàn hệ thống">
                      {t("form.impactedSystemAll") || "Toàn hệ thống"}
                    </SelectItem>
                    <SelectItem value="Phân hệ">
                      {t("form.impactedSystemModule") || "Phân hệ"}
                    </SelectItem>
                    <SelectItem value="Dịch vụ">
                      {t("form.impactedSystemService") || "Dịch vụ"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"sourceSystem"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.sourceSystem")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"relatedSystems"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.relatedSystems")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={
                    Array.isArray(field.value)
                      ? field.value.join(", ")
                      : field.value || ""
                  }
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder={t("form.relatedSystemsPlaceholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"implementUnit"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.implementUnit")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"implementer"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.implementer")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"approver"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.approver")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"status"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.status")}</FormLabel>
              <span className="text-[red]">*</span>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("table.status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">
                      {tGlobal("active") || "Active"}
                    </SelectItem>
                    <SelectItem value="0">
                      {tGlobal("disabled") || "Disabled"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"procedureFile"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.procedureFile")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"description"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.description")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"note"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.note")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <SubmitButton
            disabled={createMutation.isLoading}
            loading={createMutation.isLoading}
          >
            {tGlobal("saveChange")}
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
