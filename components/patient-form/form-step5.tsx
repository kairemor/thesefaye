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

export function FormStep5() {
  const { control, watch } = useFormContext();
  const autresDifficultes = watch("difficultesTechniques.autres");
  const autresEffets = watch("effetsSecondaires.autres");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="demandeAnalgesie"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Demande d'analgésie</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner l'origine" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Patient">Patient</SelectItem>
                  <SelectItem value="Équipe médicale">
                    Équipe médicale
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="delaiDemandePose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Délai demande–pose (minutes) *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Délai en minutes"
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
          name="heurePose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Heure de pose (h) *</FormLabel>
              <FormControl>
                <Input type="time" {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="niveauBlocageSensitif"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Niveau de blocage sensitif (dermatome)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: T10, L1..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Produits utilisés</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="produitsUtilises.anesthesiqueLocal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Anesthésique local *</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Bupivacaïne" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="produitsUtilises.doseAnesthesique"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dose (mg) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Dose en mg"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : 0
                      )
                    }
                    step="0.1"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="produitsUtilises.adjuvant"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adjuvant *</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Sufentanil" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="produitsUtilises.doseAdjuvant"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dose (µg) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Dose en µg"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : 0
                      )
                    }
                    step="0.1"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Difficultés techniques</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="difficultesTechniques.echecPonction"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Échec de ponction</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="difficultesTechniques.ponctionDureMerienne"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Ponction dure-mérienne
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="difficultesTechniques.autres"
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

        {autresDifficultes && (
          <FormField
            control={control}
            name="difficultesTechniques.autresDetails"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Préciser les autres difficultés</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Autres difficultés techniques"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Effets secondaires</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="effetsSecondaires.hypotension"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Hypotension (TA {"<"} 90 mmHg)
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="effetsSecondaires.prurit"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Prurit</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="effetsSecondaires.nauseesVomissements"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Nausées/Vomissements
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="effetsSecondaires.retentionUrinaire"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Rétention urinaire
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="effetsSecondaires.autres"
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

        {autresEffets && (
          <FormField
            control={control}
            name="effetsSecondaires.autresDetails"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Préciser les autres effets secondaires</FormLabel>
                <FormControl>
                  <Input placeholder="Autres effets secondaires" {...field} />
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
