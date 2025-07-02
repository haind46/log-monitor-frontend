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
  SheetFooter,
  SheetClose,
} from "~/components/ui/sheet";
import { toast } from "~/components/ui/use-toast";
import { updateSystem } from "~/core/api/system";
import { useStore } from "./store";
import { useTranslations } from "next-intl";
import { getListUser } from "~/core/api/user";

const SheetEdit = () => {
  const t = useTranslations();

  const { setIsOpenSheet, editSystemData: editSystemData } = useStore(
    (state) => state
  );
  const queryClient = useQueryClient();

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
  console.log("data", JSON.stringify(editSystemData));
  const FormSchema = z.object({
    name: z.string(),
    code: z.string().optional(),
    level1: z.string().optional().nullable(),
    level2: z.string().optional().nullable(),
    level3: z.string().optional().nullable(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: editSystemData?.code,
      name: editSystemData?.name,
      level1: editSystemData?.level1,
      level2: editSystemData?.level2,
      level3: editSystemData?.level3,
    },
  });

  const editMutation = useMutation({
    mutationFn: updateSystem,
    onSuccess() {
      setIsOpenSheet(false);
      toast({
        title: t("system.form.updateSuccess"),
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
    async (data: z.infer<typeof FormSchema>) => {
      if (!editSystemData) return;
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v != null)
      );
      // Map form fields to match CreatedSystem type
      const updatedSystem = {
        code: filteredData.code ?? "",
        name: filteredData.name ?? "",
        lelvel1User: filteredData.level1 ?? "",
        lelvel2User: filteredData.level2 ?? "",
        lelvel3User: filteredData.level3 ?? "",
      };
      editMutation.mutateAsync({
        id: editSystemData.id,
        updatedSystem,
      });
    }
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-2">
        <SheetHeader>
          <SheetTitle>
            [{t("global.edit")}] {t("system.form.edit")}
          </SheetTitle>
          <SheetDescription>
            {t("system.form.editDescription")}
          </SheetDescription>
        </SheetHeader>

        <FormField
          control={form.control}
          name={"code"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("system.table.codeSystem")}</FormLabel>{" "}
              <FormControl>
                <Input {...field} disabled />
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
              <Select
                onValueChange={field.onChange}
                value={field.value?.toString()}
              >
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
              <Select
                onValueChange={field.onChange}
                value={field.value?.toString()}
              >
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
              <Select
                onValueChange={field.onChange}
                value={field.value?.toString()}
              >
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
        <SheetFooter>
          <SheetClose>
            <SubmitButton
              disabled={editMutation.isLoading}
              loading={editMutation.isLoading}
            >
              {t("global.saveChange")}
            </SubmitButton>
          </SheetClose>
        </SheetFooter>
      </form>
    </Form>
  );
};

export default SheetEdit;
