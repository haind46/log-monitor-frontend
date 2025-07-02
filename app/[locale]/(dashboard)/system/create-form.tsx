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
import { createNewSystem } from "~/core/api/system";
import { useQuery } from "@tanstack/react-query";
import { getListUser } from "~/core/api/user";

const CreateFormSchema = z.object({
  code: z.string(),
  name: z.string(),
  level1: z.string().optional(),
  level2: z.string().optional(),
  level3: z.string().optional(),
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

  const {
    data: userList,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["getListUser"],
    queryFn: () =>
      getListUser({
        page: 1,
        size: 100,
        keyword: "",
        status: 1,
        sortKey: "id",
        sortDir: "desc",
      }),
  });

  const createMutation = useMutation({
    mutationFn: createNewSystem,
    onSuccess() {
      setIsOpenSheet(false);

      toast({
        title: t("config.form.addNewSuccess"),
      });
      queryClient.invalidateQueries({
        queryKey: ["getListSystem"],
      });
    },
    onError(error) {
      toast({
        variant: "destructive",
        title: `${t("form.errorTitle")}`,
      });
    },
  });

  const onSubmit = form.handleSubmit(
    async (data: z.infer<typeof CreateFormSchema>) => {
      console.log('submit:',JSON.stringify(data))
      createMutation.mutateAsync({
        code: data.code,
        name: data.name,
        lelvel1User: data.level1 ?? "",
        lelvel2User: data.level2 ?? "",
        lelvel3User: data.level3 ?? "",
      });
    }
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-2">
        <SheetHeader>
          <SheetTitle>
            {" "}
            [{t("global.create")}] {t("system.form.create")}
          </SheetTitle>
          <SheetDescription>
            {t("system.form.createDescription")}
          </SheetDescription>
        </SheetHeader>

        <FormField
          control={form.control}
          name={"code"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("system.table.codeSystem")}</FormLabel>{" "}
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
          name={"name"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("system.table.nameSystem")}</FormLabel>{" "}
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
          name={"level1"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("system.table.level1")}</FormLabel>{" "}
              <span className="text-[red]">*</span>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {userList?.data.data.map((group: any, idx: string) => {
                    return (
                      <SelectItem key={idx} value={group.id.toString()}>
                        {group.username}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"level2"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("system.table.level2")}</FormLabel>{" "}
              <span className="text-[red]">*</span>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {userList?.data.data.map((group: any, idx: string) => {
                    return (
                      <SelectItem key={idx} value={group.id.toString()}>
                        {group.username}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"level3"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("system.table.level3")}</FormLabel>{" "}
              <span className="text-[red]">*</span>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {userList?.data.data.map((group: any, idx: string) => {
                    return (
                      <SelectItem key={idx} value={group.id.toString()}>
                        {group.username}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
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
