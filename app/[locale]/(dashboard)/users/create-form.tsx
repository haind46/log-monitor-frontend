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
import { useStore } from "~/app/[locale]/(dashboard)/users/store";
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
import { createNewUser } from "~/core/api/user";
import { getList } from "~/core/api/department";

import { useState, useEffect } from "react";
import { Icons } from "~/components/icons";
import { useQuery } from "@tanstack/react-query";

const CreateFormSchema = z
  .object({
    username: z.string(),
    fullname: z.string().optional(),
    email: z.string().email().optional(),
    mobilePhone: z.string().optional(),
    department: z.string().optional(),
    userNote: z.string().optional(),
    status: z.number().default(1),
    password: z.string().min(8, "Mật khẩu của bạn quá yếu"),
    confirmPassword: z.string().min(8, "Mật khẩu của bạn quá yếu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type CreateFormInput = z.infer<typeof CreateFormSchema>;

export default function FormCreateUser() {
  const t = useTranslations();
  const STATUS = {
    ACTIVE: "1",
    DISABLED: "0",
  };
  const queryClient = useQueryClient();
  const { setIsOpenSheet } = useStore((state) => state);

  const form = useForm<z.infer<typeof CreateFormSchema>>({
    resolver: zodResolver(CreateFormSchema),
  });

  const { register, handleSubmit, formState } = useForm<CreateFormInput>({
    resolver: zodResolver(CreateFormSchema),
    defaultValues: {
      status: 1,
    },
  });

  const createUserMutation = useMutation({
    mutationFn: createNewUser,
    onSuccess() {
      setIsOpenSheet(false);

      toast({
        title: t("users.form.addNewSuccess"),
      });
      queryClient.invalidateQueries({
        queryKey: ["getListUser"],
      });
    },
    onError(error) {
      toast({
        variant: "destructive",
        title: `${t("form.errorTitle")}`,
      });
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const {
    data: departments,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["getList"],
    queryFn: () =>
      getList({
        page: 1,
        size: 100,
        keyword: "",
        status: 1,
        sortKey: "id",
        sortDir: "desc",
      }),
  });

  const onSubmit = form.handleSubmit(
    async (data: z.infer<typeof CreateFormSchema>) => {
      createUserMutation.mutateAsync({
        ...data,
        fullname: data.fullname ?? "",
        email: data.email ?? "",
        mobilePhone: data.mobilePhone ?? "",
        department: data.department ?? "",
        userNote: data.userNote ?? "",
      });
    }
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-2">
        <SheetHeader>
          <SheetTitle>
            {" "}
            [{t("global.create")}] {t("users.form.createUser")}
          </SheetTitle>
          <SheetDescription>
            {t("users.form.createUserDescription")}
          </SheetDescription>
        </SheetHeader>

        <FormField
          control={form.control}
          name={"username"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("users.form.username")}</FormLabel>{" "}
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
          name={"password"}
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>{t("users.form.password")}</FormLabel>{" "}
              <span className="text-[red]">*</span>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...field}
                    className="pr-10" // Để chừa khoảng trống cho icon
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Icons.eye height={20} width={20} />
                    ) : (
                      <Icons.eyeOff height={20} width={20} />
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"confirmPassword"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("users.form.confirmPassword")}</FormLabel>{" "}
              <span className="text-[red]">*</span>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...field}
                    className="pr-10" // Để chừa khoảng trống cho icon
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Icons.eye height={20} width={20} />
                    ) : (
                      <Icons.eyeOff height={20} width={20} />
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"fullname"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("users.form.fullname")}</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>{t("users.form.status")}</FormLabel>{" "}
              <span className="text-[red]">*</span>
              <Select
                onValueChange={field.onChange}
                defaultValue={String(STATUS["ACTIVE"])}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(STATUS).map(([key, value]) => (
                    <SelectItem key={key} value={value}>
                      {key === "ACTIVE"
                        ? t("global.active")
                        : t("global.disabled")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"email"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("users.form.email")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"mobilePhone"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("users.form.phone")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"department"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("users.form.department")}</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(departments?.data.data || []).map((dept: any) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"userNote"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("users.form.note")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <SubmitButton
            disabled={createUserMutation.isLoading}
            loading={createUserMutation.isLoading}
          >
            {t("users.form.saveChange")}
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
