"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";
import {
  AuthResponse,
  LoginRequest,
} from "@/types/auth";

import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const router = useRouter();

  const [form_data, set_form_data] =
    useState<LoginRequest>({
      email: "",
      password: "",
    });

  const [error, set_error] = useState("");
  const [loading, set_loading] = useState(false);

  function handle_change(
    event: React.ChangeEvent<HTMLInputElement>
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
      !form_data.email ||
      !form_data.password
    ) {
      set_error(
        "Please enter email and password."
      );
      return;
    }

    try {
      set_loading(true);

      await apiRequest<AuthResponse>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(form_data),
        }
      );

      router.push("/");
      router.refresh();
    } catch (error) {
      set_error(
        error instanceof Error
          ? error.message
          : "Unable to login."
      );
    } finally {
      set_loading(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>

        {/* Left Section */}
        <section className={styles.brand_section}>
          <div>
            <h1>Fernleaf Kitchen</h1>

            <p>
              A smart kitchen management system
              for managing your operations
              efficiently.
            </p>
          </div>
        </section>

        {/* Right Section */}
        <section className={styles.form_section}>

          <div className={styles.heading}>
            <h2>Welcome Back</h2>

            <p>
              Login to continue to your account.
            </p>
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <form onSubmit={handle_submit}>

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

            <div className={styles.field}>
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form_data.password}
                onChange={handle_change}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className={styles.submit_button}
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Login"}
            </button>

          </form>

          <div className={styles.bottom_text}>
            <span>
              Don't have an account?
            </span>

            <Link href="/signup">
              Sign up
            </Link>
          </div>

        </section>
      </div>
    </main>
  );
}