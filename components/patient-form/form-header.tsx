"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function FormHeader() {
  const { control } = useFormContext();

  return (
    <Card className="bg-primary/5">
      <CardContent className="pt-6">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">
            Fiche de Collecte de Données – Analgésie Péridurale
          </h2>
          <p className="text-muted-foreground">
            Hôpital de Tivaouane Docteur Serigne DES Modou Faye{" "}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <FormField
              control={control}
              name="investigateur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investigateur *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nom de l'investigateur"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={control}
              name="patientNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>N° Patient *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Numéro d'identification du patient"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
