"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";

export default function ComposeEmail() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [emails, setEmails] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("");
  const [delay, setDelay] = useState(2000);
  const [hourlyLimit, setHourlyLimit] = useState(100);

  const onDrop = (acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const parsed = Papa.parse(csv, { header: true });
      const ems = parsed.data.map((row: any) => row.email).filter(Boolean);
      setEmails(ems);
    };
    reader.readAsText(f);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("body", body);
    formData.append("file", file);
    formData.append("startTime", startTime);
    formData.append("delay", delay.toString());
    formData.append("hourlyLimit", hourlyLimit.toString());

    const res = await fetch("/api/schedule", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Emails scheduled!");
    } else {
      alert("Error scheduling emails");
    }
  };

  return (
    <div className="mt-4 p-4 bg-white shadow rounded">
      <h2 className="text-lg font-bold mb-2">Compose New Email</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block">Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-2 border"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block">Upload CSV</label>
          <div {...getRootProps()} className="border p-4 cursor-pointer">
            <input {...getInputProps()} />
            {file ? file.name : "Drop CSV here or click to select"}
          </div>
          {emails.length > 0 && <p>{emails.length} emails detected</p>}
        </div>
        <div className="mb-4">
          <label className="block">Start Time</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="p-2 border"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block">Delay between emails (ms)</label>
          <input
            type="number"
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            className="p-2 border"
          />
        </div>
        <div className="mb-4">
          <label className="block">Hourly Limit</label>
          <input
            type="number"
            value={hourlyLimit}
            onChange={(e) => setHourlyLimit(Number(e.target.value))}
            className="p-2 border"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Schedule
        </button>
      </form>
    </div>
  );
}