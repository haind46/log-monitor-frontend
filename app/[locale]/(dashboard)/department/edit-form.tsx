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
import { updateDepartment } from "~/core/api/department";
import { useStore } from "./store";
import { useTranslations } from "next-intl";

const SheetEdit = () => {
  const t = useTranslations();

  const { setIsOpenSheet, editSystemData: configData } = useStore(
    (state) => state
  );
  const queryClient = useQueryClient();

 
  const FormSchema = z.object({
    name: z.string(),
    deptCode: z.string().optional(),
    desc: z.string().optional().nullable()
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: configData?.name,
      deptCode: configData?.deptCode,
      desc: configData?.desc
    },
  });

  const editMutation = useMutation({
    mutationFn: updateDepartment,
    onSuccess() {
      setIsOpenSheet(false);
      toast({
        title: t("department.form.updateSuccess"),
      });
      queryClient.invalidateQueries({
        queryKey: ["getListDepartment"],
      });
    },
    onError(error) {
      toast({
        variant: "destructive",
        title: `${t("form.errorTitle")}`
      });
    },
  });

  const onSubmit = form.handleSubmit(
    async (data: z.infer<typeof FormSchema>) => {
      if (!configData) return;
      // Ensure all required Department fields are present
      const updatedDepartment = {
        name: data.name ?? "",
        deptCode: data.deptCode ?? "",
        desc: data.desc ?? "",
      };
      editMutation.mutateAsync({
        id: configData.id,
        updatedDepartment,
      });
    }
  );

  return (
    <Form {...form}>
    <form onSubmit={onSubmit} className="space-y-2">
      <SheetHeader>
        <SheetTitle>
          {" "}
          [{t("global.create")}] {t("department.form.create")}
        </SheetTitle>
        <SheetDescription>
          {t("department.form.createDescription")}
        </SheetDescription>
      </SheetHeader>

      <FormField
        control={form.control}
        name={"name"}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("department.table.name")}</FormLabel>{" "}
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
        name={"deptCode"}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("department.table.deptCode")}</FormLabel>{" "}
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
        name={"desc"}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("department.table.description")}</FormLabel>{" "}
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
