"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";

import styles from "./AdminNavbar.module.css";

interface AdminNavbarProps {
  onManageCompany: () => void;
  onManageEmployee: () => void;
}

interface LogoutResponse {
  message: string;
}

export default function AdminNavbar({
  onManageCompany,
  onManageEmployee,
}: AdminNavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiRequest<LogoutResponse>(
        "/auth/logout",
        {
          method: "POST",
        }
      );

      /*
       * Backend successfully cleared
       * the HTTP-only access_token cookie.
       */
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className={styles.navbar}>

      {/* LEFT - Logo */}

      <div className={styles.logoSection}>
        <Image
          src="/logo.png"
          alt="Fernleaf Kitchen"
          width={42}
          height={42}
          className={styles.logo}
        />

        <span className={styles.websiteName}>
          FERNLEAF KITCHEN
        </span>
      </div>


      {/* CENTER - Search */}

      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Search..."
          className={styles.searchBar}
        />
      </div>


      {/* RIGHT - Actions */}

      <div className={styles.actionSection}>

        <button
          type="button"
          className={styles.navButton}
          onClick={onManageCompany}
        >
          Manage Company
        </button>
        
        <button
          type="button"
          className={styles.navButton}
          onClick={() =>
            router.push("/admin/kitchen_employees")
          }
        >
          Manage Kitchen Employee
        </button>

        <button
          type="button"
          className={styles.logoutButton}
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}