"use client";

import { useEffect } from "react";
import { StepProps } from "@/lib/types";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Create schema for validation
const formSchema = z.object({
  demandeAnalgesie: z.string(),
  delaiDemandePose: z.number().min(0, "Le délai doit être un nombre positif"),
  heurePose: z.string().min(1, "L'heure de pose est requise"),
  produitsUtilises: z.object({
    anesthesiqueLocal: z.string().min(1, "L'anesthésique local est requis"),
    doseAnesthesique: z.number().min(0, "La dose doit être un nombre positif"),
    adjuvant: z.string().min(1, "L'adjuvant est requis"),
    doseAdjuvant: z.number().min(0, "La dose doit être un nombre positif"),
  }),
  difficultesTechniques: z.object({
    echecPonction: z.boolean(),
    ponctionDureMerienne: z.boolean(),
    autres: z.boolean(),
    autresDetails: z.string().optional(),
  }),
  niveauBlocageSensitif: z.string(),
  effetsSecondaires: z.object({
    hypotension: z.boolean(),
    prurit: z.boolean(),
    nauseesVomissements: z.boolean(),
    retentionUrinaire: z.boolean(),
    autres: z.boolean(),
    autresDetails: z.string().optional(),
  }),
});

export function FormStep5({ data, updateFields }: StepProps) {
  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      demandeAnalgesie: data.demandeAnalgesie || "",
      delaiDemandePose: data.delaiDemandePose || 0,
      heurePose: data.heurePose || "",
      produitsUtilises: {
        anesthesiqueLocal: data.produitsUtilises?.anesthesiqueLocal || "",
        doseAnesthesique: data.produitsUtilises?.doseAnesthesique || 0,
        adjuvant: data.produitsUtilises?.adjuvant || "",
        doseAdjuvant: data.produitsUtilises?.doseAdjuvant || 0,
      },
      difficultesTechniques: {
        echecPonction: data.difficultesTechniques?.echecPonction || false,
        ponctionDureMerienne:
          data.difficultesTechniques?.ponctionDureMerienne || false,
        autres: data.difficultesTechniques?.autres || false,
        autresDetails: data.difficultesTechniques?.autresDetails || "",
      },
      niveauBlocageSensitif: data.niveauBlocageSensitif || "",
      effetsSecondaires: {
        hypotension: data.effetsSecondaires?.hypotension || false,
        prurit: data.effetsSecondaires?.prurit || false,
        nauseesVomissements:
          data.effetsSecondaires?.nauseesVomissements || false,
        retentionUrinaire: data.effetsSecondaires?.retentionUrinaire || false,
        autres: data.effetsSecondaires?.autres || false,
        autresDetails: data.effetsSecondaires?.autresDetails || "",
      },
    },
  });

  // Watch for certain field changes
  const autresDifficultes = form.watch("difficultesTechniques.autres");
  const autresEffets = form.watch("effetsSecondaires.autres");

  // Submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    updateFields({
      demandeAnalgesie: values.demandeAnalgesie as any,
      delaiDemandePose: values.delaiDemandePose,
      heurePose: values.heurePose,
      produitsUtilises: values.produitsUtilises,
      difficultesTechniques: values.difficultesTechniques,
      niveauBlocageSensitif: values.niveauBlocageSensitif,
      effetsSecondaires: values.effetsSecondaires,
    });
  }

  // Update parent component on form change
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (
        value.produitsUtilises &&
        value.difficultesTechniques &&
        value.effetsSecondaires
      ) {
        updateFields({
          demandeAnalgesie: value.demandeAnalgesie as any,
          delaiDemandePose: Number(value.delaiDemandePose) || 0,
          heurePose: value.heurePose || "",
          produitsUtilises: {
            anesthesiqueLocal: value.produitsUtilises.anesthesiqueLocal || "",
            doseAnesthesique:
              Number(value.produitsUtilises.doseAnesthesique) || 0,
            adjuvant: value.produitsUtilises.adjuvant || "",
            doseAdjuvant: Number(value.produitsUtilises.doseAdjuvant) || 0,
          },
          difficultesTechniques: {
            echecPonction: value.difficultesTechniques.echecPonction || false,
            ponctionDureMerienne:
              value.difficultesTechniques.ponctionDureMerienne || false,
            autres: value.difficultesTechniques.autres || false,
            autresDetails: value.difficultesTechniques.autresDetails,
          },
          niveauBlocageSensitif: value.niveauBlocageSensitif || "",
          effetsSecondaires: {
            hypotension: value.effetsSecondaires.hypotension || false,
            prurit: value.effetsSecondaires.prurit || false,
            nauseesVomissements:
              value.effetsSecondaires.nauseesVomissements || false,
            retentionUrinaire:
              value.effetsSecondaires.retentionUrinaire || false,
            autres: value.effetsSecondaires.autres || false,
            autresDetails: value.effetsSecondaires.autresDetails,
          },
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, updateFields]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="demandeAnalgesie"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Demande d'analgésie</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
              name="difficultesTechniques.echecPonction"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Échec de ponction
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
      </form>
    </Form>
  );
}
