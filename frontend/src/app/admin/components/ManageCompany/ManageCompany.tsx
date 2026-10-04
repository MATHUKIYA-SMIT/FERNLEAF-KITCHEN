"use client";

import { useState } from "react";
import styles from "./ManageCompany.module.css";

type CompanyType = "Partner" | "Enterprise" | "Standard";

interface CompanyFormData {
  name: string;
  type: CompanyType;
  address: string;
  billing_email: string;
}

export default function ManageCompany() {
  const [activeForm, setActiveForm] = useState<"add" | "delete">("add");

  // Add / Update form
  const [companyData, setCompanyData] = useState<CompanyFormData>({
    name: "",
    type: "Standard",
    address: "",
    billing_email: "",
  });

  // Delete form
  const [deleteName, setDeleteName] = useState("");

  const handleCompanyChange = (
    field: keyof CompanyFormData,
    value: string
  ) => {
    setCompanyData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleCompanySubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    /*
     * This object is intentionally kept with the exact
     * backend field names we finalized.
     */
    const data: CompanyFormData = {
      name: companyData.name,
      type: companyData.type,
      address: companyData.address,
      billing_email: companyData.billing_email,
    };

    console.log("Company data:", data);

    /*
     * Backend API will be connected here.
     *
     * Backend logic:
     *
     * Company exists -> UPDATE
     * Company doesn't exist -> CREATE
     */
  };

  const handleDeleteSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const data = {
      name: deleteName,
    };

    console.log("Delete company:", data);

    /*
     * Delete API will be connected here.
     */
  };

  return (
    <section className={styles.container}>
      <div className={styles.card}>

        <h1 className={styles.title}>
          Manage Company
        </h1>

        {/* Form Switch */}
        <div className={styles.formSwitch}>

          <button
            type="button"
            className={
              activeForm === "add"
                ? styles.activeTab
                : styles.tab
            }
            onClick={() => setActiveForm("add")}
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
            onClick={() => setActiveForm("delete")}
          >
            Delete
          </button>

        </div>

        {/* ADD / UPDATE FORM */}

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
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
            >
              Submit
            </button>

          </form>
        )}

        {/* DELETE FORM */}

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
              />
            </div>

            <button
              type="submit"
              className={styles.deleteButton}
            >
              Delete
            </button>

          </form>
        )}

      </div>
    </section>
  );
}