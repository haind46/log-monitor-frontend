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
import { updateUser } from "~/core/api/user";
import { getList } from "~/core/api/department";
import { useStore } from "./store";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Icons } from "~/components/icons";

export default function SheetEdit() {
  const t = useTranslations();
  const STATUS = {
    ACTIVE: "1",
    DISABLED: "0",
  };
  const [showPassword, setShowPassword] = useState(false);

  const { setIsOpenSheet, editUserGroupData } = useStore((state) => state);
  const queryClient = useQueryClient();

  // Lấy danh sách phòng ban từ API
  const {
    data: departments,
    isLoading: isLoadingDepartments,
  } = useQuery({
    queryKey: ["getListDepartment"],
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

  const FormSchema = z.object({
    username: z.string(),
    fullname: z.string().optional().nullable(),
    email: z
      .string()
      .optional()
      .nullable()
      .refine(
        (value) => (value ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) : true),
        {
          message: "Email không hợp lệ",
        }
      ),
    mobilePhone: z.string().optional().nullable(),
    department: z.string().optional().nullable(),
    userNote: z.string().optional().nullable(),
    status: z.string(),
    password: z.string().min(8, "Mật khẩu của bạn quá yếu").optional(),
    confirmPassword: z.string().min(8, "Mật khẩu của bạn quá yếu").optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: editUserGroupData?.username,
      fullname: editUserGroupData?.fullname,
      email: editUserGroupData?.email,
      mobilePhone: editUserGroupData?.mobilePhone,
      department: editUserGroupData?.department?.id,
      status: String(editUserGroupData?.status),
      userNote: editUserGroupData?.userNote ?? "",
    },
  });

  const editUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess() {
      setIsOpenSheet(false);
      toast({
        title: t("users.form.updateSuccess"),
      });
      queryClient.invalidateQueries({
        queryKey: ["getListUser"],
      });
    },
    onError(error: any) {
      toast({
        variant: "destructive",
        title: error?.message || t("form.error") || "Error",
      });
    },
  });

  const onSubmit = form.handleSubmit(
    async (data: z.infer<typeof FormSchema>) => {
      if (!editUserGroupData) return;
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v != null)
      );
      // Ensure all required fields for UpdatedUser are present
      const updatedUser = {
        username: filteredData.username ?? "",
        password: filteredData.password ?? "",
        fullname: filteredData.fullname ?? "",
        userNote: filteredData.userNote ?? "",
        email: filteredData.email ?? "",
        mobilePhone: filteredData.mobilePhone ?? "",
        department: filteredData.department ?? "",
        status: filteredData.status ? Number(filteredData.status) : 0,
        confirmPassword: filteredData.confirmPassword ?? "",
      };
      editUserMutation.mutateAsync({
        id: editUserGroupData.id,
        updatedUser,
      });
    }
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-2">
        <SheetHeader>
          <SheetTitle>
            [{t("global.edit")}] {t("users.form.editUser")}
          </SheetTitle>
          <SheetDescription>
            {t("users.form.editUserDescription")}
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
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"password"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("users.form.password")}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...field}
                    className="pr-10"
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
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...field}
                    className="pr-10"
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
                <Input {...field} value={field.value ?? ""} />
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
                defaultValue={STATUS.ACTIVE}
                value={field.value}
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
                <Input {...field} value={field.value ?? ""}/>
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
                <Input {...field} value={field.value ?? ""}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sửa trường department thành Select lấy từ API */}
        <FormField
          control={form.control}
          name={"department"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("users.form.department")}</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? undefined}
                  disabled={isLoadingDepartments}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("users.form.department")} />
                  </SelectTrigger>
                  <SelectContent>
                    {(departments?.data?.data || []).map((dept: any) => (
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
                <Input {...field} value={field.value ?? ""}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SheetFooter>
          <SheetClose>
            <SubmitButton loading={editUserMutation.isLoading}>
              {t("global.save")}
            </SubmitButton>{" "}
          </SheetClose>
        </SheetFooter>
      </form>
    </Form>
  );
}
