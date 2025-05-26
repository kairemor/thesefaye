'use client';

import { useEffect } from 'react';
import { StepProps } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
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
  ageGestationnel: z.number()
    .min(22, 'L\'âge gestationnel doit être d\'au moins 22 semaines')
    .max(42, 'L\'âge gestationnel doit être au maximum de 42 semaines'),
  suiviPrenatal: z.string(),
  nombreConsultations: z.number().min(0, 'Le nombre de consultations doit être un nombre positif'),
  pathologiesAssociees: z.object({
    preEclampsie: z.boolean(),
    diabeteGestationnel: z.boolean(),
    anemie: z.boolean(),
    hemoglobine: z.number().min(4, 'L\'hémoglobine doit être d\'au moins 4 g/dL').max(18, 'L\'hémoglobine doit être au maximum de 18 g/dL').optional(),
    autres: z.boolean(),
    autresDetails: z.string().optional(),
  }),
});

export function FormStep3({ data, updateFields }: StepProps) {
  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ageGestationnel: data.ageGestationnel || 0,
      suiviPrenatal: data.suiviPrenatal || '',
      nombreConsultations: data.nombreConsultations || 0,
      pathologiesAssociees: {
        preEclampsie: data.pathologiesAssociees?.preEclampsie || false,
        diabeteGestationnel: data.pathologiesAssociees?.diabeteGestationnel || false,
        anemie: data.pathologiesAssociees?.anemie || false,
        hemoglobine: data.pathologiesAssociees?.hemoglobine || 0,
        autres: data.pathologiesAssociees?.autres || false,
        autresDetails: data.pathologiesAssociees?.autresDetails || '',
      },
    },
  });

  // Watch for certain field changes
  const anemie = form.watch('pathologiesAssociees.anemie');
  const autres = form.watch('pathologiesAssociees.autres');
  
  // Submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    updateFields({
      ageGestationnel: values.ageGestationnel,
      suiviPrenatal: values.suiviPrenatal as any,
      nombreConsultations: values.nombreConsultations,
      pathologiesAssociees: values.pathologiesAssociees,
    });
  }
  
  // Update parent component on form change
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.pathologiesAssociees) {
        updateFields({
          ageGestationnel: Number(value.ageGestationnel) || 0,
          suiviPrenatal: value.suiviPrenatal as any,
          nombreConsultations: Number(value.nombreConsultations) || 0,
          pathologiesAssociees: {
            preEclampsie: value.pathologiesAssociees.preEclampsie || false,
            diabeteGestationnel: value.pathologiesAssociees.diabeteGestationnel || false,
            anemie: value.pathologiesAssociees.anemie || false,
            hemoglobine: value.pathologiesAssociees.hemoglobine,
            autres: value.pathologiesAssociees.autres || false,
            autresDetails: value.pathologiesAssociees.autresDetails,
          },
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, updateFields]);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="ageGestationnel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Âge gestationnel (SA) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Semaines d'aménorrhée" 
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
            control={form.control}
            name="nombreConsultations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de consultations *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Nombre de consultations" 
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
        
        <div>
          <h3 className="text-lg font-medium mb-4">Pathologies associées</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
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
              control={form.control}
              name="pathologiesAssociees.diabeteGestationnel"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Diabète gestationnel</FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
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
              control={form.control}
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
              control={form.control}
              name="pathologiesAssociees.hemoglobine"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Hémoglobine (g/dL)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Taux d'hémoglobine" 
                      {...field}
                      onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
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
              control={form.control}
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
      </form>
    </Form>
  );
}