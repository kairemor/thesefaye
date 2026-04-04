"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, UserPlus, Users, LayoutDashboard } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="flex-1 flex justify-center sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16">
        <div className="flex items-center gap-2 font-bold">
          <Heart className="h-5 w-5 text-red-500" />
          <Link href="/" className="text-primary hover:opacity-80 transition-opacity">
            <span className="hidden md:block">Analgésie Péridurale</span>
            <span className="md:hidden">AP</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link href="/">
              <Button
                variant={pathname === "/" ? "default" : "ghost"}
                size="sm"
                className="gap-1.5"
                aria-current={pathname === "/" ? "page" : undefined}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Tableau de Bord</span>
              </Button>
            </Link>
            <Link href="/patients/new">
              <Button
                variant={pathname === "/patients/new" ? "default" : "ghost"}
                size="sm"
                className="gap-1.5"
                aria-current={pathname === "/patients/new" ? "page" : undefined}
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Ajouter</span>
              </Button>
            </Link>
            <Link href="/patients">
              <Button
                variant={pathname === "/patients" ? "default" : "ghost"}
                size="sm"
                className="gap-1.5"
                aria-current={pathname === "/patients" ? "page" : undefined}
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Liste</span>
              </Button>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
