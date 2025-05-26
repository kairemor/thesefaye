"use client";

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

import { useFormContext } from "react-hook-form";

export function FormStep6() {
  const { control, watch } = useFormContext();
  // Watch for certain field changes
  const modeAccouchement = watch("modeAccouchement");

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FormField
          control={control}
          name="modeAccouchement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mode d'accouchement</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le mode d'accouchement" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Voie basse spontanée">
                    Voie basse spontanée
                  </SelectItem>
                  <SelectItem value="Extraction instrumentale">
                    Extraction instrumentale
                  </SelectItem>
                  <SelectItem value="Césarienne">Césarienne</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {modeAccouchement === "Extraction instrumentale" && (
          <FormField
            control={control}
            name="typeExtraction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type d'extraction (forceps/ventouse)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Préciser le type d'extraction"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {modeAccouchement === "Césarienne" && (
          <FormField
            control={control}
            name="indicationCesarienne"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Indication de césarienne</FormLabel>
                <FormControl>
                  <Input placeholder="Préciser l'indication" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={control}
          name="dureeDeuxiemePhase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Durée de la 2ᵉ phase du travail (minutes) *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Durée en minutes"
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
        <h3 className="text-lg font-medium mb-4">État du nouveau-né</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="etatNouveauNe.apgar1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Score d'Apgar 1ʳᵉ minute *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Score Apgar à 1 minute"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : 0
                      )
                    }
                    min="0"
                    max="10"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="etatNouveauNe.apgar5"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Score d'Apgar 5ᵉ minute *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Score Apgar à 5 minutes"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : 0
                      )
                    }
                    min="0"
                    max="10"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="etatNouveauNe.phCordon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>pH au cordon *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="pH au cordon"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : 0
                      )
                    }
                    step="0.01"
                    min="6.8"
                    max="7.5"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="etatNouveauNe.poids"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Poids (kg) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Poids en kg"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : 0
                      )
                    }
                    step="0.01"
                    min="0.5"
                    max="6"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
