import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  Clock3,
  Eye,
  EyeOff,
  Feather,
  KeyRound,
  LockKeyhole,
  LogOut,
  Mail,
  Moon,
  Save,
  Shield,
  Sparkles,
  User,
  UserRound,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";

// =====================================================
// INPUT FIELD
// IMPORTANT:
// Keep this OUTSIDE Settings.
// This prevents the input from being remounted on every
// keystroke and fixes the cursor/focus problem.
// =====================================================

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
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
        {label}
      </label>

      <div className="group relative">
        {/* Outer atmospheric glow */}
        <div className="pointer-events-none absolute -inset-[1px] rounded-xl bg-gradient-to-r from-cyan-400/0 via-cyan-400/0 to-amber-400/0 opacity-0 blur-sm transition-all duration-500 group-focus-within:from-cyan-400/20 group-focus-within:via-cyan-300/10 group-focus-within:to-amber-400/10 group-focus-within:opacity-100" />

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Icon
              size={17}
              className="text-slate-600 transition-all duration-300 group-focus-within:scale-110 group-focus-within:text-cyan-300"
            />
          </div>

          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
            className={`relative w-full rounded-xl border bg-[#070a0d]/90 py-3.5 pl-11 pr-12 text-sm text-slate-200 outline-none transition-all duration-300 placeholder:text-slate-700 ${
              disabled
                ? "cursor-not-allowed border-white/[0.05] bg-white/[0.015] text-slate-600"
                : "border-white/[0.09] hover:border-white/[0.15] focus:border-cyan-300/30 focus:bg-cyan-400/[0.025] focus:shadow-[0_0_30px_rgba(34,211,238,0.06)]"
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

// =====================================================
// PASSWORD REQUIREMENT
// =====================================================

function PasswordRequirement({ active, text }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
          active
            ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.12)]"
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

// =====================================================
// FLOATING PARTICLES
// =====================================================

function FloatingParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, index) => ({
        id: index,
        left: `${(index * 37) % 100}%`,
        top: `${(index * 53) % 100}%`,
        delay: `${(index % 8) * 0.7}s`,
        duration: `${5 + (index % 6)}s`,
        size: `${2 + (index % 3)}px`,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute animate-[particleFloat_linear_infinite] rounded-full bg-cyan-200/30"
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

// =====================================================
// TIME RING
// =====================================================

function TimeRing() {
  return (
    <div className="relative h-44 w-44">
      <div className="absolute inset-0 animate-[spin_30s_linear_infinite] rounded-full border border-cyan-300/10 border-dashed" />

      <div className="absolute inset-3 animate-[spin_20s_linear_infinite_reverse] rounded-full border border-amber-300/10" />

      <div className="absolute inset-7 rounded-full border border-cyan-300/10 bg-cyan-400/[0.015] shadow-[0_0_70px_rgba(34,211,238,0.05)]" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-slate-600/30 bg-[#080b0e] shadow-[0_0_35px_rgba(34,211,238,0.06)]">
          <Clock3
            size={25}
            className="text-cyan-300/70"
          />

          <div className="absolute inset-0 animate-ping rounded-full border border-cyan-300/10" />
        </div>
      </div>

      {/* Orbit dots */}
      <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.8)]" />

      <span className="absolute bottom-3 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-amber-300/70" />

      <span className="absolute left-2 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-cyan-300/60" />

      <span className="absolute right-2 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-amber-300/60" />
    </div>
  );
}

// =====================================================
// SETTINGS
// =====================================================

function Settings() {
  const navigate = useNavigate();

  // ===================================================
  // PROFILE
  // ===================================================

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  // ===================================================
  // PASSWORD
  // ===================================================

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

  // ===================================================
  // PROFILE FETCH
  // ===================================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);

        const response = await api.get("/auth/me");

        const user = response.data?.user;

        if (!user) {
          throw new Error("User information unavailable.");
        }

        setProfile({
          name: user.name || "",
          email: user.email || "",
        });
      } catch (error) {
        console.error("Load profile error:", error);

        toast.error(
          error.response?.data?.message ||
            "Unable to load your profile."
        );
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  // ===================================================
  // PROFILE CHANGE
  // ===================================================

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===================================================
  // SAVE PROFILE
  // ===================================================

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    const trimmedName = profile.name.trim();

    if (!trimmedName) {
      toast.error("Name cannot be empty.");
      return;
    }

    try {
      setSavingProfile(true);

      const response = await api.put("/auth/profile", {
        name: trimmedName,
      });

      const updatedUser = response.data?.user;

      if (updatedUser) {
        setProfile((prev) => ({
          ...prev,
          name: updatedUser.name || trimmedName,
          email: updatedUser.email || prev.email,
        }));
      }

      toast.success(
        response.data?.message ||
          "Your identity has been updated."
      );
    } catch (error) {
      console.error("Update profile error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  // ===================================================
  // PASSWORD CHANGE
  // ===================================================

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===================================================
  // CHANGE PASSWORD
  // ===================================================

  const handleChangePassword = async (e) => {
    e.preventDefault();

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
    } catch (error) {
      console.error("Change password error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to change your password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // ===================================================
  // PASSWORD VISIBILITY
  // ===================================================

  const togglePassword = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // ===================================================
  // PASSWORD STRENGTH
  // ===================================================

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

  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");

      toast.success("The realm has been closed.");

      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (error) {
      console.error("Logout error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to logout."
      );
    }
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loadingProfile) {
    return (
      <div className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#050709] text-slate-200">
        <FloatingParticles />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.07),transparent_42%)]" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-64 rounded-lg bg-white/[0.06]" />

            <div className="h-4 w-96 rounded bg-white/[0.035]" />

            <div className="h-80 rounded-2xl border border-white/[0.07] bg-white/[0.025]" />

            <div className="h-[500px] rounded-2xl border border-white/[0.07] bg-white/[0.025]" />
          </div>
        </div>
      </div>
    );
  }

  // ===================================================
  // MAIN UI
  // ===================================================

  return (
    <div className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#050709] text-slate-200">
      {/* =================================================
          GLOBAL ATMOSPHERE
      ================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Cyan moon */}
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-300/[0.025] shadow-[0_0_140px_rgba(103,232,249,0.08)]" />

        {/* Amber fire */}
        <div className="absolute left-[5%] top-[30%] h-96 w-96 rounded-full bg-amber-500/[0.02] blur-3xl" />

        {/* Deep blue */}
        <div className="absolute right-[20%] top-[45%] h-80 w-80 rounded-full bg-blue-700/[0.025] blur-3xl" />

        {/* Fog */}
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Stone texture */}
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

        {/* Vertical time lines */}
        <div className="absolute left-[8%] top-0 h-full w-px bg-gradient-to-b from-transparent via-cyan-300/[0.05] to-transparent" />

        <div className="absolute right-[12%] top-0 h-full w-px bg-gradient-to-b from-transparent via-amber-300/[0.04] to-transparent" />
      </div>

      <FloatingParticles />

      {/* =================================================
          MAIN
      ================================================= */}

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="relative mb-10 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080b0e]/80 p-5 shadow-[0_25px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-7">
          {/* Header glow */}
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-cyan-300/[0.04] blur-3xl" />

          <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-amber-400/[0.025] blur-3xl" />

          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.05]">
                  <Shield
                    size={20}
                    className="text-cyan-300"
                  />

                  <span className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.8)]" />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-cyan-300/60">
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
                Every realm has its secrets. Guard yours carefully.
                Keep your identity secure and your record prepared
                for whatever lies beyond the wall.
              </p>
            </div>

            {/* Time visual */}
            <div className="hidden shrink-0 sm:block">
              <TimeRing />
            </div>
          </div>

          {/* Timeline */}
          <div className="relative mt-7 h-px overflow-hidden bg-white/[0.05]">
            <div className="absolute left-0 top-0 h-full w-1/3 animate-[timelineMove_5s_linear_infinite] bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
          </div>
        </div>

        {/* =================================================
            IDENTITY
        ================================================= */}

        <section className="group relative mb-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080b0e]/90 shadow-[0_25px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          {/* Top accent */}
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />

          {/* Hover sweep */}
          <div className="pointer-events-none absolute -left-full top-0 h-full w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-cyan-300/[0.025] to-transparent transition-all duration-1000 group-hover:left-[130%]" />

          <div className="relative p-5 sm:p-7">
            {/* Section heading */}
            <div className="mb-7 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.04]">
                  <UserRound
                    size={21}
                    className="text-cyan-300/80"
                  />

                  <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
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
                    Manage the identity attached to your learning
                    record.
                  </p>
                </div>
              </div>

              <Feather
                size={20}
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
                />

                <InputField
                  label="Email address"
                  name="email"
                  value={profile.email}
                  onChange={() => {}}
                  icon={Mail}
                  disabled
                />
              </div>

              {/* Email protection */}
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-cyan-300/10 bg-cyan-300/[0.02] p-4">
                <LockKeyhole
                  size={15}
                  className="mt-0.5 shrink-0 text-cyan-300/60"
                />

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300/60">
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
                  className="group/button relative inline-flex items-center gap-2 overflow-hidden rounded-xl border border-amber-300/20 bg-amber-300/[0.05] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300 transition-all duration-300 hover:border-amber-300/40 hover:bg-amber-300/[0.09] hover:shadow-[0_0_35px_rgba(245,158,11,0.08)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent transition-transform duration-700 group-hover/button:translate-x-full" />

                  {savingProfile ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-300/20 border-t-amber-300" />
                      Saving
                    </>
                  ) : (
                    <>
                      <Save
                        size={14}
                        className="relative transition-transform duration-300 group-hover/button:-translate-y-0.5"
                      />
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

        <section className="group relative mb-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080b0e]/90 shadow-[0_25px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/35 to-transparent" />

          {/* Ambient glow */}
          <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-amber-400/[0.025] blur-3xl" />

          <div className="relative p-5 sm:p-7">
            {/* Heading */}
            <div className="mb-7 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-amber-300/15 bg-amber-300/[0.04]">
                  <KeyRound
                    size={21}
                    className="text-amber-300/80"
                  />

                  <span className="absolute -right-1 -top-1">
                    <Zap
                      size={10}
                      className="animate-pulse text-amber-300"
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
                className="hidden text-slate-700 sm:block"
              />
            </div>

            <form onSubmit={handleChangePassword}>
              <div className="space-y-5">
                {/* Current password */}
                <InputField
                  label="Current password"
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  icon={KeyRound}
                  type={
                    showPasswords.current
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter current password"
                  rightElement={
                    <button
                      type="button"
                      onClick={() =>
                        togglePassword("current")
                      }
                      className="rounded-lg p-1.5 text-slate-600 transition-all duration-200 hover:bg-white/[0.04] hover:text-slate-300"
                    >
                      {showPasswords.current ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  }
                />

                {/* New password */}
                <InputField
                  label="New password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  icon={Shield}
                  type={
                    showPasswords.new
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter new password"
                  rightElement={
                    <button
                      type="button"
                      onClick={() => togglePassword("new")}
                      className="rounded-lg p-1.5 text-slate-600 transition-all duration-200 hover:bg-white/[0.04] hover:text-slate-300"
                    >
                      {showPasswords.new ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  }
                />

                {/* Strength */}
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
                        className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-all duration-700"
                        style={{
                          width:
                            passwordStrength.width,
                        }}
                      />

                      <div className="absolute inset-0 animate-[shimmer_2s_linear_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </div>
                  </div>
                )}

                {/* Confirm */}
                <InputField
                  label="Confirm new password"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  icon={
                    passwords.confirmPassword &&
                    passwords.newPassword ===
                      passwords.confirmPassword
                      ? Check
                      : KeyRound
                  }
                  type={
                    showPasswords.confirm
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your new password"
                  rightElement={
                    <button
                      type="button"
                      onClick={() =>
                        togglePassword("confirm")
                      }
                      className="rounded-lg p-1.5 text-slate-600 transition-all duration-200 hover:bg-white/[0.04] hover:text-slate-300"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  }
                />
              </div>

              {/* Requirements */}
              <div className="mt-6 rounded-xl border border-white/[0.06] bg-black/20 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles
                    size={13}
                    className="text-cyan-300/60"
                  />

                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                    Password requirements
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <PasswordRequirement
                    active={
                      passwords.newPassword.length >= 6
                    }
                    text="At least 6 characters"
                  />

                  <PasswordRequirement
                    active={
                      passwords.newPassword &&
                      /[A-Z]/.test(passwords.newPassword)
                    }
                    text="Include an uppercase letter"
                  />

                  <PasswordRequirement
                    active={
                      passwords.newPassword &&
                      /[0-9]/.test(passwords.newPassword)
                    }
                    text="Include a number"
                  />

                  <PasswordRequirement
                    active={
                      passwords.confirmPassword &&
                      passwords.newPassword ===
                        passwords.confirmPassword
                    }
                    text="Passwords match"
                  />
                </div>
              </div>

              {/* Change button */}
              <div className="mt-7 flex justify-end">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="group/button relative inline-flex items-center gap-2 overflow-hidden rounded-xl border border-cyan-300/20 bg-cyan-300/[0.04] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300 transition-all duration-300 hover:border-cyan-300/40 hover:bg-cyan-300/[0.08] hover:shadow-[0_0_35px_rgba(34,211,238,0.08)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-200/[0.05] to-transparent transition-transform duration-700 group-hover/button:translate-x-full" />

                  {changingPassword ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-300/20 border-t-cyan-300" />
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

        <section className="relative mb-6 overflow-hidden rounded-2xl border border-amber-300/10 bg-amber-300/[0.018]">
          <div className="absolute bottom-0 left-0 top-0 w-px bg-gradient-to-b from-transparent via-amber-300/50 to-transparent" />

          <div className="relative flex gap-4 p-5 sm:p-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-300/15 bg-amber-300/[0.04]">
              <AlertTriangle
                size={17}
                className="text-amber-300/70"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-300">
                  Guard the realm
                </h3>

                <Moon
                  size={12}
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

        <section className="group relative overflow-hidden rounded-2xl border border-red-400/10 bg-red-400/[0.015]">
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/20 to-transparent" />

          <div className="relative p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-400/15 bg-red-400/[0.035]">
                  <LogOut
                    size={18}
                    className="text-red-400/70"
                  />

                  <span className="absolute -right-1 -top-1 h-1.5 w-1.5 animate-pulse rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.7)]" />
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
                className="group/logout inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.03] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-red-400/80 transition-all duration-300 hover:border-red-400/40 hover:bg-red-400/[0.07] hover:text-red-300 hover:shadow-[0_0_30px_rgba(248,113,113,0.07)]"
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
              className="text-slate-700"
            />

            <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-slate-700">
              Beyond the Wall · Beyond Time
            </span>

            <Clock3
              size={11}
              className="text-slate-700"
            />
          </div>

          <div className="h-px w-20 bg-gradient-to-l from-transparent to-slate-800" />
        </div>
      </div>

      {/* =================================================
          CUSTOM ANIMATIONS
      ================================================= */}

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
            transform: translateX(-120%);
          }

          100% {
            transform: translateX(400%);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }

          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  );
}

export default Settings;