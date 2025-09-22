'use client';
import { useEffect, useState } from 'react';
import LogoutButton from '@/components/LogoutButton';
import ProtectedRoute from '@/components/ProtectedRoute';

  const AdminDashboard = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch('http://localhost:5000/api/admin/dashboard', {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          setMessage(data.message || "Failed to load admin dashboard");
          return;
        }

        setMessage(data.message);
      } catch (error) {
        console.error(error);
        setMessage("Something went wrong while loading the dashboard");
      }
    };

    fetchDashboard();
  }, []);

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        {message && <p className="mt-4">{message}</p>}
        <LogoutButton />
      </div>
    </ProtectedRoute>
  );
}

export default AdminDashboard
