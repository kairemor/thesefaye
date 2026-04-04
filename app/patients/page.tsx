"use client";

import { useState } from "react";
import { useData } from "@/lib/data-context";
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
import { ExternalLink, Trash2, Search, Download, X, Users, UserPlus } from "lucide-react";
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
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Liste des Patients</h1>
          {patients.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {searchTerm
                ? `${filteredPatients.length} résultat${filteredPatients.length > 1 ? "s" : ""} sur ${patients.length} patient${patients.length > 1 ? "s" : ""}`
                : `${patients.length} patient${patients.length > 1 ? "s" : ""} au total`}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par N°, âge, profession..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-8 w-full"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Effacer la recherche"
              >
                <X className="h-4 w-4" />
              </button>
            )}
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
                <TableHead className="hidden md:table-cell">Profession</TableHead>
                <TableHead className="hidden md:table-cell">Origine</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.patientNo || "N/A"}</TableCell>
                  <TableCell>{formatDate(patient.date)}</TableCell>
                  <TableCell>{patient.age} ans</TableCell>
                  <TableCell className="hidden md:table-cell">{patient.profession}</TableCell>
                  <TableCell className="hidden md:table-cell">{patient.origine}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link href={`/patients/${patient.id}`}>
                        <Button variant="ghost" size="icon" title="Voir / Modifier">
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Voir</span>
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" title="Supprimer">
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Supprimer</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer ce patient ? Cette action est irréversible.
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
        <div className="flex flex-col items-center justify-center py-16 text-center border rounded-md">
          {patients.length === 0 ? (
            <>
              <Users className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="font-semibold mb-1">Aucun patient enregistré</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Commencez par ajouter votre premier patient.
              </p>
              <Link href="/patients/new">
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajouter un patient
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Search className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="font-semibold mb-1">Aucun résultat</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Aucun patient ne correspond à &quot;{searchTerm}&quot;.
              </p>
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                <X className="h-4 w-4 mr-2" />
                Effacer la recherche
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
