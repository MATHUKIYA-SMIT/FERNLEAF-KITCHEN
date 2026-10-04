"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";

import {
  AuthResponse,
  SignupRequest,
  UserRole,
} from "@/types/auth";

import styles from "./SignupForm.module.css";

const roles: UserRole[] = [
  "Admin",
  "Kitchen",
  "Dispatch",
  "Driver",
];

export default function SignupForm() {
  const router = useRouter();

  const [form_data, set_form_data] =
    useState<SignupRequest>({
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      role: "Kitchen",
    });

  const [error, set_error] = useState("");
  const [loading, set_loading] = useState(false);

  function handle_change(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    set_form_data((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handle_submit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    set_error("");

    if (
      !form_data.name ||
      !form_data.email ||
      !form_data.password ||
      !form_data.confirm_password ||
      !form_data.role
    ) {
      set_error(
        "Please fill in all fields."
      );
      return;
    }

    if (
      form_data.password !==
      form_data.confirm_password
    ) {
      set_error(
        "Passwords do not match."
      );
      return;
    }

    if (form_data.password.length < 6) {
      set_error(
        "Password must contain at least 6 characters."
      );
      return;
    }

    try {
      set_loading(true);

      const response =
        await apiRequest<AuthResponse>(
          "/auth/signup",
          {
            method: "POST",
            body: JSON.stringify(form_data),
          }
        );

      alert(response.message);

      router.push("/login");
    } catch (error) {
      set_error(
        error instanceof Error
          ? error.message
          : "Unable to create account."
      );
    } finally {
      set_loading(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>

        {/* LEFT */}
        <section className={styles.brand_section}>

          <div>
            <h1>Fernleaf Kitchen</h1>

            <p>
              Create your account and join
              the kitchen management system.
            </p>

            <div className={styles.role_info}>

              <span>
                Available Roles
              </span>

              <div className={styles.role_list}>
                {roles.map((role) => (
                  <span key={role}>
                    {role}
                  </span>
                ))}
              </div>

            </div>
          </div>

        </section>

        {/* RIGHT */}
        <section className={styles.form_section}>

          <div className={styles.heading}>
            <h2>Create Account</h2>

            <p>
              Your account requires admin
              approval before login.
            </p>
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <form onSubmit={handle_submit}>

            {/* USERNAME */}

            <div className={styles.field}>
              <label htmlFor="name">
                Username
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your username"
                value={form_data.name}
                onChange={handle_change}
                autoComplete="username"
              />
            </div>

            {/* EMAIL */}

            <div className={styles.field}>
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form_data.email}
                onChange={handle_change}
                autoComplete="email"
              />
            </div>

            {/* PASSWORD */}

            <div className={styles.field}>
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={form_data.password}
                onChange={handle_change}
                autoComplete="new-password"
              />
            </div>

            {/* CONFIRM PASSWORD */}

            <div className={styles.field}>
              <label htmlFor="confirm_password">
                Confirm Password
              </label>

              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                placeholder="Confirm your password"
                value={form_data.confirm_password}
                onChange={handle_change}
                autoComplete="new-password"
              />
            </div>

            {/* ROLE */}

            <div className={styles.field}>
              <label htmlFor="role">
                Role
              </label>

              <select
                id="role"
                name="role"
                value={form_data.role}
                onChange={handle_change}
              >
                {roles.map((role) => (
                  <option
                    key={role}
                    value={role}
                  >
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className={styles.submit_button}
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Sign Up"}
            </button>

          </form>

          <div className={styles.bottom_text}>
            <span>
              Already have an account?
            </span>

            <Link href="/login">
              Login
            </Link>
          </div>

        </section>
      </div>
    </main>
  );
}