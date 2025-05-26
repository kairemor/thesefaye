"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

export function FormStep4() {
  const { control, watch } = useFormContext();
  const declenchementTravail = watch("declenchementTravail");

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FormField
          control={control}
          name="declenchementTravail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Déclenchement du travail</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type de déclenchement" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Spontané">Spontané</SelectItem>
                  <SelectItem value="Médical">Médical</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {declenchementTravail === "Médical" && (
          <FormField
            control={control}
            name="methodesDeclenchement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Méthode de déclenchement</FormLabel>
                <FormControl>
                  <Input placeholder="Préciser la méthode" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Durée du travail</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="dureeTravail.phaseLatente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phase latente (heures) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Durée en heures"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : 0
                      )
                    }
                    step="0.5"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="dureeTravail.phaseActive"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phase active (heures) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Durée en heures"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : 0
                      )
                    }
                    step="0.5"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={control}
        name="scoreBishop"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Score de Bishop à l'admission *</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Score de Bishop"
                {...field}
                onChange={(e) =>
                  field.onChange(e.target.value ? parseInt(e.target.value) : 0)
                }
                required
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <h3 className="text-lg font-medium mb-4">Monitoring fœtal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="monitoringFoetal.rcfInitial"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RCF initial (bpm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Fréquence cardiaque fœtale"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : 0
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="monitoringFoetal.rassurant"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">RCF Rassurant</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
