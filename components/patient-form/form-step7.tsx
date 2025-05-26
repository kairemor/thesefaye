"use client";

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

import { useFormContext } from "react-hook-form";

export function FormStep7() {
  const { control, watch } = useFormContext();
  // Watch for certain field changes
  const autresComplications = watch("complicationsPostPartum.autres");
  const autresComplicationsTardives = watch("complicationsTardives.autres");

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="satisfactionPatiente"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Satisfaction de la patiente</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le niveau de satisfaction" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Très satisfaite">Très satisfaite</SelectItem>
                <SelectItem value="Satisfaite">Satisfaite</SelectItem>
                <SelectItem value="Neutre">Neutre</SelectItem>
                <SelectItem value="Insatisfaite">Insatisfaite</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <h3 className="text-lg font-medium mb-4">Complications post-partum</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="complicationsPostPartum.cephaleesPostPonction"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Céphalées post-ponction
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="complicationsPostPartum.infectionSitePonction"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Infection au site de ponction
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="complicationsPostPartum.douleursLombairesPersistantes"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Douleurs lombaires persistantes
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="complicationsPostPartum.autres"
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

        {autresComplications && (
          <FormField
            control={control}
            name="complicationsPostPartum.autresDetails"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Préciser les autres complications</FormLabel>
                <FormControl>
                  <Input placeholder="Autres complications" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Complications tardives</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="complicationsTardives.nevralgieOuDysesthesis"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Névralgie Ou dysesthesis
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="complicationsTardives.syndromeQueueCheval"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Syndrome de la queue de Cheval
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="complicationsTardives.adherencePeriduraleOuFibrose"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Adhérence péridurale ou fibrose
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="complicationsTardives.autres"
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

        {autresComplicationsTardives && (
          <FormField
            control={control}
            name="complicationsTardives.autresDetails"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>
                  Préciser les autres complications tardives
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Autres complications tardives"
                    {...field}
                  />
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
