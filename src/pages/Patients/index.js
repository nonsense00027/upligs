import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { collectIdsAndDocs } from "../../shared/utilities";
import { db } from "../../shared/configs/firebase";
import PatientCard from "../../components/PatientCard";

function Patients() {
  const [patients, setPatients] = useState([]);
  console.log("patients: ", patients);

  useEffect(() => {
    (async function () {
      const q = query(
        collection(db, "profiles"),
        where("role", "==", "patient")
      );
      const querySnapshot = await getDocs(q);
      setPatients(querySnapshot.docs.map((doc) => collectIdsAndDocs(doc)));
    })();
  }, []);
  return (
    <div className="pt-32 max-w-screen-xl mx-auto">
      <h1 className="font-bold text-2xl mb-5">Patient Records</h1>
      <div className="grid grid-cols-4 gap-2">
        {patients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  );
}

export default Patients;
