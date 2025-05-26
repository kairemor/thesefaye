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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Create schema for validation
const formSchema = z.object({
  modeAccouchement: z.string(),
  typeExtraction: z.string().optional(),
  indicationCesarienne: z.string().optional(),
  dureeDeuxiemePhase: z.number().min(0, 'La durée doit être un nombre positif'),
  etatNouveauNe: z.object({
    apgar1: z.number().min(0, 'Le score doit être au minimum de 0').max(10, 'Le score doit être au maximum de 10'),
    apgar5: z.number().min(0, 'Le score doit être au minimum de 0').max(10, 'Le score doit être au maximum de 10'),
    phCordon: z.number().min(6.8, 'Le pH doit être au minimum de 6.8').max(7.5, 'Le pH doit être au maximum de 7.5'),
    poids: z.number().min(0.5, 'Le poids doit être au minimum de 0.5 kg').max(6.0, 'Le poids doit être au maximum de 6.0 kg'),
  }),
});

export function FormStep6({ data, updateFields }: StepProps) {
  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modeAccouchement: data.modeAccouchement || '',
      typeExtraction: data.typeExtraction || '',
      indicationCesarienne: data.indicationCesarienne || '',
      dureeDeuxiemePhase: data.dureeDeuxiemePhase || 0,
      etatNouveauNe: {
        apgar1: data.etatNouveauNe?.apgar1 || 0,
        apgar5: data.etatNouveauNe?.apgar5 || 0,
        phCordon: data.etatNouveauNe?.phCordon || 0,
        poids: data.etatNouveauNe?.poids || 0,
      },
    },
  });

  // Watch for certain field changes
  const modeAccouchement = form.watch('modeAccouchement');
  
  // Submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    updateFields({
      modeAccouchement: values.modeAccouchement as any,
      typeExtraction: values.typeExtraction,
      indicationCesarienne: values.indicationCesarienne,
      dureeDeuxiemePhase: values.dureeDeuxiemePhase,
      etatNouveauNe: values.etatNouveauNe,
    });
  }
  
  // Update parent component on form change
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.etatNouveauNe) {
        updateFields({
          modeAccouchement: value.modeAccouchement as any,
          typeExtraction: value.typeExtraction,
          indicationCesarienne: value.indicationCesarienne,
          dureeDeuxiemePhase: Number(value.dureeDeuxiemePhase) || 0,
          etatNouveauNe: {
            apgar1: Number(value.etatNouveauNe.apgar1) || 0,
            apgar5: Number(value.etatNouveauNe.apgar5) || 0,
            phCordon: Number(value.etatNouveauNe.phCordon) || 0,
            poids: Number(value.etatNouveauNe.poids) || 0,
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
            name="modeAccouchement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mode d'accouchement</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le mode d'accouchement" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Voie basse spontanée">Voie basse spontanée</SelectItem>
                    <SelectItem value="Extraction instrumentale">Extraction instrumentale</SelectItem>
                    <SelectItem value="Césarienne">Césarienne</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {modeAccouchement === 'Extraction instrumentale' && (
            <FormField
              control={form.control}
              name="typeExtraction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d'extraction (forceps/ventouse)</FormLabel>
                  <FormControl>
                    <Input placeholder="Préciser le type d'extraction" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {modeAccouchement === 'Césarienne' && (
            <FormField
              control={form.control}
              name="indicationCesarienne"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Indication de césarienne</FormLabel>
                  <FormControl>
                    <Input placeholder="Préciser l'indication" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="dureeDeuxiemePhase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durée de la 2ᵉ phase du travail (minutes) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Durée en minutes" 
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
          <h3 className="text-lg font-medium mb-4">État du nouveau-né</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="etatNouveauNe.apgar1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Score d'Apgar 1ʳᵉ minute *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Score Apgar à 1 minute" 
                      {...field}
                      onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                      min="0"
                      max="10"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="etatNouveauNe.apgar5"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Score d'Apgar 5ᵉ minute *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Score Apgar à 5 minutes" 
                      {...field}
                      onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                      min="0"
                      max="10"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="etatNouveauNe.phCordon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>pH au cordon *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="pH au cordon" 
                      {...field}
                      onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                      step="0.01"
                      min="6.8"
                      max="7.5"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="etatNouveauNe.poids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poids (kg) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Poids en kg" 
                      {...field}
                      onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                      step="0.01"
                      min="0.5"
                      max="6"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}