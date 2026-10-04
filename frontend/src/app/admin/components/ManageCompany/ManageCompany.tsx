"use client";

import { useState } from "react";
import styles from "./ManageCompany.module.css";
import { apiRequest } from "@/lib/api";

type CompanyType = "Partner" | "Enterprise" | "Standard";

interface CompanyFormData {
  name: string;
  type: CompanyType;
  address: string;
  billing_email: string;
}

interface CompanyResponse {
  message: string;
  operation: "create" | "update";
  company: {
    id: string;
    name: string;
    type: CompanyType;
    address: string;
    billing_email: string;
  };
}

interface DeleteCompanyResponse {
  message: string;
  operation: "delete";
}

export default function ManageCompany() {
  const [activeForm, setActiveForm] =
    useState<"add" | "delete">("add");

  // Add / Update form
  const [companyData, setCompanyData] =
    useState<CompanyFormData>({
      name: "",
      type: "Standard",
      address: "",
      billing_email: "",
    });

  // Delete form
  const [deleteName, setDeleteName] = useState("");

  // UI states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleCompanyChange = (
    field: keyof CompanyFormData,
    value: string
  ) => {
    setCompanyData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleCompanySubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response =
        await apiRequest<CompanyResponse>(
          "/companies",
          {
            method: "POST",
            body: JSON.stringify(companyData),
          }
        );

      setMessage(response.message);

      // Clear form after successful operation
      setCompanyData({
        name: "",
        type: "Standard",
        address: "",
        billing_email: "",
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response =
        await apiRequest<DeleteCompanyResponse>(
          "/companies",
          {
            method: "DELETE",
            body: JSON.stringify({
              name: deleteName,
            }),
          }
        );

      setMessage(response.message);

      // Clear delete field
      setDeleteName("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (
    form: "add" | "delete"
  ) => {
    setActiveForm(form);

    // Clear previous messages
    setMessage("");
    setError("");
  };

  return (
    <section className={styles.container}>
      <div className={styles.card}>

        <h1 className={styles.title}>
          Manage Company
        </h1>

        {/* Add / Delete switch */}

        <div className={styles.formSwitch}>

          <button
            type="button"
            className={
              activeForm === "add"
                ? styles.activeTab
                : styles.tab
            }
            onClick={() =>
              handleFormChange("add")
            }
          >
            Add
          </button>

          <button
            type="button"
            className={
              activeForm === "delete"
                ? styles.activeTab
                : styles.tab
            }
            onClick={() =>
              handleFormChange("delete")
            }
          >
            Delete
          </button>

        </div>

        {/* Success message */}

        {message && (
          <div className={styles.successMessage}>
            {message}
          </div>
        )}

        {/* Error message */}

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* =========================
            ADD / UPDATE FORM
        ========================== */}

        {activeForm === "add" && (
          <form
            onSubmit={handleCompanySubmit}
            className={styles.form}
          >

            <div className={styles.inputGroup}>
              <label htmlFor="company-name">
                Name
              </label>

              <input
                id="company-name"
                type="text"
                placeholder="Enter company name"
                value={companyData.name}
                onChange={(event) =>
                  handleCompanyChange(
                    "name",
                    event.target.value
                  )
                }
                required
                disabled={loading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="company-type">
                Type
              </label>

              <select
                id="company-type"
                value={companyData.type}
                onChange={(event) =>
                  handleCompanyChange(
                    "type",
                    event.target.value
                  )
                }
                required
                disabled={loading}
              >
                <option value="Partner">
                  Partner
                </option>

                <option value="Enterprise">
                  Enterprise
                </option>

                <option value="Standard">
                  Standard
                </option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="company-address">
                Address
              </label>

              <input
                id="company-address"
                type="text"
                placeholder="Enter company address"
                value={companyData.address}
                onChange={(event) =>
                  handleCompanyChange(
                    "address",
                    event.target.value
                  )
                }
                required
                disabled={loading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="billing-email">
                Billing Email
              </label>

              <input
                id="billing-email"
                type="email"
                placeholder="Enter billing email"
                value={companyData.billing_email}
                onChange={(event) =>
                  handleCompanyChange(
                    "billing_email",
                    event.target.value
                  )
                }
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Processing..." : "Submit"}
            </button>

          </form>
        )}

        {/* =========================
            DELETE FORM
        ========================== */}

        {activeForm === "delete" && (
          <form
            onSubmit={handleDeleteSubmit}
            className={styles.form}
          >

            <div className={styles.inputGroup}>
              <label htmlFor="delete-company-name">
                Company Name
              </label>

              <input
                id="delete-company-name"
                type="text"
                placeholder="Enter company name"
                value={deleteName}
                onChange={(event) =>
                  setDeleteName(event.target.value)
                }
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className={styles.deleteButton}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>

          </form>
        )}

      </div>
    </section>
  );
}