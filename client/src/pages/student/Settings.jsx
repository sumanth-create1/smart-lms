import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  Feather,
  KeyRound,
  LogOut,
  Mail,
  Moon,
  Save,
  Shield,
  Sparkles,
  User,
  UserRound,
  Zap,
  LockKeyhole,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";

/* =====================================================
   STATIC DATA
===================================================== */

const PARTICLES = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${(index * 53) % 100}%`,
  delay: `${(index % 6) * 0.8}s`,
  duration: `${7 + (index % 4)}s`,
  size: `${2 + (index % 2)}px`,
}));

/* =====================================================
   HELPERS
===================================================== */

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

/* =====================================================
   INPUT FIELD
===================================================== */

function InputField({
  label,
  name,
  value,
  onChange,
  icon: Icon,
  type = "text",
  placeholder,
  disabled = false,
  rightElement,
  autoComplete = "off",
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500"
      >
        {label}
      </label>

      <div className="group relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-r from-[rgb(var(--theme-accent-rgb)/0)] via-[rgb(var(--theme-accent-rgb)/0)] to-[rgb(var(--theme-secondary-rgb)/0)] opacity-0 blur-sm transition-opacity duration-500 group-focus-within:from-[rgb(var(--theme-accent-rgb)/0.2)] group-focus-within:via-[rgb(var(--theme-accent-rgb)/0.1)] group-focus-within:to-[rgb(var(--theme-secondary-rgb)/0.1)] group-focus-within:opacity-100"
        />

        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"
          >
            <Icon
              size={17}
              className="text-slate-600 transition-colors duration-300 group-focus-within:text-[var(--theme-accent)]"
            />
          </div>

          <input
            id={name}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            className={`relative w-full rounded-xl border bg-[var(--theme-bg)] py-3.5 pl-11 pr-12 text-sm text-slate-200 outline-none transition-all duration-300 placeholder:text-slate-700 ${
              disabled
                ? "cursor-not-allowed border-white/[0.05] bg-white/[0.015] text-slate-600"
                : "border-white/[0.09] hover:border-white/[0.15] focus:border-[rgb(var(--theme-accent-rgb)/0.35)] focus:bg-[rgb(var(--theme-accent-rgb)/0.025)] focus:shadow-[0_0_30px_rgb(var(--theme-accent-rgb)/0.06)]"
            }`}
          />

          {rightElement && (
            <div className="absolute inset-y-0 right-0 z-10 flex items-center pr-3">
              {rightElement}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   PASSWORD INPUT
===================================================== */

function PasswordInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  visible,
  onToggle,
  icon: Icon = KeyRound,
  autoComplete,
  disabled = false,
}) {
  return (
    <InputField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      icon={Icon}
      type={visible ? "text" : "password"}
      placeholder={placeholder}
      disabled={disabled}
      autoComplete={autoComplete}
      rightElement={
        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
          className="rounded-lg p-1.5 text-slate-600 transition-colors duration-200 hover:bg-white/[0.04] hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      }
    />
  );
}

/* =====================================================
   PASSWORD REQUIREMENT
===================================================== */

function PasswordRequirement({ active, text }) {
  return (
    <div className="flex items-center gap-2">
      <div
        aria-hidden="true"
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
          active
            ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-400"
            : "border-white/[0.08] bg-white/[0.015] text-transparent"
        }`}
      >
        <Check size={9} />
      </div>

      <span
        className={`text-[10px] transition-colors duration-300 ${
          active ? "text-emerald-400/80" : "text-slate-600"
        }`}
      >
        {text}
      </span>
    </div>
  );
}

/* =====================================================
   FLOATING PARTICLES
===================================================== */

function FloatingParticles() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {PARTICLES.map((particle) => (
        <span
          key={particle.id}
          className="absolute animate-[particleFloat_linear_infinite] rounded-full bg-[rgb(var(--theme-accent-rgb)/0.25)] will-change-transform"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}
    </div>
  );
}

/* =====================================================
   TIME RING
===================================================== */

function TimeRing() {
  return (
    <div
      aria-hidden="true"
      className="relative h-40 w-40"
    >
      <div className="absolute inset-0 animate-[spin_40s_linear_infinite] rounded-full border border-[rgb(var(--theme-accent-rgb)/0.1)] border-dashed will-change-transform" />

      <div className="absolute inset-4 rounded-full border border-[rgb(var(--theme-secondary-rgb)/0.1)]" />

      <div className="absolute inset-8 rounded-full border border-[rgb(var(--theme-accent-rgb)/0.08)] bg-[rgb(var(--theme-accent-rgb)/0.015)]" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/[0.06] bg-[var(--theme-card)]">
          <Clock3
            size={24}
            className="text-[var(--theme-accent)]"
          />
        </div>
      </div>

      <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[var(--theme-accent)]" />

      <span className="absolute bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--theme-secondary)]" />
    </div>
  );
}

/* =====================================================
   SETTINGS
===================================================== */

function Settings() {
  const navigate = useNavigate();

  /* ===================================================
     PROFILE
  =================================================== */

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  /* ===================================================
     PASSWORD
  =================================================== */

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [changingPassword, setChangingPassword] = useState(false);

  /* ===================================================
     PROFILE FETCH
  =================================================== */

  useEffect(() => {
    const controller = new AbortController();

    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);

        const response = await api.get("/auth/me", {
          signal: controller.signal,
        });

        const user = response.data?.user;

        if (!user) {
          throw new Error("User information unavailable.");
        }

        setProfile({
          name: user.name || "",
          email: user.email || "",
        });
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Load profile error:", error);

        toast.error(
          getErrorMessage(
            error,
            "Unable to load your profile."
          )
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoadingProfile(false);
        }
      }
    };

    fetchProfile();

    return () => controller.abort();
  }, []);

  /* ===================================================
     PROFILE CHANGE
  =================================================== */

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* ===================================================
     SAVE PROFILE
  =================================================== */

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    if (savingProfile) return;

    const trimmedName = profile.name.trim();

    if (!trimmedName) {
      toast.error("Name cannot be empty.");
      return;
    }

    if (trimmedName.length < 2) {
      toast.error("Name must contain at least 2 characters.");
      return;
    }

    try {
      setSavingProfile(true);

      const response = await api.put("/auth/profile", {
        name: trimmedName,
      });

      const updatedUser = response.data?.user;

      if (updatedUser) {
        setProfile((previous) => {
          const nextName = updatedUser.name || trimmedName;
          const nextEmail =
            updatedUser.email || previous.email;

          if (
            previous.name === nextName &&
            previous.email === nextEmail
          ) {
            return previous;
          }

          return {
            name: nextName,
            email: nextEmail,
          };
        });
      } else {
        setProfile((previous) => {
          if (previous.name === trimmedName) {
            return previous;
          }

          return {
            ...previous,
            name: trimmedName,
          };
        });
      }

      toast.success(
        response.data?.message ||
          "Your identity has been updated."
      );
    } catch (error) {
      console.error("Update profile error:", error);

      toast.error(
        getErrorMessage(
          error,
          "Unable to update your profile."
        )
      );
    } finally {
      setSavingProfile(false);
    }
  };

  /* ===================================================
     PASSWORD CHANGE
  =================================================== */

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswords((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* ===================================================
     CHANGE PASSWORD
  =================================================== */

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (changingPassword) return;

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwords;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error(
        "New password must be different from your current password."
      );
      return;
    }

    try {
      setChangingPassword(true);

      const response = await api.patch(
        "/auth/change-password",
        {
          currentPassword,
          newPassword,
          confirmPassword,
        }
      );

      toast.success(
        response.data?.message ||
          "Password changed successfully."
      );

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPasswords({
        current: false,
        new: false,
        confirm: false,
      });
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      toast.error(
        getErrorMessage(
          error,
          "Unable to change your password."
        )
      );
    } finally {
      setChangingPassword(false);
    }
  };

  /* ===================================================
     PASSWORD VISIBILITY
  =================================================== */

  const togglePassword = (field) => {
    setShowPasswords((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  /* ===================================================
     PASSWORD STRENGTH
  =================================================== */

  const passwordStrength = useMemo(() => {
    const password = passwords.newPassword;

    if (!password) {
      return {
        label: "Awaiting new password",
        width: "0%",
      };
    }

    let score = 0;

    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) {
      return {
        label: "Weak",
        width: "25%",
      };
    }

    if (score <= 3) {
      return {
        label: "Moderate",
        width: "60%",
      };
    }

    return {
      label: "Strong",
      width: "100%",
    };
  }, [passwords.newPassword]);

  /* ===================================================
     LOGOUT
  =================================================== */

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");

      toast.success("The realm has been closed.");

      window.setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 500);
    } catch (error) {
      console.error("Logout error:", error);

      toast.error(
        getErrorMessage(error, "Unable to logout.")
      );
    }
  };

  /* ===================================================
     LOADING
  =================================================== */

  if (loadingProfile) {
    return (
      <div className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[var(--theme-bg)] text-[var(--theme-text)]">
        <FloatingParticles />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgb(var(--theme-accent-rgb)/0.07),transparent_42%)]"
        />

        <div className="relative z-10 mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-64 rounded-lg bg-white/[0.06]" />

            <div className="h-4 w-96 max-w-full rounded bg-white/[0.035]" />

            <div className="h-80 rounded-2xl border border-white/[0.07] bg-white/[0.025]" />

            <div className="h-[500px] rounded-2xl border border-white/[0.07] bg-white/[0.025]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[var(--theme-bg)] text-[var(--theme-text)]">
      {/* =================================================
          GLOBAL ATMOSPHERE
      ================================================= */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[rgb(var(--theme-accent-rgb)/0.025)] shadow-[0_0_140px_rgb(var(--theme-accent-rgb)/0.08)]" />

        <div className="absolute left-[5%] top-[30%] h-96 w-96 rounded-full bg-[rgb(var(--theme-secondary-rgb)/0.02)] blur-3xl" />

        <div className="absolute right-[20%] top-[45%] h-80 w-80 rounded-full bg-[rgb(var(--theme-accent-rgb)/0.025)] blur-3xl" />

        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 15% 20%, white 0.5px, transparent 0.8px),
              radial-gradient(circle at 80% 30%, white 0.5px, transparent 0.8px),
              radial-gradient(circle at 45% 75%, white 0.4px, transparent 0.7px)
            `,
            backgroundSize:
              "27px 27px, 37px 37px, 19px 19px",
          }}
        />

        <div className="absolute left-[8%] top-0 h-full w-px bg-gradient-to-b from-transparent via-[rgb(var(--theme-accent-rgb)/0.05)] to-transparent" />

        <div className="absolute right-[12%] top-0 h-full w-px bg-gradient-to-b from-transparent via-[rgb(var(--theme-secondary-rgb)/0.04)] to-transparent" />
      </div>

      <FloatingParticles />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="relative mb-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-[var(--theme-surface)]/90 p-5 shadow-[0_25px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-7">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[rgb(var(--theme-accent-rgb)/0.04)] blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-[rgb(var(--theme-secondary-rgb)/0.025)] blur-3xl"
          />

          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[rgb(var(--theme-accent-rgb)/0.2)] bg-[rgb(var(--theme-accent-rgb)/0.05)]">
                  <Shield
                    size={20}
                    className="text-[var(--theme-accent)]"
                  />

                  <span className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-[var(--theme-secondary)]" />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-[rgb(var(--theme-accent-rgb)/0.6)]">
                    THE MAESTER'S RECORD
                  </p>

                  <p className="mt-1 text-[9px] uppercase tracking-[0.25em] text-slate-700">
                    Identity · Security · Time
                  </p>
                </div>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">
                Account Settings
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                Every realm has its secrets. Guard yours
                carefully. Keep your identity secure and your
                record prepared for whatever lies beyond the
                wall.
              </p>
            </div>

            <div className="hidden shrink-0 sm:block">
              <TimeRing />
            </div>
          </div>

          <div
            aria-hidden="true"
            className="relative mt-7 h-px overflow-hidden bg-white/[0.05]"
          >
            <div className="absolute left-0 top-0 h-full w-1/3 animate-[timelineMove_5s_linear_infinite] bg-gradient-to-r from-transparent via-[rgb(var(--theme-accent-rgb)/0.5)] to-transparent will-change-transform" />
          </div>
        </div>

        {/* =================================================
            IDENTITY
        ================================================= */}

        <section className="relative mb-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-[var(--theme-surface)]/90 shadow-[0_25px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--theme-accent-rgb)/0.4)] to-transparent"
          />

          <div className="relative p-5 sm:p-7">
            <div className="mb-7 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-[rgb(var(--theme-accent-rgb)/0.15)] bg-[rgb(var(--theme-accent-rgb)/0.04)]">
                  <UserRound
                    size={21}
                    className="text-[rgb(var(--theme-accent-rgb)/0.8)]"
                  />

                  <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-slate-100">
                      Your Identity
                    </h2>

                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.04] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.15em] text-emerald-400">
                      Verified
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-600">
                    Manage the identity attached to your
                    learning record.
                  </p>
                </div>
              </div>

              <Feather
                size={20}
                aria-hidden="true"
                className="hidden text-slate-700 sm:block"
              />
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label="Name"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  icon={User}
                  placeholder="Enter your name"
                  autoComplete="name"
                  disabled={savingProfile}
                />

                <InputField
                  label="Email address"
                  name="email"
                  value={profile.email}
                  onChange={() => {}}
                  icon={Mail}
                  disabled
                  autoComplete="email"
                />
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-xl border border-[rgb(var(--theme-accent-rgb)/0.1)] bg-[rgb(var(--theme-accent-rgb)/0.02)] p-4">
                <Shield
                  size={15}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[rgb(var(--theme-accent-rgb)/0.6)]"
                />

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgb(var(--theme-accent-rgb)/0.6)]">
                    Protected Record
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Your email is linked to your account identity
                    and cannot be changed from this record.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 rounded-xl border border-[rgb(var(--theme-secondary-rgb)/0.2)] bg-[rgb(var(--theme-secondary-rgb)/0.05)] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--theme-secondary)] transition-all duration-300 hover:border-[rgb(var(--theme-secondary-rgb)/0.4)] hover:bg-[rgb(var(--theme-secondary-rgb)/0.09)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingProfile ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[rgb(var(--theme-secondary-rgb)/0.2)] border-t-[var(--theme-secondary)]" />
                      Saving
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* =================================================
            PASSWORD
        ================================================= */}

        <section className="relative mb-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-[var(--theme-surface)]/90 shadow-[0_25px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--theme-secondary-rgb)/0.35)] to-transparent"
          />

          <div className="relative p-5 sm:p-7">
            <div className="mb-7 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-[rgb(var(--theme-secondary-rgb)/0.15)] bg-[rgb(var(--theme-secondary-rgb)/0.04)]">
                  <KeyRound
                    size={21}
                    className="text-[rgb(var(--theme-secondary-rgb)/0.8)]"
                  />

                  <span
                    aria-hidden="true"
                    className="absolute -right-1 -top-1"
                  >
                    <Zap
                      size={10}
                      className="animate-pulse text-[var(--theme-secondary)]"
                    />
                  </span>
                </div>

                <div>
                  <h2 className="text-base font-semibold text-slate-100">
                    Change Password
                  </h2>

                  <p className="mt-1 text-xs text-slate-600">
                    Strengthen the walls protecting your account.
                  </p>
                </div>
              </div>

              <LockKeyhole
                size={19}
                aria-hidden="true"
                className="hidden text-slate-700 sm:block"
              />
            </div>

            <form onSubmit={handleChangePassword}>
              <div className="space-y-5">
                <PasswordInput
                  label="Current password"
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  visible={showPasswords.current}
                  onToggle={() => togglePassword("current")}
                  autoComplete="current-password"
                  disabled={changingPassword}
                />

                <PasswordInput
                  label="New password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  visible={showPasswords.new}
                  onToggle={() => togglePassword("new")}
                  icon={Shield}
                  autoComplete="new-password"
                  disabled={changingPassword}
                />

                {passwords.newPassword && (
                  <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                        Defense strength
                      </span>

                      <span className="text-[10px] font-semibold text-slate-400">
                        {passwordStrength.label}
                      </span>
                    </div>

                    <div className="relative h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                      <div
                        className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-[width] duration-700"
                        style={{
                          width: passwordStrength.width,
                        }}
                      />
                    </div>
                  </div>
                )}

                <PasswordInput
                  label="Confirm new password"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm your new password"
                  visible={showPasswords.confirm}
                  onToggle={() => togglePassword("confirm")}
                  icon={
                    passwords.confirmPassword &&
                    passwords.newPassword ===
                      passwords.confirmPassword
                      ? Check
                      : KeyRound
                  }
                  autoComplete="new-password"
                  disabled={changingPassword}
                />
              </div>

              <div className="mt-6 rounded-xl border border-white/[0.06] bg-black/20 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles
                    size={13}
                    aria-hidden="true"
                    className="text-[rgb(var(--theme-accent-rgb)/0.6)]"
                  />

                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                    Password requirements
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <PasswordRequirement
                    active={passwords.newPassword.length >= 6}
                    text="At least 6 characters"
                  />

                  <PasswordRequirement
                    active={
                      passwords.newPassword.length > 0 &&
                      /[A-Z]/.test(passwords.newPassword)
                    }
                    text="Include an uppercase letter"
                  />

                  <PasswordRequirement
                    active={
                      passwords.newPassword.length > 0 &&
                      /[0-9]/.test(passwords.newPassword)
                    }
                    text="Include a number"
                  />

                  <PasswordRequirement
                    active={
                      passwords.confirmPassword.length > 0 &&
                      passwords.newPassword ===
                        passwords.confirmPassword
                    }
                    text="Passwords match"
                  />
                </div>
              </div>

              <div className="mt-7 flex justify-end">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="inline-flex items-center gap-2 rounded-xl border border-[rgb(var(--theme-accent-rgb)/0.2)] bg-[rgb(var(--theme-accent-rgb)/0.04)] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--theme-accent)] transition-all duration-300 hover:border-[rgb(var(--theme-accent-rgb)/0.4)] hover:bg-[rgb(var(--theme-accent-rgb)/0.08)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {changingPassword ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[rgb(var(--theme-accent-rgb)/0.2)] border-t-[var(--theme-accent)]" />
                      Updating
                    </>
                  ) : (
                    <>
                      <KeyRound size={14} />
                      Change Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* =================================================
            SECURITY NOTICE
        ================================================= */}

        <section className="relative mb-6 overflow-hidden rounded-2xl border border-[rgb(var(--theme-secondary-rgb)/0.1)] bg-[rgb(var(--theme-secondary-rgb)/0.018)]">
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 top-0 w-px bg-gradient-to-b from-transparent via-[rgb(var(--theme-secondary-rgb)/0.5)] to-transparent"
          />

          <div className="relative flex gap-4 p-5 sm:p-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[rgb(var(--theme-secondary-rgb)/0.15)] bg-[rgb(var(--theme-secondary-rgb)/0.04)]">
              <AlertTriangle
                size={17}
                aria-hidden="true"
                className="text-[rgb(var(--theme-secondary-rgb)/0.7)]"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-300">
                  Guard the realm
                </h3>

                <Moon
                  size={12}
                  aria-hidden="true"
                  className="text-slate-700"
                />
              </div>

              <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-600">
                Never share your password or authentication
                details. Your account protects your courses,
                progress, achievements, and learning history.
              </p>
            </div>
          </div>
        </section>

        {/* =================================================
            LOGOUT
        ================================================= */}

        <section className="relative overflow-hidden rounded-2xl border border-red-400/10 bg-red-400/[0.015]">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/20 to-transparent"
          />

          <div className="relative p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-400/15 bg-red-400/[0.035]">
                  <LogOut
                    size={18}
                    className="text-red-400/70"
                  />

                  <span
                    aria-hidden="true"
                    className="absolute -right-1 -top-1 h-1.5 w-1.5 animate-pulse rounded-full bg-red-400"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-300">
                    Leave the Realm
                  </h3>

                  <p className="mt-1 text-xs text-slate-600">
                    End your current session on this device.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="group/logout inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.03] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-red-400/80 transition-all duration-300 hover:border-red-400/40 hover:bg-red-400/[0.07] hover:text-red-300"
              >
                <LogOut
                  size={14}
                  className="transition-transform duration-300 group-hover/logout:translate-x-0.5"
                />

                Logout
              </button>
            </div>
          </div>
        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="flex items-center justify-center gap-4 py-9">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-slate-800" />

          <div className="flex items-center gap-2">
            <Feather
              size={11}
              aria-hidden="true"
              className="text-slate-700"
            />

            <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-slate-700">
              Beyond the Wall · Beyond Time
            </span>

            <Clock3
              size={11}
              aria-hidden="true"
              className="text-slate-700"
            />
          </div>

          <div className="h-px w-20 bg-gradient-to-l from-transparent to-slate-800" />
        </div>
      </div>

      <style>{`
        @keyframes particleFloat {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 0;
          }

          15% {
            opacity: 0.6;
          }

          50% {
            transform: translate3d(18px, -35px, 0);
            opacity: 0.35;
          }

          85% {
            opacity: 0.5;
          }

          100% {
            transform: translate3d(-10px, -70px, 0);
            opacity: 0;
          }
        }

        @keyframes timelineMove {
          0% {
            transform: translate3d(-120%, 0, 0);
          }

          100% {
            transform: translate3d(400%, 0, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-pulse,
          .animate-spin,
          [class*="animate-[particleFloat"],
          [class*="animate-[timelineMove"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Settings;