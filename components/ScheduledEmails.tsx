"use client";

import { useEffect, useState } from "react";

interface EmailJob {
  id: string;
  subject: string;
  toEmail: string;
  scheduledAt: string;
  status: string;
}

export default function ScheduledEmails() {
  const [emails, setEmails] = useState<EmailJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/scheduled")
      .then((res) => res.json())
      .then((data) => {
        setEmails(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mt-4">
      <h2 className="text-lg font-bold mb-2">Scheduled Emails</h2>
      {emails.length === 0 ? (
        <p>No scheduled emails</p>
      ) : (
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr>
              <th className="p-2">Email</th>
              <th className="p-2">Subject</th>
              <th className="p-2">Scheduled At</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {emails.map((email) => (
              <tr key={email.id}>
                <td className="p-2">{email.toEmail}</td>
                <td className="p-2">{email.subject}</td>
                <td className="p-2">{new Date(email.scheduledAt).toLocaleString()}</td>
                <td className="p-2">{email.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}