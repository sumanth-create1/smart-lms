import { useEffect, useMemo, useState } from "react";
import {
  AtSign,
  CalendarDays,
  Check,
  CheckCircle2,
  Crown,
  Eye,
  EyeOff,
  Flame,
  LoaderCircle,
  Lock,
  Mail,
  Pencil,
  Save,
  Shield,
  Sparkles,
  Sword,
  User,
  X,
  Zap,
} from "lucide-react";

import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";

import {
  updateProfile,
  changePassword,
  changeEmail,
} from "../../services/profileService";

// ======================================================
// AVATARS
// ======================================================

const AVATARS = [
  {
    id: "knight",
    name: "The Knight",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Knight&backgroundColor=1a1a1a",
  },
  {
    id: "warrior",
    name: "The Warrior",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Warrior&backgroundColor=1a1a1a",
  },
  {
    id: "mage",
    name: "The Mage",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Mage&backgroundColor=1a1a1a",
  },
  {
    id: "king",
    name: "The King",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=King&backgroundColor=1a1a1a",
  },
  {
    id: "ranger",
    name: "The Ranger",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Ranger&backgroundColor=1a1a1a",
  },
  {
    id: "rogue",
    name: "The Rogue",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Rogue&backgroundColor=1a1a1a",
  },
  {
    id: "paladin",
    name: "The Paladin",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Paladin&backgroundColor=1a1a1a",
  },
  {
    id: "wizard",
    name: "The Wizard",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Wizard&backgroundColor=1a1a1a",
  },
  {
    id: "guardian",
    name: "The Guardian",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Guardian&backgroundColor=1a1a1a",
  },
  {
    id: "hunter",
    name: "The Hunter",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Hunter&backgroundColor=1a1a1a",
  },
  {
    id: "captain",
    name: "The Captain",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Captain&backgroundColor=1a1a1a",
  },
  {
    id: "lord",
    name: "The Lord",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Lord&backgroundColor=1a1a1a",
  },
];

// ======================================================
// HELPERS
// ======================================================

const formatDate = (date) => {
  if (!date) return "Unknown";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name = "") => {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U"
  );
};

// ======================================================
// MAIN COMPONENT
// ======================================================

const Profile = () => {
  const { user } = useAuth();

  // ====================================================
  // PROFILE STATE
  // ====================================================

  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(
    AVATARS[0].url
  );

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // ====================================================
  // PASSWORD STATE
  // ====================================================

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  // ====================================================
  // EMAIL STATE
  // ====================================================

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [changingEmail, setChangingEmail] = useState(false);

  // ====================================================
  // AVATAR STATE
  // ====================================================

  const [showAvatarPicker, setShowAvatarPicker] =
    useState(false);

  // ====================================================
  // INITIALIZE USER DATA
  // ====================================================

  useEffect(() => {
    if (!user) return;

    setName(user.name || "");

    const existingAvatar =
      user.avatar?.url ||
      user.avatar ||
      AVATARS[0].url;

    setSelectedAvatar(existingAvatar);
  }, [user]);

  // ====================================================
  // PROFILE COMPLETION
  // ====================================================

  const completion = useMemo(() => {
    if (!user) return 0;

    const fields = [
      Boolean(name?.trim()),
      Boolean(user.email),
      Boolean(selectedAvatar),
      Boolean(user.isVerified),
    ];

    const completed = fields.filter(Boolean).length;

    return Math.round((completed / fields.length) * 100);
  }, [name, selectedAvatar, user]);

  // ====================================================
  // PROFILE SAVE
  // ====================================================

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Please enter your name.");
      return;
    }

    if (trimmedName.length < 2) {
      toast.error("Name must contain at least 2 characters.");
      return;
    }

    try {
      setSavingProfile(true);

      const response = await updateProfile({
        name: trimmedName,
        avatar: selectedAvatar,
      });

      toast.success(
        response?.message ||
          "Your profile has been updated."
      );

      setIsEditingProfile(false);
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  // ====================================================
  // CHANGE EMAIL
  // ====================================================

  const handleChangeEmail = async (event) => {
    event.preventDefault();

    const email = newEmail.trim().toLowerCase();

    if (!email) {
      toast.error("Please enter a new email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (
      email === user?.email?.trim().toLowerCase()
    ) {
      toast.error(
        "This is already your current email."
      );
      return;
    }

    try {
      setChangingEmail(true);

      const response = await changeEmail({
        newEmail: email,
      });

      toast.success(
        response?.message ||
          "Verification email sent to your new address."
      );

      setNewEmail("");
    } catch (error) {
      console.error("Email change error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to change email."
      );
    } finally {
      setChangingEmail(false);
    }
  };

  // ====================================================
  // CHANGE PASSWORD
  // ====================================================

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (!currentPassword) {
      toast.error("Enter your current password.");
      return;
    }

    if (!newPassword) {
      toast.error("Enter a new password.");
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

      const response = await changePassword({
        currentPassword,
        newPassword,
      });

      toast.success(
        response?.message ||
          "Password changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Change password error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // ====================================================
  // SELECT AVATAR
  // ====================================================

  const handleAvatarSelect = (avatarUrl) => {
    setSelectedAvatar(avatarUrl);
    setShowAvatarPicker(false);

    if (!isEditingProfile) {
      setIsEditingProfile(true);
    }
  };

  // ====================================================
  // CANCEL PROFILE EDIT
  // ====================================================

  const handleCancelEdit = () => {
    setName(user?.name || "");

    setSelectedAvatar(
      user?.avatar?.url ||
        user?.avatar ||
        AVATARS[0].url
    );

    setIsEditingProfile(false);
  };

  // ====================================================
  // PASSWORD INPUT COMPONENT
  // ====================================================

  const PasswordInput = ({
    label,
    value,
    onChange,
    visible,
    setVisible,
    placeholder,
  }) => {
    return (
      <div>
        <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
          {label}
        </label>

        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-700" />

          <input
            type={visible ? "text" : "password"}
            value={value}
            onChange={(event) =>
              onChange(event.target.value)
            }
            placeholder={placeholder}
            disabled={changingPassword}
            className="w-full rounded-xl border border-slate-800 bg-[#050607] py-3.5 pl-11 pr-12 text-sm text-slate-200 outline-none transition-all duration-300 placeholder:text-slate-700 focus:border-red-500/30 focus:ring-2 focus:ring-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
          />

          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-600 transition hover:bg-slate-800/50 hover:text-slate-300"
          >
            {visible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    );
  };

  // ====================================================
  // LOADING STATE
  // ====================================================

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050607]">
        <div className="flex items-center gap-3 text-slate-400">
          <LoaderCircle className="h-5 w-5 animate-spin" />

          Loading profile...
        </div>
      </div>
    );
  }

  // ====================================================
  // MAIN UI
  // ====================================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050607] text-slate-200">

      {/* ==================================================
          AMBIENT BACKGROUND
      ================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-red-900/[0.06] blur-3xl" />

        <div className="absolute -right-40 top-80 h-96 w-96 rounded-full bg-amber-700/[0.04] blur-3xl" />

        <div className="absolute bottom-0 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full bg-red-950/[0.04] blur-3xl" />

        {/* Moon */}
        <div className="absolute right-[8%] top-20 h-20 w-20 rounded-full bg-slate-200/[0.04] shadow-[0_0_80px_rgba(255,255,255,0.03)]" />

        {/* Mountain silhouettes */}
        <div className="absolute bottom-0 left-0 h-48 w-full bg-gradient-to-t from-black via-black/80 to-transparent" />

      </div>

      {/* ==================================================
          PAGE
      ================================================== */}

      <main className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <header className="mb-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="mb-3 flex items-center gap-2">

                <Sword className="h-4 w-4 text-red-400/70" />

                <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-red-400/60">
                  The Adventurer's Hall
                </span>

              </div>

              <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
                Your Profile
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Shape your identity, protect your account,
                and continue your journey through the
                Smart LMS realm.
              </p>

            </div>

            {/* Completion */}
            <div className="w-full sm:w-64">

              <div className="mb-2 flex items-center justify-between">

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                  Profile Completion
                </span>

                <span className="text-sm font-semibold text-amber-400">
                  {completion}%
                </span>

              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-slate-900">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-amber-300 transition-all duration-700"
                  style={{
                    width: `${completion}%`,
                  }}
                />

              </div>

            </div>

          </div>

        </header>

        {/* =================================================
            HERO PROFILE CARD
        ================================================= */}

        <section className="relative mb-8 overflow-hidden rounded-[2rem] border border-slate-800/80 bg-[#0a0c0f]/95 shadow-2xl shadow-black/40">

          {/* Top border glow */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

          {/* Background glow */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-red-600/[0.05] blur-3xl" />

          <div className="relative p-6 sm:p-8 lg:p-10">

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

              {/* Profile Identity */}
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                {/* Avatar */}
                <div className="relative shrink-0">

                  <div className="absolute -inset-3 rounded-full border border-red-500/10" />

                  <div className="absolute -inset-6 rounded-full border border-red-500/[0.04]" />

                  <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-amber-500/20 bg-[#11151a] shadow-[0_0_50px_rgba(239,68,68,0.08)] sm:h-32 sm:w-32">

                    <img
                      src={selectedAvatar}
                      alt="Profile avatar"
                      className="h-full w-full object-cover"
                    />

                  </div>

                  {/* Online indicator */}
                  <div className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-[#0a0c0f] bg-emerald-500">
                    <Check className="h-3 w-3 text-black" />
                  </div>

                </div>

                {/* User info */}
                <div>

                  <div className="mb-2 flex flex-wrap items-center gap-2">

                    <span className="rounded-full border border-red-500/20 bg-red-500/[0.05] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-red-400">
                      {user.role || "Student"}
                    </span>

                    {user.isVerified && (
                      <span className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/[0.04] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-400">

                        <CheckCircle2 className="h-3 w-3" />

                        Verified
                      </span>
                    )}

                  </div>

                  <h2 className="font-serif text-2xl font-bold text-slate-100 sm:text-3xl">
                    {user.name || "Adventurer"}
                  </h2>

                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <Mail className="h-4 w-4 text-slate-700" />
                    {user.email}
                  </p>

                  <p className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                    <CalendarDays className="h-3.5 w-3.5" />

                    Joined{" "}
                    {formatDate(
                      user.createdAt ||
                        user.created_at
                    )}
                  </p>

                </div>

              </div>

              {/* Profile actions */}
              <div className="flex flex-wrap gap-3">

                {!isEditingProfile ? (
                  <button
                    type="button"
                    onClick={() =>
                      setIsEditingProfile(true)
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-5 py-3 text-sm font-medium text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-500/30 hover:bg-red-500/[0.04] hover:text-red-300"
                  >
                    <Pencil className="h-4 w-4" />

                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={savingProfile}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-5 py-3 text-sm font-medium text-slate-400 transition hover:border-slate-600 hover:text-slate-200 disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />

                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="inline-flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/[0.07] px-5 py-3 text-sm font-semibold text-amber-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300/40 hover:bg-amber-400/[0.12] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {savingProfile ? (
                        <>
                          <LoaderCircle className="h-4 w-4 animate-spin" />

                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />

                          Save Changes
                        </>
                      )}
                    </button>
                  </>
                )}

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">

          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <div className="space-y-8">

            {/* ===============================================
                PROFILE INFORMATION
            =============================================== */}

            <section className="relative overflow-hidden rounded-[2rem] border border-slate-800/80 bg-[#0a0c0f]/95 shadow-2xl shadow-black/30">

              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

              <div className="p-6 sm:p-8">

                <div className="mb-7 flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/[0.05]">
                    <User className="h-5 w-5 text-red-300" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-400/60">
                      Character Details
                    </p>

                    <h3 className="mt-1 font-serif text-xl font-bold text-slate-100">
                      Personal Information
                    </h3>
                  </div>

                </div>

                <form
                  onSubmit={handleSaveProfile}
                  className="space-y-6"
                >

                  {/* Name */}
                  <div>

                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                      Display Name
                    </label>

                    <div className="relative">

                      <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-700" />

                      <input
                        type="text"
                        value={name}
                        onChange={(event) =>
                          setName(event.target.value)
                        }
                        disabled={!isEditingProfile}
                        placeholder="Enter your name"
                        className="w-full rounded-xl border border-slate-800 bg-[#050607] py-3.5 pl-11 pr-4 text-sm text-slate-200 outline-none transition-all duration-300 placeholder:text-slate-700 focus:border-red-500/30 focus:ring-2 focus:ring-red-500/10 disabled:cursor-default disabled:opacity-70"
                      />

                    </div>

                  </div>

                  {/* Email read only */}
                  <div>

                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                      Account Email
                    </label>

                    <div className="relative">

                      <AtSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-700" />

                      <input
                        type="email"
                        value={user.email || ""}
                        disabled
                        className="w-full cursor-not-allowed rounded-xl border border-slate-800 bg-[#050607] py-3.5 pl-11 pr-4 text-sm text-slate-500 outline-none"
                      />

                    </div>

                  </div>

                </form>

              </div>

            </section>

            {/* ===============================================
                AVATAR SELECTOR
            =============================================== */}

            {isEditingProfile && (
              <section className="relative overflow-hidden rounded-[2rem] border border-slate-800/80 bg-[#0a0c0f]/95 shadow-2xl shadow-black/30">

                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

                <div className="p-6 sm:p-8">

                  <div className="mb-7 flex items-center justify-between">

                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/[0.05]">
                        <Crown className="h-5 w-5 text-amber-300" />
                      </div>

                      <div>

                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400/60">
                          Choose Your Identity
                        </p>

                        <h3 className="mt-1 font-serif text-xl font-bold text-slate-100">
                          Character Avatar
                        </h3>

                      </div>

                    </div>

                  </div>

                  <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">

                    {AVATARS.map((avatar) => {
                      const isSelected =
                        selectedAvatar === avatar.url;

                      return (
                        <button
                          key={avatar.id}
                          type="button"
                          onClick={() =>
                            handleAvatarSelect(
                              avatar.url
                            )
                          }
                          className={`group relative aspect-square overflow-hidden rounded-2xl border transition-all duration-300 ${
                            isSelected
                              ? "border-amber-400/60 bg-amber-400/[0.08] shadow-[0_0_25px_rgba(245,158,11,0.08)]"
                              : "border-slate-800 bg-[#050607] hover:-translate-y-1 hover:border-slate-600"
                          }`}
                        >

                          <img
                            src={avatar.url}
                            alt={avatar.name}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />

                          {isSelected && (
                            <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-black">
                              <Check className="h-3.5 w-3.5" />
                            </div>
                          )}

                        </button>
                      );
                    })}

                  </div>

                </div>

              </section>
            )}

            {/* ===============================================
                CHANGE EMAIL
            =============================================== */}

            <section className="relative overflow-hidden rounded-[2rem] border border-slate-700/60 bg-[#0a0c0f]/95 shadow-2xl shadow-black/40">

              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />

              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-sky-500/[0.04] blur-3xl" />

              <div className="relative p-6 sm:p-8">

                {/* Header */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-4">

                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/[0.05]">

                      <Mail className="h-5 w-5 text-sky-300" />

                      <div className="absolute inset-0 animate-pulse rounded-2xl border border-sky-300/10" />

                    </div>

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky-300/60">
                        Raven Message
                      </p>

                      <h3 className="mt-1 font-serif text-xl font-bold text-slate-100">
                        Email Address
                      </h3>

                      <p className="mt-1 text-xs text-slate-600">
                        Manage your account email
                      </p>

                    </div>

                  </div>

                  {!showEmailForm && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowEmailForm(true)
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-400/20 bg-sky-400/[0.05] px-5 py-3 text-sm font-medium text-sky-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/40 hover:bg-sky-400/[0.1] hover:shadow-[0_0_30px_rgba(56,189,248,0.08)]"
                    >
                      <Pencil className="h-4 w-4" />

                      Change Email
                    </button>
                  )}

                </div>

                {/* Current Email */}
                <div className="mt-7 rounded-2xl border border-slate-800 bg-[#07090c]/80 p-5">

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="min-w-0">

                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                        Current Email
                      </p>

                      <div className="mt-2 flex min-w-0 items-center gap-3">

                        <AtSign className="h-4 w-4 shrink-0 text-slate-600" />

                        <span className="truncate text-sm font-medium text-slate-200">
                          {user.email}
                        </span>

                      </div>

                    </div>

                    {user.isVerified ? (
                      <div className="flex w-fit shrink-0 items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.05] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">

                        <CheckCircle2 className="h-3.5 w-3.5" />

                        Verified

                      </div>
                    ) : (
                      <div className="flex w-fit shrink-0 items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/[0.05] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">

                        <Mail className="h-3.5 w-3.5" />

                        Unverified

                      </div>
                    )}

                  </div>

                </div>

                {/* Change Email Form */}
                {showEmailForm && (
                  <div className="mt-6 border-t border-slate-800 pt-6">

                    <div className="mb-5">

                      <p className="text-sm font-semibold text-slate-200">
                        Choose a new email address
                      </p>

                      <p className="mt-1 text-xs leading-6 text-slate-600">
                        We will send a verification link
                        to the new address. Your current
                        email will remain active until
                        verification.
                      </p>

                    </div>

                    <form
                      onSubmit={handleChangeEmail}
                      className="space-y-4"
                    >

                      <div className="relative">

                        <AtSign className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600" />

                        <input
                          type="email"
                          value={newEmail}
                          onChange={(event) =>
                            setNewEmail(
                              event.target.value
                            )
                          }
                          disabled={changingEmail}
                          placeholder="new-email@example.com"
                          autoComplete="email"
                          className="w-full rounded-xl border border-slate-700 bg-[#050607] py-3.5 pl-12 pr-4 text-sm text-slate-200 outline-none transition-all duration-300 placeholder:text-slate-700 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                        />

                      </div>

                      <div className="flex gap-3 rounded-xl border border-sky-400/10 bg-sky-400/[0.03] p-4">

                        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-sky-400/60" />

                        <p className="text-xs leading-6 text-slate-500">
                          For your security, your email
                          address will only change after
                          you verify the new address from
                          the email we send you.
                        </p>

                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">

                        <button
                          type="submit"
                          disabled={changingEmail}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-sky-400/20 bg-sky-400/[0.07] px-5 py-3.5 text-sm font-semibold text-sky-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/40 hover:bg-sky-400/[0.12] disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          {changingEmail ? (
                            <>
                              <LoaderCircle className="h-4 w-4 animate-spin" />

                              Sending Verification...
                            </>
                          ) : (
                            <>
                              <Mail className="h-4 w-4" />

                              Send Verification
                            </>
                          )}

                        </button>

                        <button
                          type="button"
                          disabled={changingEmail}
                          onClick={() => {
                            setShowEmailForm(false);
                            setNewEmail("");
                          }}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-5 py-3.5 text-sm font-medium text-slate-400 transition hover:border-slate-600 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          <X className="h-4 w-4" />

                          Cancel

                        </button>

                      </div>

                    </form>

                  </div>
                )}

              </div>

            </section>

            {/* ===============================================
                CHANGE PASSWORD
            =============================================== */}

            <section className="relative overflow-hidden rounded-[2rem] border border-slate-800/80 bg-[#0a0c0f]/95 shadow-2xl shadow-black/30">

              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

              <div className="p-6 sm:p-8">

                <div className="mb-7 flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/[0.05]">
                    <Shield className="h-5 w-5 text-red-300" />
                  </div>

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-400/60">
                      Fortify Your Realm
                    </p>

                    <h3 className="mt-1 font-serif text-xl font-bold text-slate-100">
                      Security
                    </h3>

                    <p className="mt-1 text-xs text-slate-600">
                      Keep your account protected
                    </p>

                  </div>

                </div>

                <form
                  onSubmit={handleChangePassword}
                  className="space-y-5"
                >

                  <PasswordInput
                    label="Current Password"
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    visible={showCurrentPassword}
                    setVisible={setShowCurrentPassword}
                    placeholder="Enter current password"
                  />

                  <PasswordInput
                    label="New Password"
                    value={newPassword}
                    onChange={setNewPassword}
                    visible={showNewPassword}
                    setVisible={setShowNewPassword}
                    placeholder="Enter new password"
                  />

                  <PasswordInput
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    visible={showConfirmPassword}
                    setVisible={setShowConfirmPassword}
                    placeholder="Confirm new password"
                  />

                  <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.03] p-4">

                    <p className="text-xs leading-6 text-slate-500">
                      Use a strong password containing
                      uppercase letters, lowercase letters,
                      numbers, and special characters.
                    </p>

                  </div>

                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-5 py-3.5 text-sm font-semibold text-red-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-400/40 hover:bg-red-500/[0.1] disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {changingPassword ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />

                        Updating Password...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />

                        Change Password
                      </>
                    )}

                  </button>

                </form>

              </div>

            </section>

          </div>

          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <aside className="space-y-8">

            {/* ===============================================
                PROFILE STATUS
            =============================================== */}

            <section className="relative overflow-hidden rounded-[2rem] border border-slate-800/80 bg-[#0a0c0f]/95 shadow-2xl shadow-black/30">

              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

              <div className="p-6">

                <div className="mb-6 flex items-center gap-3">

                  <Sparkles className="h-5 w-5 text-amber-400" />

                  <h3 className="font-serif text-lg font-bold text-slate-100">
                    Character Status
                  </h3>

                </div>

                <div className="space-y-4">

                  {/* Verification */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#07090c] p-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/[0.06]">

                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />

                      </div>

                      <div>

                        <p className="text-xs font-semibold text-slate-300">
                          Email
                        </p>

                        <p className="text-[10px] text-slate-600">
                          Account verification
                        </p>

                      </div>

                    </div>

                    <span
                      className={
                        user.isVerified
                          ? "text-[10px] font-bold uppercase tracking-wider text-emerald-400"
                          : "text-[10px] font-bold uppercase tracking-wider text-amber-400"
                      }
                    >
                      {user.isVerified
                        ? "Verified"
                        : "Pending"}
                    </span>

                  </div>

                  {/* Profile */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#07090c] p-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/[0.06]">

                        <User className="h-4 w-4 text-red-400" />

                      </div>

                      <div>

                        <p className="text-xs font-semibold text-slate-300">
                          Profile
                        </p>

                        <p className="text-[10px] text-slate-600">
                          Character details
                        </p>

                      </div>

                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      {completion}%
                    </span>

                  </div>

                </div>

              </div>

            </section>

            {/* ===============================================
                ADVENTURER STATS
            =============================================== */}

            <section className="relative overflow-hidden rounded-[2rem] border border-slate-800/80 bg-[#0a0c0f]/95 shadow-2xl shadow-black/30">

              <div className="p-6">

                <div className="mb-6 flex items-center gap-3">

                  <Crown className="h-5 w-5 text-amber-400" />

                  <h3 className="font-serif text-lg font-bold text-slate-100">
                    Adventurer Stats
                  </h3>

                </div>

                <div className="grid grid-cols-2 gap-3">

                  {/* XP */}
                  <div className="rounded-2xl border border-slate-800 bg-[#07090c] p-4">

                    <Zap className="mb-3 h-5 w-5 text-amber-400" />

                    <p className="text-xl font-bold text-slate-100">
                      {user.xp || 0}
                    </p>

                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                      XP
                    </p>

                  </div>

                  {/* Streak */}
                  <div className="rounded-2xl border border-slate-800 bg-[#07090c] p-4">

                    <Flame className="mb-3 h-5 w-5 text-orange-400" />

                    <p className="text-xl font-bold text-slate-100">
                      {user.studyStreak || 0}
                    </p>

                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                      Streak
                    </p>

                  </div>

                  {/* Level */}
                  <div className="rounded-2xl border border-slate-800 bg-[#07090c] p-4">

                    <Sword className="mb-3 h-5 w-5 text-red-400" />

                    <p className="text-xl font-bold text-slate-100">
                      {user.level || 1}
                    </p>

                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                      Level
                    </p>

                  </div>

                  {/* Rank */}
                  <div className="rounded-2xl border border-slate-800 bg-[#07090c] p-4">

                    <Crown className="mb-3 h-5 w-5 text-purple-400" />

                    <p className="text-xl font-bold text-slate-100">
                      {user.rank || "Novice"}
                    </p>

                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                      Rank
                    </p>

                  </div>

                </div>

              </div>

            </section>

            {/* ===============================================
                ACCOUNT INFORMATION
            =============================================== */}

            <section className="relative overflow-hidden rounded-[2rem] border border-slate-800/80 bg-[#0a0c0f]/95 shadow-2xl shadow-black/30">

              <div className="p-6">

                <div className="mb-6 flex items-center gap-3">

                  <AtSign className="h-5 w-5 text-slate-500" />

                  <h3 className="font-serif text-lg font-bold text-slate-100">
                    Account Information
                  </h3>

                </div>

                <div className="space-y-5">

                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                      Account ID
                    </p>

                    <p className="mt-1 break-all font-mono text-xs text-slate-500">
                      {user._id || user.id || "Unavailable"}
                    </p>

                  </div>

                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                      Joined
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      {formatDate(
                        user.createdAt ||
                          user.created_at
                      )}
                    </p>

                  </div>

                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                      Role
                    </p>

                    <p className="mt-1 capitalize text-sm text-slate-400">
                      {user.role || "student"}
                    </p>

                  </div>

                </div>

              </div>

            </section>

            {/* ===============================================
                SECURITY NOTE
            =============================================== */}

            <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.025] p-5">

              <div className="flex gap-3">

                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-red-400/60" />

                <div>

                  <p className="text-xs font-semibold text-slate-400">
                    Protect your account
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-slate-600">
                    Never share your password or
                    verification links with anyone.
                  </p>

                </div>

              </div>

            </div>

          </aside>

        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="mt-10 pb-8 text-center">

          <div className="mx-auto mb-3 h-px max-w-md bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

          <p className="font-serif text-xs italic text-slate-700">
            "Every great developer begins as an
            apprentice."
          </p>

          <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-800">
            Smart LMS • Forge Your Future
          </p>

        </footer>

      </main>

    </div>
  );
};

export default Profile;