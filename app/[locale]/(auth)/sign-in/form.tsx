"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next-intl/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SubmitButton } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { toast } from "~/components/ui/use-toast";
import LocaleSwitcher from "~/components/locale-switcher";
import { Checkbox } from "~/components/ui/checkbox";
import ModeToggle from "~/components/mode-toggle";

const schema = z.object({
  email: z.string(),
  password: z.string(),
});

type FormData = z.infer<typeof schema>;


export default function SignInLdapForm() {
  const router = useRouter();
  const t = useTranslations();
  const { register, formState, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    async defaultValues(payload) {
      const email = localStorage.getItem("email");
      const password = localStorage.getItem("password");
      return {
        email: email ? email : "",
        password: password ? password : "",
      };
    },
  });

  const [loading, setLoading] = useState(false);
  const defaultRemember =
    typeof window !== "undefined" &&
    window.localStorage.getItem("remember-password") === "true";

  // const defaultRemember = window.localStorage.getItem("remember-password") === "true"

  async function submit(data: FormData) {
    setLoading(true);
    signIn("emailpass", {
      email: data.email,
      password: data.password,
      redirect: false,
    })
      .then((result) => {
        if (result?.error) {
          return toast({
            title: `${t("sign-in.warning")}`,
            variant: "destructive",
          });
        }

        const remember =
          typeof window !== "undefined" &&
          window.localStorage.getItem("remember-password") === "true";

        if (remember) {
          localStorage.setItem("email", data.email);
          localStorage.setItem("password", data.password);
        }

        return router.push("/users");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function onRememberPasswordChange(remember: boolean) {
    if (remember) {
      localStorage.setItem("remember-password", "true");
      return;
    }

    localStorage.removeItem("remember-passsword");
    localStorage.removeItem("email");
    localStorage.removeItem("passsword");
  }

  return (
    <div className="w-full">
      <nav className="py-5 px-12 h-1/4">
        <div className="flex justify-between items-center mx-auto sm:px-12 py-2 px-12 lg:px-12 max-w-screen-xl">
          <a href="https://flowbite.com" className="flex items-center">
            <img src="/images/mobifone.svg" className="h-6" alt="Logo" />
          </a>
          <div className="flex items-center lg:order-2">
            <a
              href="#"
              className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
            >
              {t("sign-in.aboutUs")}
            </a>
            <LocaleSwitcher />
            <ModeToggle />
          </div>
        </div>
      </nav>
      <div className="grid md:grid-cols-2 ">
        {/* ---------------------------------- form Login ---------------------------------- */}
        <div className="flex min-h-full flex-1 flex-col justify-center py-1 sm:px-12 lg:px-12 ">
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px] ">
            <div className="bg-white px-12 py-5 shadow sm:rounded-lg sm:px-12">
              <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className= {`mb-4 text-center text-4xl font-bold leading-9 tracking-tight bg-gradient-to-r from-red-500 via-blue-500 to-green-500 text-transparent bg-clip-text `}>
                  {t("global.name-system")}
                </h2>

                <h2 className="mb-4 text-center text-2xl font-semibold leading-9 tracking-tight bg-gradient-to-r from-red-500 via-blue-500 to-green-500 text-transparent bg-clip-text ">
                  {t("sign-in.sign-in")}
                </h2>
              </div>
              <form
                className="space-y-6"
                action="#"
                method="POST"
                onSubmit={handleSubmit(submit)}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm leading-6 text-gray-900"
                  >
                    {t("users.form.email")}
                  </label>
                  <div className="mt-2">
                    <Input
                      {...register("email")}
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      placeholder="name@example.com"
                    />
                    {formState.errors.email && (
                      <p className="px-1 text-xs text-red-600">
                        {formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm leading-6 text-gray-900"
                  >
                    {t("users.form.password")}
                  </label>
                  <div className="mt-2">
                    <Input
                      {...register("password")}
                      id="password"
                      type="password"
                      placeholder="password"
                    />
                
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      defaultChecked={defaultRemember}
                      onCheckedChange={onRememberPasswordChange}
                      id="rememberPassword"
                      className="text-sm boder border-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    />
                    <label className="text-sm block leading-6 text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {t("sign-in.rememberPassword")}
                    </label>
                  </div>
                  <div className="text-sm leading-6">
                    <a
                      href="#"
                      className="font-semibold text-gray-500 hover:text-gray-400"
                    >
                      {t("sign-in.forgotPassword")}
                    </a>
                  </div>
                </div>
                <SubmitButton
                  loading={loading}
                  disabled={loading}
                  className="flex w-full justify-center rounded-md bg-gradient-to-r from-red-500 via-blue-500 to-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-lg transform transition-transform duration-150 ease-in-out hover:translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                >
                  {t("sign-in.sign-in")}
                </SubmitButton>
              </form>
              <div>
             
          
                <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                  <div>{t("sign-in.notAccount")}</div>
                  <div>
                    <Link
                      className="underline cursor-pointer text-center text-sm leading-6 text-sky-600 font-bold bg-backgound hover:bg-backgound"
                      href="/register"
                    >
                      {t("sign-in.register")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className=" md:block bg-cover bg-center"
          style={{ backgroundImage: "url('/images/backgound-ai.png')" }}
        />
      </div>
    </div>
  );
}
