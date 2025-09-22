'use client'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';



 const SignupPage = () => {

  const router = useRouter();

  // 1. State for form inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 2. State for feedback
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Password validation regex (same as backend)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long, contain uppercase, lowercase, a number, and a special character eg @."
      );
      return;
    }
    setLoading(true);
    setError("");
    

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, email, password}),
      });

      const data = await res.json();

      if(!res.ok) {
        setError(data.message || "Signup Failed")
        return
      }

      setSuccess("Account created successfully!");
      setUsername("");
      setEmail("");
      setPassword("");

      router.push('/login');
    } catch (error) {
      console.error(error);
      setError("Something went wrong, Please try again!")
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
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>


        <input
          type="text"
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />

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
        <p className="text-xs text-gray-500 mb-2">
          Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.
        </p>


        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <button
          type="submit"
          className={`w-full p-2 rounded text-white cursor-pointer ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}>
            {loading ? "Signing up..." : "Signup"}
        </button>

        <p className="mt-3 text-sm">
          Already have an account?{" "}
          <Link href='/login' className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
};

export default SignupPage