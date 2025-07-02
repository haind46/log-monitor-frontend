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
import { createDepartment } from "~/core/api/department";
import { useQuery } from "@tanstack/react-query";

const CreateFormSchema = z.object({
  name: z.string(),
  deptCode: z.string(),
  desc: z.string().optional(),
});

type CreateFormInput = z.infer<typeof CreateFormSchema>;

export default function FormCreateSystem() {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const { setIsOpenSheet } = useStore((state) => state);

  const form = useForm<z.infer<typeof CreateFormSchema>>({
    resolver: zodResolver(CreateFormSchema),
  });

  const { register, handleSubmit, formState } = useForm<CreateFormInput>({
    resolver: zodResolver(CreateFormSchema),
  });

  const createMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess() {
      setIsOpenSheet(false);

      toast({
        title: t("department.form.addNewSuccess"),
      });
      queryClient.invalidateQueries({
        queryKey: ["getListDepartment"],
      });
    },
    onError() {
      toast({
        variant: "destructive",
        title: `${t("form.errorTitle")}`
      });
    },
  });

  const onSubmit = form.handleSubmit(
    async (data: z.infer<typeof CreateFormSchema>) => {
      createMutation.mutateAsync({
        ...data,
        desc: data.desc || ""
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
                <Input {...field} />
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
              <FormLabel>{t("department.table.code")}</FormLabel>{" "}
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
          name={"desc"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("department.table.description")}</FormLabel>{" "}
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
            {t("global.saveChange")}
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
