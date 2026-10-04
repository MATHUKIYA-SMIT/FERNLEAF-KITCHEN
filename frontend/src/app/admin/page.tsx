"use client";

import { useState } from "react";

import AdminNavbar from "./components/AdminNavbar/AdminNavbar";
import ManageCompany from "./components/ManageCompany/ManageCompany";

import styles from "./admin.module.css";

type AdminSection = "home" | "company" | "employee";

export default function AdminPage() {
  const [activeSection, setActiveSection] =
    useState<AdminSection>("home");

  return (
    <div className={styles.dashboard}>

      <AdminNavbar
        onManageCompany={() =>
          setActiveSection("company")
        }
        onManageEmployee={() =>
          setActiveSection("employee")
        }
      />

      <main className={styles.content}>

        {activeSection === "home" && (
          <div className={styles.welcome}>
            <h1>Welcome, Admin</h1>

            <p>
              Manage Fernleaf Kitchen from your dashboard.
            </p>
          </div>
        )}

        {activeSection === "company" && (
          <ManageCompany />
        )}

        {activeSection === "employee" && (
          <div className={styles.comingSoon}>
            <h2>Manage Employee</h2>

            <p>
              Employee management will be implemented next.
            </p>
          </div>
        )}

      </main>

    </div>
  );
}