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
import { createConfig } from "~/core/api/waring-config";
import { useQuery } from "@tanstack/react-query";

const CreateFormSchema = z.object({
  keyName: z.string(),
  value: z.string(),
  description: z.string().optional(),
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
    mutationFn: createConfig,
    onSuccess() {
      setIsOpenSheet(false);

      toast({
        title: t("config.form.addNewSuccess"),
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
    async (data: z.infer<typeof CreateFormSchema>) => {
      createMutation.mutateAsync({
        ...data,
        description: data.description ?? "",
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
                <Input {...field} />
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
