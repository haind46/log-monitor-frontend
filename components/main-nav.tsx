"use client";

import { useTranslations } from "next-intl";
import { Url } from "next/dist/shared/lib/router/router";
import Link from "next-intl/link";
import { ReactNode } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";

export default function NavigationMenuDemo() {
  const t = useTranslations("main-nav");
  return (
    <NavigationMenu className="justify-start">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{t("label")}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-1 p-2 md:w-[200px] lg:w-[400px] lg:grid-cols-[.75fr_1fr]">
              <ListItem href="/users" title={t("users")}>
                {t("manageUser")}
              </ListItem>
              <ListItem href="/roles" title={t("roles")}>
                {t("manageRole")}
              </ListItem>
              <ListItem href="/tasks" title="Tasks">
                Demo Shadcn/ui Data Table
              </ListItem>
              <ListItem href="/tasks" title="Tasks">
                Demo Shadcn/ui Data Table
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

interface ListItemProps {
  title: String;
  href: Url;
  children: ReactNode;
}

function ListItem({ title, children, href }: ListItemProps) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
