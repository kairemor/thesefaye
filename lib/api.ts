export const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";
export const apiPatientsUrl = `${apiUrl}/api/patients`;

//create a new patient
export const createPatient = async (patient: any) => {
  const response = await fetch(apiPatientsUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patient),
  });

  if (!response.ok) {
    throw new Error("Failed to create patient");
  }

  return response.json();
};
// get all patients
export const getPatients = async () => {
  const response = await fetch(apiPatientsUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch patients");
  }

  return response.json();
};
// get a patient by id
export const getPatientById = async (id: string) => {
  const response = await fetch(`${apiPatientsUrl}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch patient");
  }

  return response.json();
};

// update a patient
export const updatePatient = async (id: string, patient: any) => {
  const response = await fetch(`${apiPatientsUrl}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patient),
  });

  if (!response.ok) {
    throw new Error("Failed to update patient");
  }

  return response.json();
};
