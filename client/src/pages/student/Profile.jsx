import { useEffect, useState } from "react";
import {
  AtSign,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
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

/* =========================================================
   STATIC CONFIG
========================================================= */

const AVATARS = [
  ["knight", "The Knight", "Knight"],
  ["warrior", "The Warrior", "Warrior"],
  ["mage", "The Mage", "Mage"],
  ["king", "The King", "King"],
  ["ranger", "The Ranger", "Ranger"],
  ["rogue", "The Rogue", "Rogue"],
  ["paladin", "The Paladin", "Paladin"],
  ["wizard", "The Wizard", "Wizard"],
  ["guardian", "The Guardian", "Guardian"],
  ["hunter", "The Hunter", "Hunter"],
  ["captain", "The Captain", "Captain"],
  ["lord", "The Lord", "Lord"],
].map(([id, name, seed]) => ({
  id,
  name,
  url: `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}&backgroundColor=1a1a1a`,
}));

const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

const SECTION_COLORS = {
  red: {
    icon:
      "border-red-500/20 bg-red-500/[0.05] text-red-300",
    text: "text-red-300",
    eyebrow: "text-red-300/60",
  },
  amber: {
    icon:
      "border-amber-500/20 bg-amber-500/[0.05] text-amber-300",
    text: "text-amber-300",
    eyebrow: "text-amber-300/60",
  },
  sky: {
    icon:
      "border-sky-500/20 bg-sky-500/[0.05] text-sky-300",
    text: "text-sky-300",
    eyebrow: "text-sky-300/60",
  },
};

const CARD_ACCENTS = {
  red: "via-red-500/30",
  amber: "via-amber-500/30",
  sky: "via-sky-400/40",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* =========================================================
   HELPERS
========================================================= */

const formatDate = (date) => {
  if (!date) return "Unknown";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Unknown";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatShortDate = (date) =>
  date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

const formatTime = (date) =>
  date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const getAvatar = (user) =>
  user?.avatar?.url ||
  user?.avatar ||
  AVATARS[0].url;

const isSameDay = (a, b) =>
  Boolean(a && b) &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const getJoinedDate = (user) => {
  const value = user?.createdAt || user?.created_at;

  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

/* =========================================================
   REUSABLE UI
========================================================= */

function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  color = "red",
}) {
  const colors = SECTION_COLORS[color] || SECTION_COLORS.red;

  return (
    <div className="mb-7 flex items-center gap-4">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${colors.icon}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <p
          className={`text-[10px] font-bold uppercase tracking-[0.3em] ${colors.eyebrow}`}
        >
          {eyebrow}
        </p>

        <h3 className="mt-1 font-serif text-xl font-bold text-slate-100">
          {title}
        </h3>

        {description && (
          <p className="mt-1 text-xs text-slate-600">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  visible,
  setVisible,
  placeholder,
  disabled,
}) {
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
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="new-password"
          className="w-full rounded-xl border border-slate-800 bg-[#050607] py-3.5 pl-11 pr-12 text-sm text-slate-200 outline-none transition focus:border-red-500/30 focus:ring-2 focus:ring-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
        />

        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          disabled={disabled}
          aria-label={
            visible
              ? `Hide ${label}`
              : `Show ${label}`
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-600 transition hover:bg-slate-800/50 hover:text-slate-300 disabled:opacity-50"
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
}

function Card({
  children,
  accent = "red",
  className = "",
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-[2rem] border border-slate-800/80 bg-[#0a0c0f]/95 shadow-2xl shadow-black/30 ${className}`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${
          CARD_ACCENTS[accent] || CARD_ACCENTS.red
        } to-transparent`}
      />

      {children}
    </section>
  );
}

/* =========================================================
   LEARNING CALENDAR
========================================================= */

function LearningCalendar({
  liveNow,
  joinedDate,
  studyStreak,
}) {
  const [calendarDate, setCalendarDate] = useState(
    () => new Date()
  );

  const calendarMonthLabel =
    calendarDate.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });

  const calendarDays = (() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const firstDay = new Date(
      year,
      month,
      1
    ).getDay();

    const daysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate();

    const offset = (firstDay + 6) % 7;

    const days = Array(offset).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        new Date(year, month, day)
      );
    }

    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  })();

  const changeMonth = (amount) => {
    setCalendarDate(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + amount,
          1
        )
    );
  };

  const goToCurrentMonth = () => {
    const now = new Date();

    setCalendarDate(
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      )
    );
  };

  return (
    <Card>
      <div className="relative p-6">
        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/[0.06]">
              <CalendarDays className="h-5 w-5 text-red-300" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-400/60">
                Journey Timeline
              </p>

              <h3 className="mt-1 font-serif text-lg font-bold text-slate-100">
                Learning Calendar
              </h3>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[9px] font-bold uppercase text-slate-600">
              Live
            </p>

            <p className="mt-1 text-[11px] text-emerald-400">
              {formatTime(liveNow)}
            </p>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-800 bg-[#07090c]/90 p-3">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="Previous month"
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-800 hover:text-slate-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={goToCurrentMonth}
            className="font-serif text-sm font-semibold text-slate-200 hover:text-amber-300"
          >
            {calendarMonthLabel}
          </button>

          <button
            type="button"
            onClick={() => changeMonth(1)}
            aria-label="Next month"
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-800 hover:text-slate-200"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEK_DAYS.map((day, index) => (
            <div
              key={`${day}-${index}`}
              className="py-1 text-[9px] font-bold text-slate-700"
            >
              {day}
            </div>
          ))}

          {calendarDays.map((date, index) => {
            if (!date) {
              return (
                <div
                  key={`empty-${index}`}
                  className="aspect-square"
                  aria-hidden="true"
                />
              );
            }

            const today = isSameDay(
              date,
              liveNow
            );

            const joined = isSameDay(
              date,
              joinedDate
            );

            return (
              <div
                key={date.toISOString()}
                title={
                  today
                    ? "Today"
                    : joined
                      ? "Your Smart LMS journey started here"
                      : formatDate(date)
                }
                className={`relative flex aspect-square items-center justify-center rounded-lg text-[11px] transition ${
                  today
                    ? "bg-gradient-to-br from-red-500/25 to-amber-500/15 font-bold text-amber-300 ring-1 ring-red-400/40"
                    : joined
                      ? "bg-slate-800/80 font-semibold text-slate-200 ring-1 ring-slate-600"
                      : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                {date.getDate()}

                {(today || joined) && (
                  <span
                    className={`absolute bottom-1 h-1 w-1 rounded-full ${
                      today
                        ? "bg-amber-300"
                        : "bg-slate-400"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-800 bg-[#07090c] p-3">
            <p className="text-[9px] font-bold uppercase text-slate-600">
              Today
            </p>

            <p className="mt-1 text-xs font-semibold text-slate-300">
              {liveNow.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
              })}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#07090c] p-3">
            <p className="text-[9px] font-bold uppercase text-slate-600">
              Streak
            </p>

            <p className="mt-1 text-xs font-semibold text-orange-300">
              {studyStreak || 0} days
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-4 text-[9px] text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-300" />
            Today
          </span>

          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-400" />
            Joined
          </span>
        </div>
      </div>
    </Card>
  );
}

/* =========================================================
   PROFILE
========================================================= */

const Profile = () => {
  const { user, updateUser } = useAuth();

  /* -------------------------------------------------------
     PROFILE
  ------------------------------------------------------- */

  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(
    AVATARS[0].url
  );

  const [isEditingProfile, setIsEditingProfile] =
    useState(false);

  const [savingProfile, setSavingProfile] =
    useState(false);

  /* -------------------------------------------------------
     PASSWORD
  ------------------------------------------------------- */

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  /* -------------------------------------------------------
     EMAIL
  ------------------------------------------------------- */

  const [showEmailForm, setShowEmailForm] =
    useState(false);

  const [newEmail, setNewEmail] = useState("");

  const [changingEmail, setChangingEmail] =
    useState(false);

  /* -------------------------------------------------------
     LIVE CLOCK
  ------------------------------------------------------- */

  const [liveNow, setLiveNow] = useState(
    () => new Date()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveNow(new Date());
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  /* -------------------------------------------------------
     SYNC USER
  ------------------------------------------------------- */

  useEffect(() => {
    if (!user) return;

    setName(user.name || "");
    setSelectedAvatar(getAvatar(user));
  }, [user]);

  /* -------------------------------------------------------
     DERIVED DATA
  ------------------------------------------------------- */

  const joinedDate = getJoinedDate(user);

  const completion = user
    ? Math.round(
        (
          [
            Boolean(name.trim()),
            Boolean(user.email),
            Boolean(selectedAvatar),
            Boolean(user.isVerified),
          ].filter(Boolean).length /
          4
        ) * 100
      )
    : 0;

  /* =======================================================
     PROFILE ACTIONS
  ======================================================= */

  const handleSaveProfile = async (event) => {
    event?.preventDefault();

    if (savingProfile) return;

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      toast.error(
        "Name must contain at least 2 characters."
      );
      return;
    }

    try {
      setSavingProfile(true);

      const response = await updateProfile({
        name: trimmedName,
        avatar: selectedAvatar,
      });

      const updatedUser =
        response?.user ||
        response?.data?.user ||
        response?.data;

      updateUser?.(
        updatedUser || {
          name: trimmedName,
          avatar: selectedAvatar,
        }
      );

      toast.success(
        response?.message ||
          "Your profile has been updated."
      );

      setIsEditingProfile(false);
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setName(user?.name || "");
    setSelectedAvatar(getAvatar(user));
    setIsEditingProfile(false);
  };

  const handleAvatarSelect = (url) => {
    setSelectedAvatar(url);

    if (!isEditingProfile) {
      setIsEditingProfile(true);
    }
  };

  /* =======================================================
     EMAIL
  ======================================================= */

  const handleChangeEmail = async (event) => {
    event.preventDefault();

    if (changingEmail) return;

    const email = newEmail
      .trim()
      .toLowerCase();

    if (!EMAIL_REGEX.test(email)) {
      toast.error(
        "Please enter a valid email address."
      );
      return;
    }

    if (
      email ===
      user?.email?.trim().toLowerCase()
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
      console.error(
        "Email change error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to change email."
      );
    } finally {
      setChangingEmail(false);
    }
  };

  /* =======================================================
     PASSWORD
  ======================================================= */

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (changingPassword) return;

    if (!currentPassword) {
      toast.error(
        "Enter your current password."
      );
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(
        "New passwords do not match."
      );
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

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050607]">
        <LoaderCircle className="mr-3 h-5 w-5 animate-spin text-amber-400" />

        <span className="text-slate-400">
          Loading profile...
        </span>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050607] text-slate-200">
      {/* =================================================
          AMBIENT BACKGROUND
      ================================================= */}

      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-red-900/[0.06] blur-3xl" />

        <div className="absolute -right-40 top-80 h-96 w-96 rounded-full bg-amber-700/[0.04] blur-3xl" />

        <div className="absolute bottom-0 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full bg-red-950/[0.04] blur-3xl" />

        <div className="absolute right-[8%] top-20 h-20 w-20 rounded-full bg-slate-200/[0.04] shadow-[0_0_80px_rgba(255,255,255,0.03)]" />

        <div className="absolute bottom-0 left-0 h-48 w-full bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      <main className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* =================================================
            HEADER
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

              <h1 className="font-serif text-3xl font-bold text-slate-100 sm:text-4xl">
                Your Profile
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Shape your identity, protect your account,
                and continue your journey through the Smart
                LMS realm.
              </p>
            </div>

            <div className="w-full sm:w-64">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                  Profile Completion
                </span>

                <span className="text-sm font-semibold text-amber-400">
                  {completion}%
                </span>
              </div>

              <div
                className="h-1.5 overflow-hidden rounded-full bg-slate-900"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={completion}
              >
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
            PROFILE HERO
        ================================================= */}

        <Card className="mb-8">
          <div className="relative p-6 sm:p-8 lg:p-10">
            <div
              className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-red-600/[0.05] blur-3xl"
              aria-hidden="true"
            />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="absolute -inset-3 rounded-full border border-red-500/10" />

                  <div className="absolute -inset-6 rounded-full border border-red-500/[0.04]" />

                  <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-amber-500/20 bg-[#11151a] shadow-[0_0_50px_rgba(239,68,68,0.08)] sm:h-32 sm:w-32">
                    <img
                      src={selectedAvatar}
                      alt="Profile avatar"
                      loading="eager"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-[#0a0c0f] bg-emerald-500">
                    <Check className="h-3 w-3 text-black" />
                  </div>
                </div>

                {/* User information */}
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

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600">
                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5" />

                      Joined{" "}
                      {formatDate(
                        user.createdAt ||
                          user.created_at
                      )}
                    </span>

                    <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />

                    <span className="flex items-center gap-2 text-emerald-500/70">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                      {formatShortDate(liveNow)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile buttons */}
              <div className="flex flex-wrap gap-3">
                {!isEditingProfile ? (
                  <button
                    type="button"
                    onClick={() =>
                      setIsEditingProfile(true)
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-5 py-3 text-sm font-medium text-slate-300 transition hover:-translate-y-0.5 hover:border-red-500/30 hover:text-red-300"
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
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-5 py-3 text-sm text-slate-400 transition hover:border-slate-600 hover:text-slate-200 disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="inline-flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/[0.07] px-5 py-3 text-sm font-semibold text-amber-300 transition hover:-translate-y-0.5 hover:bg-amber-400/[0.12] disabled:opacity-50"
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
        </Card>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-8">
            {/* Personal information */}
            <Card>
              <div className="p-6 sm:p-8">
                <SectionHeader
                  icon={User}
                  eyebrow="Character Details"
                  title="Personal Information"
                />

                <form
                  onSubmit={handleSaveProfile}
                  className="space-y-6"
                >
                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                      Display Name
                    </label>

                    <div className="relative">
                      <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-700" />

                      <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                          setName(e.target.value)
                        }
                        disabled={!isEditingProfile}
                        placeholder="Enter your name"
                        autoComplete="name"
                        className="w-full rounded-xl border border-slate-800 bg-[#050607] py-3.5 pl-11 pr-4 text-sm text-slate-200 outline-none transition focus:border-red-500/30 focus:ring-2 focus:ring-red-500/10 disabled:opacity-70"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                      Account Email
                    </label>

                    <div className="relative">
                      <AtSign className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-700" />

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
            </Card>

            {/* Avatar */}
            {isEditingProfile && (
              <Card accent="amber">
                <div className="p-6 sm:p-8">
                  <SectionHeader
                    icon={Crown}
                    eyebrow="Choose Your Identity"
                    title="Character Avatar"
                    color="amber"
                  />

                  <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
                    {AVATARS.map((avatar) => {
                      const selected =
                        selectedAvatar ===
                        avatar.url;

                      return (
                        <button
                          key={avatar.id}
                          type="button"
                          onClick={() =>
                            handleAvatarSelect(
                              avatar.url
                            )
                          }
                          aria-label={`Select ${avatar.name}`}
                          aria-pressed={selected}
                          className={`group relative aspect-square overflow-hidden rounded-2xl border transition ${
                            selected
                              ? "border-amber-400/60 bg-amber-400/[0.08] shadow-[0_0_25px_rgba(245,158,11,0.08)]"
                              : "border-slate-800 bg-[#050607] hover:-translate-y-1 hover:border-slate-600"
                          }`}
                        >
                          <img
                            src={avatar.url}
                            alt={avatar.name}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />

                          {selected && (
                            <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-black">
                              <Check className="h-3.5 w-3.5" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Card>
            )}

            {/* Email */}
            <Card accent="sky">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <SectionHeader
                    icon={Mail}
                    eyebrow="Raven Message"
                    title="Email Address"
                    description="Manage your account email"
                    color="sky"
                  />

                  {!showEmailForm && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowEmailForm(true)
                      }
                      className="mb-7 inline-flex items-center justify-center gap-2 rounded-xl border border-sky-400/20 bg-sky-400/[0.05] px-5 py-3 text-sm text-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-400/[0.1]"
                    >
                      <Pencil className="h-4 w-4" />
                      Change Email
                    </button>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-800 bg-[#07090c]/80 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                        Current Email
                      </p>

                      <p className="mt-2 flex items-center gap-3 truncate text-sm font-medium text-slate-200">
                        <AtSign className="h-4 w-4 shrink-0 text-slate-600" />

                        {user.email}
                      </p>
                    </div>

                    <span
                      className={`flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase ${
                        user.isVerified
                          ? "border-emerald-400/20 bg-emerald-400/[0.05] text-emerald-400"
                          : "border-amber-400/20 bg-amber-400/[0.05] text-amber-400"
                      }`}
                    >
                      {user.isVerified ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <Mail className="h-3.5 w-3.5" />
                      )}

                      {user.isVerified
                        ? "Verified"
                        : "Unverified"}
                    </span>
                  </div>
                </div>

                {showEmailForm && (
                  <form
                    onSubmit={handleChangeEmail}
                    className="mt-6 space-y-4 border-t border-slate-800 pt-6"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-200">
                        Choose a new email address
                      </p>

                      <p className="mt-1 text-xs leading-6 text-slate-600">
                        A verification link will be sent
                        to the new address.
                      </p>
                    </div>

                    <div className="relative">
                      <AtSign className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600" />

                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) =>
                          setNewEmail(
                            e.target.value
                          )
                        }
                        disabled={changingEmail}
                        placeholder="new-email@example.com"
                        autoComplete="email"
                        className="w-full rounded-xl border border-slate-700 bg-[#050607] py-3.5 pl-12 pr-4 text-sm text-slate-200 outline-none transition focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/10 disabled:opacity-50"
                      />
                    </div>

                    <div className="flex gap-3 rounded-xl border border-sky-400/10 bg-sky-400/[0.03] p-4">
                      <Shield className="h-4 w-4 shrink-0 text-sky-400/60" />

                      <p className="text-xs leading-6 text-slate-500">
                        Your current email remains active
                        until the new address is verified.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="submit"
                        disabled={changingEmail}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-sky-400/20 bg-sky-400/[0.07] px-5 py-3.5 text-sm font-semibold text-sky-200 transition hover:bg-sky-400/[0.12] disabled:opacity-50"
                      >
                        {changingEmail ? (
                          <>
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            Sending...
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
                        onClick={() => {
                          setShowEmailForm(false);
                          setNewEmail("");
                        }}
                        disabled={changingEmail}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-5 py-3.5 text-sm text-slate-400 transition hover:text-slate-200 disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </Card>

            {/* Password */}
            <Card>
              <div className="p-6 sm:p-8">
                <SectionHeader
                  icon={Shield}
                  eyebrow="Fortify Your Realm"
                  title="Security"
                  description="Keep your account protected"
                />

                <form
                  onSubmit={handleChangePassword}
                  className="space-y-5"
                >
                  <PasswordInput
                    label="Current Password"
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    visible={showCurrentPassword}
                    setVisible={
                      setShowCurrentPassword
                    }
                    placeholder="Enter current password"
                    disabled={changingPassword}
                  />

                  <PasswordInput
                    label="New Password"
                    value={newPassword}
                    onChange={setNewPassword}
                    visible={showNewPassword}
                    setVisible={setShowNewPassword}
                    placeholder="Enter new password"
                    disabled={changingPassword}
                  />

                  <PasswordInput
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    visible={showConfirmPassword}
                    setVisible={
                      setShowConfirmPassword
                    }
                    placeholder="Confirm new password"
                    disabled={changingPassword}
                  />

                  <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.03] p-4">
                    <p className="text-xs leading-6 text-slate-500">
                      Use uppercase, lowercase, numbers,
                      and special characters for a stronger
                      password.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-5 py-3.5 text-sm font-semibold text-red-300 transition hover:-translate-y-0.5 hover:bg-red-500/[0.1] disabled:opacity-50"
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
            </Card>
          </div>

          {/* =================================================
              RIGHT
          ================================================= */}

          <aside className="space-y-8">
            {/* Character status */}
            <Card accent="amber">
              <div className="p-6">
                <div className="mb-6 flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-amber-400" />

                  <h3 className="font-serif text-lg font-bold text-slate-100">
                    Character Status
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#07090c] p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />

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
                      className={`text-[10px] font-bold uppercase ${
                        user.isVerified
                          ? "text-emerald-400"
                          : "text-amber-400"
                      }`}
                    >
                      {user.isVerified
                        ? "Verified"
                        : "Pending"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#07090c] p-4">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-red-400" />

                      <div>
                        <p className="text-xs font-semibold text-slate-300">
                          Profile
                        </p>

                        <p className="text-[10px] text-slate-600">
                          Character details
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold uppercase text-amber-400">
                      {completion}%
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Calendar */}
            <LearningCalendar
              liveNow={liveNow}
              joinedDate={joinedDate}
              studyStreak={user.studyStreak}
            />

            {/* Stats */}
            <Card accent="amber">
              <div className="p-6">
                <div className="mb-6 flex items-center gap-3">
                  <Crown className="h-5 w-5 text-amber-400" />

                  <h3 className="font-serif text-lg font-bold text-slate-100">
                    Adventurer Stats
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <StatCard
                    label="XP"
                    value={user.xp || 0}
                    icon={Zap}
                    color="text-amber-400"
                  />

                  <StatCard
                    label="Streak"
                    value={user.studyStreak || 0}
                    icon={Flame}
                    color="text-orange-400"
                  />

                  <StatCard
                    label="Level"
                    value={user.level || 1}
                    icon={Sword}
                    color="text-red-400"
                  />

                  <StatCard
                    label="Rank"
                    value={user.rank || "Novice"}
                    icon={Crown}
                    color="text-purple-400"
                  />
                </div>
              </div>
            </Card>

            {/* Account */}
            <Card>
              <div className="p-6">
                <div className="mb-6 flex items-center gap-3">
                  <AtSign className="h-5 w-5 text-slate-500" />

                  <h3 className="font-serif text-lg font-bold text-slate-100">
                    Account Information
                  </h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <p className="text-[9px] font-bold uppercase text-slate-600">
                      Account ID
                    </p>

                    <p className="mt-1 break-all font-mono text-xs text-slate-500">
                      {user._id ||
                        user.id ||
                        "Unavailable"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase text-slate-600">
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
                    <p className="text-[9px] font-bold uppercase text-slate-600">
                      Role
                    </p>

                    <p className="mt-1 capitalize text-sm text-slate-400">
                      {user.role || "student"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Security note */}
            <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.025] p-5">
              <div className="flex gap-3">
                <Shield className="h-4 w-4 shrink-0 text-red-400/60" />

                <div>
                  <p className="text-xs font-semibold text-slate-400">
                    Protect your account
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-slate-600">
                    Never share your password or verification
                    links with anyone.
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
            "Every great developer begins as an apprentice."
          </p>

          <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-800">
            Smart LMS • Forge Your Future
          </p>
        </footer>
      </main>
    </div>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#07090c] p-4 transition hover:-translate-y-1 hover:border-slate-700">
      <Icon
        className={`mb-3 h-5 w-5 ${color}`}
      />

      <p className="text-xl font-bold text-slate-100">
        {value}
      </p>

      <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
        {label}
      </p>
    </div>
  );
}

export default Profile;