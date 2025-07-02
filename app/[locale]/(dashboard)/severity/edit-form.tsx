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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "~/components/ui/sheet";
import { toast } from "~/components/ui/use-toast";
import { updatedSeverity } from "~/core/api/severity";
import { useStore } from "./store";
import { useTranslations } from "next-intl";

const SheetEdit = () => {
  const t = useTranslations("severity");
  const tGlobal = useTranslations("global");

  const { setIsOpenSheet, editSystemData: configData } = useStore(
    (state) => state
  );
  const queryClient = useQueryClient();

  const FormSchema = z.object({
    severityLevel: z.string().min(1),
    description: z.string().optional().nullable(),
    notifyToLevel: z.coerce.number().min(0),
    autoCall: z.enum(["true", "false"]).optional(),
    ttsTemplate: z.string().optional().nullable(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      severityLevel: configData?.severityLevel || "",
      description: configData?.description || "",
      notifyToLevel: configData?.notifyToLevel ?? 0,
      autoCall: configData?.autoCall === true ? "true" : "false",
      ttsTemplate: configData?.ttsTemplate || "",
    },
  });

  const editMutation = useMutation({
    mutationFn: async (data: z.infer<typeof FormSchema>) => {
      if (!configData?.id) {
        throw new Error("Severity ID is missing");
      }
      return updatedSeverity({
        id: configData.id,
        updatedSeverity: {
          ...data,
          autoCall: data.autoCall === "true",
          notifyToLevel: Number(data.notifyToLevel),
          description: data.description ?? "",
          ttsTemplate: data.ttsTemplate ?? "",
        },
      });
    },
    onSuccess() {
      setIsOpenSheet(false);
      toast({
        title: t("form.updateSuccess"),
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

  const onSubmit = form.handleSubmit(
    async (data: z.infer<typeof FormSchema>) => {
      if (!configData) return;
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v != null)
      );
      editMutation.mutateAsync(filteredData as any);
    }
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-2">
        <SheetHeader>
          <SheetTitle>
            [{tGlobal("edit")}] {t("form.edit")}
          </SheetTitle>
          <SheetDescription>
            {t("form.editDescription")}
          </SheetDescription>
        </SheetHeader>

        <FormField
          control={form.control}
          name={"severityLevel"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("table.severityLevel")}</FormLabel>
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
                <Input {...field} value={field.value ?? ""}/>
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
                <Input {...field} value={field.value ?? ""}/>
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
};

export default SheetEdit;
