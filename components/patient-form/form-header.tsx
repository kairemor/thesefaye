'use client';

import { useState, useEffect } from 'react';
import { Patient } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getTodayDate } from '@/lib/utils';

interface FormHeaderProps {
  data: Patient;
  updateFields: (fields: Partial<Patient>) => void;
}

export function FormHeader({ data, updateFields }: FormHeaderProps) {
  const [localDate, setLocalDate] = useState(data.date || getTodayDate());
  const [localInvestigateur, setLocalInvestigateur] = useState(data.investigateur || '');
  const [localPatientNo, setLocalPatientNo] = useState(data.patientNo || '');
  
  useEffect(() => {
    // Update parent state when component unmounts or when form is submitted
    return () => {
      updateFields({
        date: localDate,
        investigateur: localInvestigateur,
        patientNo: localPatientNo,
      });
    };
  }, [localDate, localInvestigateur, localPatientNo, updateFields]);
  
  return (
    <Card className="bg-primary/5">
      <CardContent className="pt-6">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">
            Fiche de Collecte de Données – Analgésie Péridurale
          </h2>
          <p className="text-muted-foreground">Hôpital de Tivaouane</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="investigateur">Investigateur</Label>
            <Input
              id="investigateur"
              value={localInvestigateur}
              onChange={(e) => setLocalInvestigateur(e.target.value)}
              placeholder="Nom de l'investigateur"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={localDate}
              onChange={(e) => setLocalDate(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="patientNo">N° Patient</Label>
            <Input
              id="patientNo"
              value={localPatientNo}
              onChange={(e) => setLocalPatientNo(e.target.value)}
              placeholder="Numéro d'identification"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}