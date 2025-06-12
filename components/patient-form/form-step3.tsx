"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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

export function FormStep3() {
  const { control, watch } = useFormContext();
  const anemie = watch("pathologiesAssociees.anemie");
  const autres = watch("pathologiesAssociees.autres");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={control}
          name="ageGestationnel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Âge gestationnel (SA) *</FormLabel>
              <FormControl>
                <Input
                  // type="number"
                  placeholder="Semaines d'aménorrhée"
                  {...field}
                  // onChange={(e) =>
                  //   field.onChange(
                  //     e.target.value ? parseInt(e.target.value) : 0
                  //   )
                  // }
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="suiviPrenatal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Suivi prénatal *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                required
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type de suivi" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Régulier">Régulier</SelectItem>
                  <SelectItem value="Irrégulier">Irrégulier</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="nombreConsultations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de consultations *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Nombre de consultations"
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

      <div>
        <h3 className="text-lg font-medium mb-4">Pathologies associées</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="pathologiesAssociees.preEclampsie"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Pré-éclampsie</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="pathologiesAssociees.diabeteGestationnel"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Diabète gestationnel
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="pathologiesAssociees.anemie"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Anémie</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="pathologiesAssociees.autres"
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

        {anemie && (
          <FormField
            control={control}
            name="pathologiesAssociees.hemoglobine"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Hémoglobine (g/dL)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Taux d'hémoglobine"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : 0
                      )
                    }
                    step="0.1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {autres && (
          <FormField
            control={control}
            name="pathologiesAssociees.autresDetails"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Préciser les autres pathologies</FormLabel>
                <FormControl>
                  <Input placeholder="Autres pathologies" {...field} />
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
