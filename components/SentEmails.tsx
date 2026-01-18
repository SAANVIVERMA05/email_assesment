"use client";

import { useEffect, useState } from "react";

interface EmailJob {
  id: string;
  subject: string;
  toEmail: string;
  sentAt: string;
  status: string;
}

export default function SentEmails() {
  const [emails, setEmails] = useState<EmailJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sent")
      .then((res) => res.json())
      .then((data) => {
        setEmails(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mt-4">
      <h2 className="text-lg font-bold mb-2">Sent Emails</h2>
      {emails.length === 0 ? (
        <p>No sent emails</p>
      ) : (
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr>
              <th className="p-2">Email</th>
              <th className="p-2">Subject</th>
              <th className="p-2">Sent At</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {emails.map((email) => (
              <tr key={email.id}>
                <td className="p-2">{email.toEmail}</td>
                <td className="p-2">{email.subject}</td>
                <td className="p-2">{new Date(email.sentAt!).toLocaleString()}</td>
                <td className="p-2">{email.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}