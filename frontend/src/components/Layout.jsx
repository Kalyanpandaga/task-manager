import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} AGH Internship Task Portal · All Rights
        Reserved
      </footer>
    </div>
  );
}
