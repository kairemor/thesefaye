'use client';

import { useData } from '@/lib/data-context';
import { Cell, Pie, PieChart, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useMemo } from 'react';

export function PatientDistribution() {
  const { patients } = useData();
  
  const data = useMemo(() => {
    const satisfactionCounts = {
      'Très satisfaite': 0,
      'Satisfaite': 0,
      'Neutre': 0,
      'Insatisfaite': 0,
      'Non renseigné': 0
    };
    
    patients.forEach(patient => {
      if (patient.satisfactionPatiente) {
        satisfactionCounts[patient.satisfactionPatiente as keyof typeof satisfactionCounts] += 1;
      } else {
        satisfactionCounts['Non renseigné'] += 1;
      }
    });
    
    return Object.entries(satisfactionCounts)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  }, [patients]);
  
  const COLORS = ['#4caf50', '#8bc34a', '#ffc107', '#f44336', '#9e9e9e'];
  
  if (patients.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-muted-foreground">Aucune donnée disponible</p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value} patient${value > 1 ? 's' : ''}`, 'Nombre']}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}