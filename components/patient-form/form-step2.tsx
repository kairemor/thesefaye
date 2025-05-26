"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function FormStep2() {
  const { control, watch } = useFormContext();
  const autresMedicaux = watch("antecedentsMedicaux.autres");
  const allergies = watch("allergies");

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Antécédents médicaux</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="antecedentsMedicaux.hypertension"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Hypertension</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="antecedentsMedicaux.diabete"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Diabète</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="antecedentsMedicaux.asthme"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Asthme</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="antecedentsMedicaux.autres"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Autres</FormLabel>
              </FormItem>
            )}
          />
        </div>

        {autresMedicaux && (
          <FormField
            control={control}
            name="antecedentsMedicaux.autresDetails"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Préciser les autres antécédents</FormLabel>
                <FormControl>
                  <Input placeholder="Autres antécédents médicaux" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Antécédents obstétricaux</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <FormField
            control={control}
            name="antecedentsObstetricaux.parite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parité (Nombre d'accouchements) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Parité"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : 0
                      )
                    }
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="antecedentsObstetricaux.gestite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gestité (Nombre de grossesses) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Gestité"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : 0
                      )
                    }
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="antecedentsObstetricaux.prematurite"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Prématurité</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="antecedentsObstetricaux.mortFoetale"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Mort fœtale in utero
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="antecedentsObstetricaux.cesarienneAnterieure"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Césarienne antérieure
                </FormLabel>
              </FormItem>
            )}
          />
        </div>
      </div>

      <div>
        <FormField
          control={control}
          name="allergies"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Allergies</FormLabel>
              </div>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {allergies && (
          <FormField
            control={control}
            name="allergiesAgent"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Agent allergène</FormLabel>
                <FormControl>
                  <Input placeholder="Préciser l'agent" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
}
