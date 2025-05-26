import Link from "next/link";
import { Heart } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="flex-1 flex justify-center sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16">
        <div className="flex items-center gap-2 font-bold">
          <Heart className="h-6 w-6 text-red-500" />
          <Link href="/" className="hidden md:block">
            Analgésie Péridurale
          </Link>
          <Link href="/" className="md:hidden">
            AP
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link href="/patients/new">
              <Button variant="default">Ajouter</Button>
            </Link>
            <Link href="/patients">
              <Button variant="outline">Liste</Button>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
