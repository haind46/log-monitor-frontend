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
import { createIncident } from "~/core/api/incident";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useEffect, useState } from "react";
import { getList as getSeverityList } from "~/core/api/severity";

// Incident form schema mapping IncidentRequest DTO
const CreateFormSchema = z.object({
  incidentCode: z.string().max(50).optional().nullable(),
  title: z.string().max(255),
  description: z.string().optional().nullable(),
  incidentTime: z.string(),
  resolvedTime: z.string().optional().nullable(),
  status: z.string().max(30).optional().nullable(),
  severity: z.string().max(20).optional().nullable(),
  sourceSystem: z.string().max(100).optional().nullable(),
  detectedBy: z.string().max(100).optional().nullable(),
  assignedTo: z.string().max(100).optional().nullable(),
  solution: z.string().optional().nullable(),
  relatedProcedure: z.string().max(255).optional().nullable(),
  suggestion: z.string().optional().nullable(),
});

type CreateFormInput = z.infer<typeof CreateFormSchema>;

export default function FormCreateIncident() {
  const t = useTranslations("incident");
  const tGlobal = useTranslations("global");
  const queryClient = useQueryClient();
  const { setIsOpenSheet } = useStore((state) => state);

  // Lấy danh sách mức độ từ API severity
  const [severityOptions, setSeverityOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    getSeverityList({ page: 1, size: 100, status: 1 }).then((res: any) => {
      const options =
        res?.data?.data?.map((item: any) => ({
          value: item.severityLevel,
          label: item.severityLevel,
        })) || [];
      setSeverityOptions(options);
    });
  }, []);

  const form = useForm<CreateFormInput>({
    resolver: zodResolver(CreateFormSchema),
  });

  const createMutation = useMutation({
    mutationFn: createIncident,
    onSuccess() {
      setIsOpenSheet(false);
      toast({
        title: t("form.addNewSuccess") || "Add incident successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["getListIncident"],
      });
    },
    onError(error: any) {
      toast({
        variant: "destructive",
        title: t("form.errorTitle") || "Error",
        description: error.response?.data?.message || error.message,
      });
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    // Convert incidentTime and resolvedTime to ISO string if needed
    const convertToISO = (val?: string | null) =>
      val ? new Date(val).toISOString() : undefined;

    const payload = {
      ...data,
      incidentCode: data.incidentCode ?? undefined,
      incidentTime: convertToISO(data.incidentTime) ?? "",
      resolvedTime: convertToISO(data.resolvedTime),
      description: data.description ?? "",
      status: data.status ?? undefined,
      severity: data.severity ?? undefined,
      sourceSystem: data.sourceSystem ?? undefined,
      detectedBy: data.detectedBy ?? undefined,
      assignedTo: data.assignedTo ?? undefined,
      solution: data.solution ?? undefined,
      relatedProcedure: data.relatedProcedure ?? undefined,
      suggestion: data.suggestion ?? undefined,
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
          name={"incidentCode"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.incidentCode")}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"title"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.title")}</FormLabel>
              <span className="text-[red]">*</span>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
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
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"incidentTime"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.incidentTime")}</FormLabel>
              <span className="text-[red]">*</span>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"resolvedTime"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.resolvedTime")}</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                  value={field.value ?? ""}
                />
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
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("table.status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">
                      {t("form.statusOpen") || "Open"}
                    </SelectItem>
                    <SelectItem value="in_progress">
                      {t("form.statusInProgress") || "In Progress"}
                    </SelectItem>
                    <SelectItem value="resolved">
                      {t("form.statusResolved") || "Resolved"}
                    </SelectItem>
                    <SelectItem value="closed">
                      {t("form.statusClosed") || "Closed"}
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
          name={"severity"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.severity")}</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("table.severity")} />
                  </SelectTrigger>
                  <SelectContent>
                    {severityOptions.length > 0 ? (
                      severityOptions.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="critical">
                          {t("form.severityCritical") || "Critical"}
                        </SelectItem>
                        <SelectItem value="high">
                          {t("form.severityHigh") || "High"}
                        </SelectItem>
                        <SelectItem value="medium">
                          {t("form.severityMedium") || "Medium"}
                        </SelectItem>
                        <SelectItem value="low">
                          {t("form.severityLow") || "Low"}
                        </SelectItem>
                      </>
                    )}
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
          name={"detectedBy"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.detectedBy")}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"assignedTo"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.assignedTo")}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"solution"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.solution")}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"relatedProcedure"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.relatedProcedure")}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"suggestion"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.suggestion")}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
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
