"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/lib/hooks/use-is-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

export function NavigationMenuDemo() {
  const isMobile = useIsMobile();
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:4000/auth/me", {
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      
      setUser(data);
    } catch {
      setUser(null);
    }
  };
  const logout = async () => {
    try {
      await fetch("http://localhost:4000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    fetchUser(); // استدعاء مرة وحدة عند mount فقط
  }, [pathname]);
  return (
    <NavigationMenu viewport={isMobile} className={"mb-7"}>
      <NavigationMenuList className="flex-wrap gap-4">
        <NavigationMenuItem>
          <NavigationMenuTrigger>Home</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-100 lg:w-125 lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6"
                    href="/"
                  >
                    <div className="mb-2 text-lg font-medium sm:mt-4">
                      Created By Me
                    </div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      A Full Stack Movie Watchlist Application
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>

              <ListItem href="/" title="Home">
                This a Website where you can find movies of your interest.
              </ListItem>

              <ListItem href="/watchlist" title="Watchlist">
                You can add movies to your watchlist by registering an account.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Movies</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-100 lg:w-125 lg:grid-cols-[.75fr_1fr]">
              <ListItem href="/movies" title="All Movies">
                You can browse all movies in here.
              </ListItem>

              <ListItem href="/movies" title="Popular Movies">
                Most watched movies by days.
              </ListItem>

              <ListItem href="/movies" title="Top Rated Movies">
                Top rated movies in all time.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className={navigationMenuTriggerStyle()}>
          <Link href="/aboutus">About Us</Link>
        </NavigationMenuItem>
        {!user ? (
          <>
            <NavigationMenuItem>
              <Link href="/login">
                <Button variant="login">Login</Button>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem className="hidden md:block">
              <Link href="/register">
                <Button variant="login">Register</Button>
              </Link>
            </NavigationMenuItem>
          </>
        ) : (
          <NavigationMenuItem>
            <button onClick={logout}>Logout</button>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({ title, children, href, ...props }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
