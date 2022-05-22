import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { collectIdsAndDocs } from "../../shared/utilities";
import { db } from "../../shared/configs/firebase";
import RecordsTable from "./RecordsTable";

function Admin() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(collection(db, "records"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setRecords(querySnapshot.docs.map((doc) => collectIdsAndDocs(doc)));
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const getData = () => {
    if (search.length === 0) {
      return records;
    }

    return records.filter((item) =>
      item.fullname.toLowerCase().includes(search)
    );
  };

  console.log("records: ", records);
  return (
    <div className="h-screen w-screen px-20 pt-36">
      <h1 className="font-bold text-2xl mb-5">Patient Records</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search patient"
          className="border-gray-200 border px-3 py-1 rounded-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <RecordsTable data={getData()} />
    </div>
  );
}

export default Admin;
