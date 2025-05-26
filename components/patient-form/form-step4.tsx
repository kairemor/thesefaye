'use client';

import { useEffect } from 'react';
import { StepProps } from '@/lib/types';
import { Input } from '@/components/ui/input';
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
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Create schema for validation
const formSchema = z.object({
  declenchementTravail: z.string(),
  methodesDeclenchement: z.string().optional(),
  dureeTravail: z.object({
    phaseLatente: z.number().min(0, 'La durée doit être un nombre positif'),
    phaseActive: z.number().min(0, 'La durée doit être un nombre positif'),
  }),
  scoreBishop: z.number().min(0, 'Le score doit être au minimum de 0').max(13, 'Le score doit être au maximum de 13'),
  monitoringFoetal: z.object({
    rcfInitial: z.number().min(60, 'La fréquence cardiaque doit être d\'au moins 60 bpm').max(220, 'La fréquence cardiaque doit être au maximum de 220 bpm'),
    rassurant: z.boolean(),
  }),
});

export function FormStep4({ data, updateFields }: StepProps) {
  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      declenchementTravail: data.declenchementTravail || '',
      methodesDeclenchement: data.methodesDeclenchement || '',
      dureeTravail: {
        phaseLatente: data.dureeTravail?.phaseLatente || 0,
        phaseActive: data.dureeTravail?.phaseActive || 0,
      },
      scoreBishop: data.scoreBishop || 0,
      monitoringFoetal: {
        rcfInitial: data.monitoringFoetal?.rcfInitial || 0,
        rassurant: data.monitoringFoetal?.rassurant !== undefined ? data.monitoringFoetal?.rassurant : true,
      },
    },
  });

  // Watch for certain field changes
  const declenchementTravail = form.watch('declenchementTravail');
  
  // Submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    updateFields({
      declenchementTravail: values.declenchementTravail as any,
      methodesDeclenchement: values.methodesDeclenchement,
      dureeTravail: values.dureeTravail,
      scoreBishop: values.scoreBishop,
      monitoringFoetal: values.monitoringFoetal,
    });
  }
  
  // Update parent component on form change
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.dureeTravail && value.monitoringFoetal) {
        updateFields({
          declenchementTravail: value.declenchementTravail as any,
          methodesDeclenchement: value.methodesDeclenchement,
          dureeTravail: {
            phaseLatente: Number(value.dureeTravail.phaseLatente) || 0,
            phaseActive: Number(value.dureeTravail.phaseActive) || 0,
          },
          scoreBishop: Number(value.scoreBishop) || 0,
          monitoringFoetal: {
            rcfInitial: Number(value.monitoringFoetal.rcfInitial) || 0,
            rassurant: value.monitoringFoetal.rassurant,
          },
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, updateFields]);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="declenchementTravail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Déclenchement du travail</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type de déclenchement" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Spontané">Spontané</SelectItem>
                    <SelectItem value="Médical">Médical</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {declenchementTravail === 'Médical' && (
            <FormField
              control={form.control}
              name="methodesDeclenchement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Méthode de déclenchement</FormLabel>
                  <FormControl>
                    <Input placeholder="Préciser la méthode" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Durée du travail</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="dureeTravail.phaseLatente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phase latente (heures) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Durée en heures" 
                      {...field}
                      onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                      step="0.5"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dureeTravail.phaseActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phase active (heures) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Durée en heures" 
                      {...field}
                      onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                      step="0.5"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="scoreBishop"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Score de Bishop à l'admission *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Score de Bishop" 
                  {...field}
                  onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <h3 className="text-lg font-medium mb-4">Monitoring fœtal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="monitoringFoetal.rcfInitial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RCF initial (bpm)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Fréquence cardiaque fœtale" 
                      {...field}
                      onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="monitoringFoetal.rassurant"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">RCF Rassurant</FormLabel>
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
      </form>
    </Form>
  );
}