'use client'
import { useRouter } from 'next/navigation';


const LogoutButton = () => {

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");

    router.push('/login');
  };
  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
    >
      Logout
    </button>
  )
}

export default LogoutButton