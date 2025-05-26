'use client';

import { useEffect } from 'react';
import { StepProps } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Create schema for validation
const formSchema = z.object({
  antecedentsMedicaux: z.object({
    hypertension: z.boolean(),
    diabete: z.boolean(),
    asthme: z.boolean(),
    autres: z.boolean(),
    autresDetails: z.string().optional(),
  }),
  antecedentsObstetricaux: z.object({
    parite: z.number().min(0, 'La parité doit être un nombre positif'),
    gestite: z.number().min(0, 'La gestité doit être un nombre positif'),
    prematurite: z.boolean(),
    mortFoetale: z.boolean(),
    cesarienneAnterieure: z.boolean(),
  }),
  allergies: z.boolean(),
  allergiesAgent: z.string().optional(),
});

export function FormStep2({ data, updateFields }: StepProps) {
  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      antecedentsMedicaux: {
        hypertension: data.antecedentsMedicaux?.hypertension || false,
        diabete: data.antecedentsMedicaux?.diabete || false,
        asthme: data.antecedentsMedicaux?.asthme || false,
        autres: data.antecedentsMedicaux?.autres || false,
        autresDetails: data.antecedentsMedicaux?.autresDetails || '',
      },
      antecedentsObstetricaux: {
        parite: data.antecedentsObstetricaux?.parite || 0,
        gestite: data.antecedentsObstetricaux?.gestite || 0,
        prematurite: data.antecedentsObstetricaux?.prematurite || false,
        mortFoetale: data.antecedentsObstetricaux?.mortFoetale || false,
        cesarienneAnterieure: data.antecedentsObstetricaux?.cesarienneAnterieure || false,
      },
      allergies: data.allergies || false,
      allergiesAgent: data.allergiesAgent || '',
    },
  });

  // Watch for certain field changes
  const autresMedicaux = form.watch('antecedentsMedicaux.autres');
  const allergies = form.watch('allergies');
  
  // Submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    updateFields({
      antecedentsMedicaux: values.antecedentsMedicaux,
      antecedentsObstetricaux: values.antecedentsObstetricaux,
      allergies: values.allergies,
      allergiesAgent: values.allergiesAgent,
    });
  }
  
  // Update parent component on form change
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.antecedentsMedicaux && value.antecedentsObstetricaux) {
        updateFields({
          antecedentsMedicaux: {
            hypertension: value.antecedentsMedicaux.hypertension || false,
            diabete: value.antecedentsMedicaux.diabete || false,
            asthme: value.antecedentsMedicaux.asthme || false,
            autres: value.antecedentsMedicaux.autres || false,
            autresDetails: value.antecedentsMedicaux.autresDetails,
          },
          antecedentsObstetricaux: {
            parite: Number(value.antecedentsObstetricaux.parite) || 0,
            gestite: Number(value.antecedentsObstetricaux.gestite) || 0,
            prematurite: value.antecedentsObstetricaux.prematurite || false,
            mortFoetale: value.antecedentsObstetricaux.mortFoetale || false,
            cesarienneAnterieure: value.antecedentsObstetricaux.cesarienneAnterieure || false,
          },
          allergies: value.allergies || false,
          allergiesAgent: value.allergiesAgent,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, updateFields]);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Antécédents médicaux</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
              name="antecedentsObstetricaux.parite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parité (Nombre d'accouchements) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Parité" 
                      {...field}
                      onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="antecedentsObstetricaux.gestite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gestité (Nombre de grossesses) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Gestité" 
                      {...field}
                      onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
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
              control={form.control}
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
              control={form.control}
              name="antecedentsObstetricaux.mortFoetale"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Mort fœtale in utero</FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="antecedentsObstetricaux.cesarienneAnterieure"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Césarienne antérieure</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div>
          <FormField
            control={form.control}
            name="allergies"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Allergies</FormLabel>
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
          
          {allergies && (
            <FormField
              control={form.control}
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
      </form>
    </Form>
  );
}