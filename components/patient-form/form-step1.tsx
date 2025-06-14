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

export function FormStep1() {
  const { control, watch } = useFormContext();
  const showCouverture = watch("couvertureMedicale");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
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
          control={control}
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
          control={control}
          name="niveauEducation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Niveau d'éducation</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          control={control}
          name="situationMatrimoniale"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Situation matrimoniale</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une situation" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Mariée">Mariée</SelectItem>
                  <SelectItem value="Célibataire">Célibataire</SelectItem>
                  <SelectItem value="Divorcée/Veuve">Divorcée/Veuve</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="origine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Origine géographique *</FormLabel>
              <FormControl>
                <Input placeholder="Origine géographique" {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="nom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la Patiente</FormLabel>
              <FormControl>
                <Input
                  placeholder="Préciser le nom de la patiente"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormField
            control={control}
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
          control={control}
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
    </div>
  );
}
