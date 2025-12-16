"use client";

import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useFormContext } from "react-hook-form";

export function FormStep9() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Efficacité analgésique</h3>
        <div className="space-y-4">
          <FormField
            control={control}
            name="efficaciteAnalgesique.delaiActionMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Délai d'action (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Délai d'action en minutes"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="efficaciteAnalgesique.evaAvantAnalgesie"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EVA avant analgésie (/10)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      placeholder="0-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="efficaciteAnalgesique.eva15MinApres"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EVA 15 min après (/10)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      placeholder="0-10"
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
              name="efficaciteAnalgesique.eva30MinApres"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EVA 30 min après (/10)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      placeholder="0-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="efficaciteAnalgesique.evaDemandeReinjection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EVA à la demande de réinjection (/10)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      placeholder="0-10"
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
              name="efficaciteAnalgesique.necessiteReinjection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nécessité de réinjection</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="oui" id="reinjection-oui" />
                        <label
                          htmlFor="reinjection-oui"
                          className="cursor-pointer"
                        >
                          Oui
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="non" id="reinjection-non" />
                        <label
                          htmlFor="reinjection-non"
                          className="cursor-pointer"
                        >
                          Non
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="efficaciteAnalgesique.nombreReinjections"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de réinjections</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Nombre"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="efficaciteAnalgesique.efficaciteGlobale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Efficacité globale</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excellente" id="eff-excellente" />
                      <label
                        htmlFor="eff-excellente"
                        className="cursor-pointer"
                      >
                        Excellente
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bonne" id="eff-bonne" />
                      <label htmlFor="eff-bonne" className="cursor-pointer">
                        Bonne
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderee" id="eff-moderee" />
                      <label htmlFor="eff-moderee" className="cursor-pointer">
                        Modérée
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="insuffisante"
                        id="eff-insuffisante"
                      />
                      <label
                        htmlFor="eff-insuffisante"
                        className="cursor-pointer"
                      >
                        Insuffisante
                      </label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="nombrePonction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de ponction</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value.toString()}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="ponction-1" />
                      <label htmlFor="ponction-1" className="cursor-pointer">
                        1
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="ponction-2" />
                      <label htmlFor="ponction-2" className="cursor-pointer">
                        2
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="ponction-3" />
                      <label htmlFor="ponction-3" className="cursor-pointer">
                        3
                      </label>
                    </div>
                  </RadioGroup>
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
