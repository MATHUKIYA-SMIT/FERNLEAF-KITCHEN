"use client";

import { useEffect, useState } from "react";

import { apiRequest } from "@/lib/api";

import styles from "./kitchen_employees.module.css";

interface KitchenEmployee {
  id: string;
  username: string;
  email: string;
  role: string;
  is_available: boolean;
}

interface KitchenEmployeeResponse {
  pending_requests: KitchenEmployee[];
  active_employees: KitchenEmployee[];
}

export default function KitchenEmployeesPage() {
  const [pending_requests, setPendingRequests] =
    useState<KitchenEmployee[]>([]);

  const [active_employees, setActiveEmployees] =
    useState<KitchenEmployee[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [processing_id, setProcessingId] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const fetchKitchenEmployees =
    async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await apiRequest<KitchenEmployeeResponse>(
            "/kitchen-employees"
          );

        setPendingRequests(
          data.pending_requests
        );

        setActiveEmployees(
          data.active_employees
        );
      } catch (error) {
        console.error(
          "Failed to fetch kitchen employees:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load employees."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchKitchenEmployees();
  }, []);

  const handleAccept = async (
    id: string
  ) => {
    try {
      setProcessingId(id);
      setMessage("");
      setError("");

      const data =
        await apiRequest<{ message: string }>(
          `/kitchen-employees/${id}/accept`,
          {
            method: "PATCH",
          }
        );

      setMessage(data.message);

      await fetchKitchenEmployees();
    } catch (error) {
      console.error(
        "Failed to accept employee:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to accept employee."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (
    id: string
  ) => {
    try {
      setProcessingId(id);
      setMessage("");
      setError("");

      const data =
        await apiRequest<{ message: string }>(
          `/kitchen-employees/${id}/reject`,
          {
            method: "DELETE",
          }
        );

      setMessage(data.message);

      await fetchKitchenEmployees();
    } catch (error) {
      console.error(
        "Failed to reject employee:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to reject employee."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemove = async (
    id: string
  ) => {
    try {
      setProcessingId(id);
      setMessage("");
      setError("");

      const data =
        await apiRequest<{ message: string }>(
          `/kitchen-employees/${id}`,
          {
            method: "DELETE",
          }
        );

      setMessage(data.message);

      await fetchKitchenEmployees();
    } catch (error) {
      console.error(
        "Failed to remove employee:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to remove employee."
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.loading}>
          Loading employees...
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1>Manage Employees</h1>

        <p>
          Manage employee requests and active
          employees.
        </p>
      </div>

      {message && (
        <div className={styles.successMessage}>
          {message}
        </div>
      )}

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {/* Pending Requests */}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>
            Pending Employee Requests
          </h2>

          <span className={styles.count}>
            {pending_requests.length}
          </span>
        </div>

        {pending_requests.length === 0 ? (
          <div className={styles.emptyState}>
            No pending employee requests.
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Availability</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {pending_requests.map(
                  (employee) => (
                    <tr key={employee.id}>
                      <td>
                        {employee.username}
                      </td>

                      <td>
                        {employee.email}
                      </td>

                      <td>
                        <span
                          className={
                            styles.roleBadge
                          }
                        >
                          {employee.role}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            styles.notAvailable
                          }
                        >
                          NOT AVAILABLE
                        </span>
                      </td>

                      <td>
                        <div
                          className={
                            styles.actionButtons
                          }
                        >
                          <button
                            type="button"
                            className={
                              styles.acceptButton
                            }
                            disabled={
                              processing_id ===
                              employee.id
                            }
                            onClick={() =>
                              handleAccept(
                                employee.id
                              )
                            }
                          >
                            {processing_id ===
                            employee.id
                              ? "Processing..."
                              : "Accept"}
                          </button>

                          <button
                            type="button"
                            className={
                              styles.rejectButton
                            }
                            disabled={
                              processing_id ===
                              employee.id
                            }
                            onClick={() =>
                              handleReject(
                                employee.id
                              )
                            }
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Active Employees */}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Active Employees</h2>

          <span className={styles.count}>
            {active_employees.length}
          </span>
        </div>

        {active_employees.length === 0 ? (
          <div className={styles.emptyState}>
            No active employees.
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Availability</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {active_employees.map(
                  (employee) => (
                    <tr key={employee.id}>
                      <td>
                        {employee.username}
                      </td>

                      <td>
                        {employee.email}
                      </td>

                      <td>
                        <span
                          className={
                            styles.roleBadge
                          }
                        >
                          {employee.role}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            styles.available
                          }
                        >
                          AVAILABLE
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className={
                            styles.removeButton
                          }
                          disabled={
                            processing_id ===
                            employee.id
                          }
                          onClick={() =>
                            handleRemove(
                              employee.id
                            )
                          }
                        >
                          {processing_id ===
                          employee.id
                            ? "Processing..."
                            : "Remove"}
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}