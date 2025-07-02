import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { updateConfig } from "~/core/api/waring-config";
import { useStore } from "./store";
import { useTranslations } from "next-intl";

const SheetEdit = () => {
  const t = useTranslations();

  const { setIsOpenSheet, editSystemData: configData } = useStore(
    (state) => state
  );
  const queryClient = useQueryClient();

 
  const FormSchema = z.object({
    keyName: z.string(),
    value: z.string().optional(),
    description: z.string().optional().nullable()
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      keyName: configData?.keyName,
      value: configData?.value,
      description: configData?.description
    },
  });

  const editMutation = useMutation({
    mutationFn: updateConfig,
    onSuccess() {
      setIsOpenSheet(false);
      toast({
        title: t("config.form.updateSuccess"),
      });
      queryClient.invalidateQueries({
        queryKey: ["getListConfig"],
      });
    },
    onError(error) {
      toast({
        variant: "destructive",
        title: `${t("form.errorTitle")}`,
        description: error instanceof Error ? error.message : String(error),
      });
    },
  });

  const onSubmit = form.handleSubmit(
    async (data: z.infer<typeof FormSchema>) => {
      if (!configData) return;
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v != null)
      );
      // Ensure all required fields are present for Config type
      const updatedConfig = {
        keyName: filteredData.keyName ?? "",
        value: filteredData.value ?? "",
        description: filteredData.description ?? "",
      };
      editMutation.mutateAsync({
        id: configData.id,
        updatedConfig,
      });
    }
  );

  return (
    <Form {...form}>
    <form onSubmit={onSubmit} className="space-y-2">
      <SheetHeader>
        <SheetTitle>
          {" "}
          [{t("global.create")}] {t("config.form.create")}
        </SheetTitle>
        <SheetDescription>
          {t("system.form.createDescription")}
        </SheetDescription>
      </SheetHeader>

      <FormField
        control={form.control}
        name={"keyName"}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("config.table.keyName")}</FormLabel>{" "}
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
        name={"value"}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("config.table.value")}</FormLabel>{" "}
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
            <FormLabel>{t("config.table.description")}</FormLabel>{" "}
            <span className="text-[red]">*</span>
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
          {t("global.saveChange")}
        </SubmitButton>
      </div>
    </form>
  </Form>
  );
};

export default SheetEdit;
