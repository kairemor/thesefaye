"use client";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useFormContext } from "react-hook-form";

export function FormStep8() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Informations d'anesthésie</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="niveauPonction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Niveau de ponction</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Préciser le niveau de ponction"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="espacePeridural"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Espace péridurale</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Préciser l'espace péridurale"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="catheterFixe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cathéter fixé à</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Préciser où le cathéter est fixé"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="bolusTest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bolus test</FormLabel>
                  <FormControl>
                    <Input placeholder="Préciser le bolus test" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="dilution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dilution</FormLabel>
                  <FormControl>
                    <Input placeholder="Préciser la dilution" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="dureeRealisation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durée de réalisation</FormLabel>
                  <FormControl>
                    <Input placeholder="Durée de réalisation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="niveauSensitif"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Niveau sensitif</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Préciser le niveau sensitif"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="blocMoteur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bloc moteur</FormLabel>
                  <FormControl>
                    <Input placeholder="Préciser le bloc moteur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={control}
            name="vitesseDebut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vitesse de début</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Préciser la vitesse de début"
                    {...field}
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
