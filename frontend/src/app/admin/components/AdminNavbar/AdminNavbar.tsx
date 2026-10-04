"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./AdminNavbar.module.css";

interface AdminNavbarProps {
  onManageCompany: () => void;
  onManageEmployee: () => void;
}

export default function AdminNavbar({
  onManageCompany,
  onManageEmployee,
}: AdminNavbarProps) {
  const router = useRouter();

  const handleLogout = () => {
    /*
     * Authentication uses an HTTP-only access_token cookie.
     * Actual cookie clearing will be connected with the backend
     * logout API when we implement the logout endpoint.
     */

    router.push("/login");
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
          onClick={onManageEmployee}
        >
          Manage Employee
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