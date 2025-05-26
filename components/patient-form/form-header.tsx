"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getTodayDate } from "@/lib/utils";

export function FormHeader() {
  const { control, register } = useFormContext();

  return (
    <Card className="bg-primary/5">
      <CardContent className="pt-6">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">
            Fiche de Collecte de Données – Analgésie Péridurale
          </h2>
          <p className="text-muted-foreground">Hôpital de Tivaouane</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="investigateur">Investigateur</Label>
            <Input
              id="investigateur"
              {...register("investigateur")}
              placeholder="Nom de l'investigateur"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              {...register("date")}
              defaultValue={getTodayDate()}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="patientNo">N° Patient</Label>
            <Input
              id="patientNo"
              {...register("patientNo")}
              placeholder="Numéro d'identification"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
