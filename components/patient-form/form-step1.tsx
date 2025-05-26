"use client";

import { useState, useEffect } from "react";
import { StepProps } from "@/lib/types";
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
  Form,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Create schema for validation
const formSchema = z.object({
  age: z
    .number()
    .min(12, "L'âge doit être d'au moins 12 ans")
    .max(50, "L'âge doit être au maximum de 50 ans"),
  profession: z.string().min(1, "La profession est requise"),
  niveauEducation: z.string().optional(),
  situationMatrimoniale: z.string().optional(),
  origine: z.string().min(1, "L'origine géographique est requise"),
  couvertureMedicale: z.boolean(),
  typeCouverture: z.string().optional(),
});

export function FormStep1({ data, updateFields }: StepProps) {
  const [showCouverture, setShowCouverture] = useState(data.couvertureMedicale);

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: data.age || 0,
      profession: data.profession || "",
      niveauEducation: data.niveauEducation || "",
      situationMatrimoniale: data.situationMatrimoniale || "",
      origine: data.origine || "",
      couvertureMedicale: data.couvertureMedicale || false,
      typeCouverture: data.typeCouverture || "",
    },
  });

  // Watch for couverture medicale changes
  const couvertureMedicaleValue = form.watch("couvertureMedicale");

  useEffect(() => {
    setShowCouverture(couvertureMedicaleValue);
  }, [couvertureMedicaleValue]);

  // Submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    updateFields({
      age: values.age,
      profession: values.profession,
      niveauEducation: values.niveauEducation as any,
      situationMatrimoniale: values.situationMatrimoniale as any,
      origine: values.origine,
      couvertureMedicale: values.couvertureMedicale,
      typeCouverture: values.typeCouverture,
    });
  }

  // Update parent component on form change
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log(value);
      updateFields({
        age: Number(value.age),
        profession: value.profession || "",
        niveauEducation: value.niveauEducation as any,
        situationMatrimoniale: value.situationMatrimoniale as any,
        origine: value.origine || "",
        couvertureMedicale: value.couvertureMedicale || false,
        typeCouverture: value.typeCouverture,
      });
    });
    return () => subscription.unsubscribe();
  }, [form, updateFields]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Âge de la patiente (ans) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Âge"
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
            name="profession"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profession *</FormLabel>
                <FormControl>
                  <Input placeholder="Profession" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="niveauEducation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Niveau d'éducation</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un niveau" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Analphabète">Analphabète</SelectItem>
                    <SelectItem value="Primaire">Primaire</SelectItem>
                    <SelectItem value="Secondaire">Secondaire</SelectItem>
                    <SelectItem value="Universitaire">Universitaire</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="situationMatrimoniale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Situation matrimoniale</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une situation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Mariée">Mariée</SelectItem>
                    <SelectItem value="Célibataire">Célibataire</SelectItem>
                    <SelectItem value="Divorcée/Veuve">
                      Divorcée/Veuve
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="origine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Origine géographique *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Origine géographique"
                    {...field}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormField
              control={form.control}
              name="couvertureMedicale"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Couverture médicale
                    </FormLabel>
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

        {showCouverture && (
          <FormField
            control={form.control}
            name="typeCouverture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de couverture médicale</FormLabel>
                <FormControl>
                  <Input placeholder="Type de couverture" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  );
}
