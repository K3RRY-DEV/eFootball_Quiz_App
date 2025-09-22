'use client'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';



 const LoginPage = () => {

  const router = useRouter();

  // 1. State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 2. State for feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password}),
        credentials: "include", // if using cookies
      });

      const data = await res.json();

      if(!res.ok) {
        setError(data.message || "Login Failed");
        return;
      }

        // ✅ success → save token in localStorage (if using JWT)
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      if( data.role === "admin") {
        router.push('/admin/dashboard');
      } else{
        router.push('/dashboard');
      }
    } catch (error) {
       console.error(error);
      setError("Something went wrong, Please try again!",)
    } finally {
      setLoading(false);
    }
  };




  return(
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          type="submit"
          className={`w-full p-2 rounded text-white cursor-pointer ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}>
            {loading ? "logging in..." : "Login"}
        </button>

        <p className="mt-3 text-sm">
          Already have an account?{" "}
          <Link href='/signup' className="text-blue-600 hover:underline">
          Signup
          </Link>
        </p>
      </form>
    </div>
  )
};

export default LoginPage