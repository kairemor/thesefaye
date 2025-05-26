"use client";

import { useState } from "react";
import { useData } from "@/lib/data-context";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExternalLink, Trash2, Search, Download } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { exportToCSV } from "@/lib/storage";

export default function PatientsPage() {
  const { patients, deletePatient } = useData();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter patients based on search term
  const filteredPatients = patients.filter(
    (patient) =>
      patient.patientNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(patient.age).includes(searchTerm) ||
      patient.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.origine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const patientsToExport = searchTerm ? filteredPatients : patients;
    exportToCSV(patientsToExport, "patients-analgesie-peridurale.csv");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 justify-center">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Liste des Patients
            </h1>
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>
              <Button
                variant="outline"
                onClick={handleExport}
                disabled={filteredPatients.length === 0}
              >
                <Download size={16} className="mr-2" />
                Exporter
              </Button>
            </div>
          </div>

          {filteredPatients.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Âge</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Profession
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Origine
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>{patient.patientNo || "N/A"}</TableCell>
                      <TableCell>{formatDate(patient.date)}</TableCell>
                      <TableCell>{patient.age} ans</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {patient.profession}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {patient.origine}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/patients/${patient.id}`}>
                            <Button variant="ghost" size="icon">
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">Voir</span>
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Supprimer</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Confirmer la suppression
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer ce patient
                                  ? Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deletePatient(patient.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              {patients.length === 0 ? (
                <>
                  <p className="text-muted-foreground mb-4">
                    Aucun patient n'a encore été ajouté.
                  </p>
                  <Link href="/patients/new">
                    <Button>Ajouter un patient</Button>
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground mb-4">
                    Aucun patient ne correspond à votre recherche.
                  </p>
                  <Button variant="outline" onClick={() => setSearchTerm("")}>
                    Effacer la recherche
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
