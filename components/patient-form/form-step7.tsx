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
  satisfactionPatiente: z.string(),
  complicationsPostPartum: z.object({
    cephaleesPostPonction: z.boolean(),
    infectionSitePonction: z.boolean(),
    douleursLombairesPersistantes: z.boolean(),
    autres: z.boolean(),
    autresDetails: z.string().optional(),
  }),
});

export function FormStep7({ data, updateFields }: StepProps) {
  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      satisfactionPatiente: data.satisfactionPatiente || '',
      complicationsPostPartum: {
        cephaleesPostPonction: data.complicationsPostPartum?.cephaleesPostPonction || false,
        infectionSitePonction: data.complicationsPostPartum?.infectionSitePonction || false,
        douleursLombairesPersistantes: data.complicationsPostPartum?.douleursLombairesPersistantes || false,
        autres: data.complicationsPostPartum?.autres || false,
        autresDetails: data.complicationsPostPartum?.autresDetails || '',
      },
    },
  });

  // Watch for certain field changes
  const autresComplications = form.watch('complicationsPostPartum.autres');
  
  // Submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    updateFields({
      satisfactionPatiente: values.satisfactionPatiente as any,
      complicationsPostPartum: values.complicationsPostPartum,
    });
  }
  
  // Update parent component on form change
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.complicationsPostPartum) {
        updateFields({
          satisfactionPatiente: value.satisfactionPatiente as any,
          complicationsPostPartum: {
            cephaleesPostPonction: value.complicationsPostPartum.cephaleesPostPonction || false,
            infectionSitePonction: value.complicationsPostPartum.infectionSitePonction || false,
            douleursLombairesPersistantes: value.complicationsPostPartum.douleursLombairesPersistantes || false,
            autres: value.complicationsPostPartum.autres || false,
            autresDetails: value.complicationsPostPartum.autresDetails,
          },
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, updateFields]);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="satisfactionPatiente"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Satisfaction de la patiente</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
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
              control={form.control}
              name="complicationsPostPartum.cephaleesPostPonction"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Céphalées post-ponction</FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="complicationsPostPartum.infectionSitePonction"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Infection au site de ponction</FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="complicationsPostPartum.douleursLombairesPersistantes"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Douleurs lombaires persistantes</FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
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
              control={form.control}
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
      </form>
    </Form>
  );
}