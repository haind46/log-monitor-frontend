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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSeverity } from "~/core/api/severity";

const CreateFormSchema = z.object({
  severityLevel: z.string().min(1),
  description: z.string().optional(),
  notifyToLevel: z.coerce.number().min(0),
  autoCall: z.enum(["true", "false"]).optional(),
  ttsTemplate: z.string().optional(),
});

type CreateFormInput = z.infer<typeof CreateFormSchema>;

export default function FormCreateSeverity() {
  const t = useTranslations("severity");
  const tGlobal = useTranslations("global");
  const queryClient = useQueryClient();
  const { setIsOpenSheet } = useStore((state) => state);

  const form = useForm<CreateFormInput>({
    resolver: zodResolver(CreateFormSchema),
    defaultValues: {
      autoCall: "true", // mặc định là active
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateFormInput) => {
      console.log(data);
      return createSeverity({
        ...data,
        description: data.description ?? "",
        autoCall: data.autoCall === "true",
        notifyToLevel: Number(data.notifyToLevel),
        ttsTemplate: data.ttsTemplate ?? "",
      });
    },
    onSuccess() {
      setIsOpenSheet(false);
      toast({
        title: t("form.addNewSuccess"),
      });
      queryClient.invalidateQueries({
        queryKey: ["getListSeverity"],
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
    createMutation.mutateAsync(data);
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
          name={"severityLevel"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.severityLevel")}</FormLabel>
              <span className="text-[red]">*</span>
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
          name={"notifyToLevel"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.notifyToLevel")}</FormLabel>
              <span className="text-[red]">*</span>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"autoCall"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.autoCall")}</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue="true"
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("table.autoCall")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">{tGlobal("active")}</SelectItem>
                    <SelectItem value="false">{tGlobal("disabled")}</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"ttsTemplate"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.ttsTemplate")}</FormLabel>
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
