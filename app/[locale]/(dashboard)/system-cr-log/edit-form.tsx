import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SubmitButton } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "~/components/ui/sheet";
import { toast } from "~/components/ui/use-toast";
import { updateSystemCrLog } from "~/core/api/systemCrLog";
import { useStore } from "./store";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const EditFormSchema = z.object({
  startTime: z.string(),
  endTime: z.string().optional().nullable(),
  impactedSystem: z.string(),
  implementUnit: z.string().optional().nullable(),
  implementer: z.string().optional().nullable(),
  approver: z.string().optional().nullable(),
  status: z.string(),
  procedureFile: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  sourceSystem: z.string().optional().nullable(),
  relatedSystems: z.array(z.string()).optional(),
});

type EditFormInput = z.infer<typeof EditFormSchema>;

function toDatetimeLocal(val?: string) {
  if (!val) return "";
  const date = new Date(val);
  // Lấy đúng định dạng YYYY-MM-DDTHH:mm
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
}

export default function FormEditSystemCrLog() {
  const t = useTranslations("system-cr-log");
  const tGlobal = useTranslations("global");
  const { setIsOpenSheet, editSystemData: configData } = useStore(
    (state) => state
  );
  const queryClient = useQueryClient();

  const form = useForm<EditFormInput>({
    resolver: zodResolver(EditFormSchema),
    defaultValues: {
      ...configData,
      startTime: toDatetimeLocal(configData?.startTime ?? undefined),
      endTime: toDatetimeLocal(configData?.endTime ?? undefined),
      impactedSystem: configData?.impactedSystem ?? "",
      status: configData?.status !== undefined ? String(configData.status) : "",
      relatedSystems: Array.isArray(configData?.relatedSystems)
        ? (configData?.relatedSystems as string[] ?? [])
        : typeof configData?.relatedSystems === "string"
        ? (configData?.relatedSystems as string)
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : ([] as string[]),
    },
  });

  const editMutation = useMutation({
    mutationFn: updateSystemCrLog,
    onSuccess() {
      setIsOpenSheet(false);
      toast({
        title: t("form.updateSuccess"),
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
    const convertToISO = (val?: string | null) =>
      val ? new Date(val).toISOString() : undefined;

    const payload = {
      ...data,
      startTime: convertToISO(data.startTime) ?? "",
      endTime: convertToISO(data.endTime) ?? "",
      relatedSystems: data.relatedSystems
        ? Array.isArray(data.relatedSystems)
          ? data.relatedSystems
          : typeof data.relatedSystems === "string"
          ? String(data.relatedSystems)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : []
        : [],
      implementUnit: data.implementUnit ?? undefined,
      implementer: data.implementer ?? undefined,
      approver: data.approver ?? undefined,
      procedureFile: data.procedureFile ?? undefined,
      description: data.description ?? undefined,
      note: data.note ?? undefined,
      sourceSystem: data.sourceSystem ?? undefined,
    };

    if (!configData?.id) return;
    editMutation.mutateAsync({
      id: configData.id,
      updatedSystemCrLog: payload,
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-2">
        <SheetHeader>
          <SheetTitle>
            [{tGlobal("edit")}] {t("form.edit")}
          </SheetTitle>
          <SheetDescription>{t("form.editDescription")}</SheetDescription>
        </SheetHeader>

        <FormField
          control={form.control}
          name={"startTime"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.startTime")}</FormLabel>
              <span className="text-[red]">*</span>
              <FormControl>
                <Input type="datetime-local" {...field} value={field.value ?? ""} />
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
                <Input type="datetime-local" {...field} value={field.value??""}/>
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
                <Input {...field} value={field.value ?? ""} />
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
                <Input {...field} value={field.value??""}/>
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
                <Input {...field} value={field.value??""}/>
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
                <Input {...field} value={field.value??""}/>
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
                <Input {...field} value={field.value??""}/>
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
                <Input {...field} value={field.value??""}/>
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
                <Input {...field} value={field.value??""}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <SubmitButton
            disabled={editMutation.isLoading}
            loading={editMutation.isLoading}
          >
            {tGlobal("saveChange")}
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
