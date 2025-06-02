"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Patient } from "@/lib/types";
import { saveToLocalStorage, loadFromLocalStorage } from "@/lib/storage";
import {
  createPatient,
  updatePatient as updatePatientApi,
  getPatients,
} from "./api";

type DataContextType = {
  patients: Patient[];
  addPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
  deletePatient: (id: string) => void;
  getPatient: (id: string) => Patient | undefined;
};

const DataContext = createContext<DataContextType>({
  patients: [],
  addPatient: () => {},
  updatePatient: () => {},
  deletePatient: () => {},
  getPatient: () => undefined,
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const loadedPatients =
        (loadFromLocalStorage("patients") as Patient[]) || [];
      const patients = await getPatients();
      console.log(patients.data.patients);
      setPatients(patients.data.patients);
    };
    fetchPatients();
  }, []);

  const addPatient = (patient: Patient) => {
    const newPatients = [...patients, patient];
    setPatients(newPatients);
    saveToLocalStorage("patients", newPatients);
    createPatient(patient);
  };

  const updatePatient = (updatedPatient: Patient) => {
    const newPatients = patients.map((patient) =>
      patient.id === updatedPatient.id ? updatedPatient : patient
    );
    setPatients(newPatients);
    saveToLocalStorage("patients", newPatients);
    updatePatientApi(updatedPatient.id, updatedPatient);
  };

  const deletePatient = (id: string) => {
    const newPatients = patients.filter((patient) => patient.id !== id);
    setPatients(newPatients);
    saveToLocalStorage("patients", newPatients);
  };

  const getPatient = (id: string) => {
    return patients.find((patient) => patient.id === id);
  };

  return (
    <DataContext.Provider
      value={{
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        getPatient,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
