import { useEffect, useMemo, useRef, useState } from "react";
import {
  AtSign,
  CalendarDays,
  Check,
  CheckCircle2,
  Crown,
  LoaderCircle,
  Mail,
  Pencil,
  Save,
  Shield,
  Shuffle,
  Sparkles,
  Sword,
  User,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

// =====================================================
// MEDIEVAL AVATARS
// =====================================================

const AVATARS = [
  {
    name: "Northern Warden",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Northern-Warden",
  },
  {
    name: "Wolf Lord",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Wolf-Lord",
  },
  {
    name: "Iron King",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Iron-King",
  },
  {
    name: "Dragon Rider",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Dragon-Rider",
  },
  {
    name: "Royal Guardian",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Royal-Guardian",
  },
  {
    name: "Raven Keeper",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Raven-Keeper",
  },
  {
    name: "Fireborn",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Fireborn",
  },
  {
    name: "Night Warden",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Night-Warden",
  },
  {
    name: "Shadow Blade",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Shadow-Blade",
  },
  {
    name: "Castle Lord",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Castle-Lord",
  },
  {
    name: "Realm Queen",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Realm-Queen",
  },
  {
    name: "Dragon Knight",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Dragon-Knight",
  },
];

// =====================================================
// HELPERS
// =====================================================

const formatDate = (date) => {
  if (!date) return "Unknown";

  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "Unknown";
  }
};

// =====================================================
// PROFILE
// =====================================================

function Profile() {
  const { user, setUser } = useAuth();

  const cursorGlowRef = useRef(null);
  const cursorDotRef = useRef(null);

  // ---------------------------------------------------
  // STATE
  // ---------------------------------------------------

  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");

  const [saving, setSaving] = useState(false);

  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Password
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Email
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [changingEmail, setChangingEmail] = useState(false);

  // ---------------------------------------------------
  // SYNC AUTH USER → LOCAL FORM
  // ---------------------------------------------------

  useEffect(() => {
    if (!user) return;

    setName(user.name || "");
    setBio(user.bio || "");
    setAvatar(user.avatar || "");
  }, [user]);

  // ---------------------------------------------------
  // CURSOR EFFECT
  // ---------------------------------------------------

  useEffect(() => {
    const handlePointerMove = (event) => {
      const { clientX, clientY } = event;

      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.transform = `translate3d(
          ${clientX - 180}px,
          ${clientY - 180}px,
          0
        )`;
      }

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(
          ${clientX - 4}px,
          ${clientY - 4}px,
          0
        )`;
      }
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  // ---------------------------------------------------
  // RANDOM AVATAR
  // ---------------------------------------------------

  const randomAvatar = () => {
    const current = avatar;

    const available = AVATARS.filter(
      (item) => item.url !== current
    );

    const random =
      available[Math.floor(Math.random() * available.length)];

    if (random) {
      setAvatar(random.url);
    }
  };

  // ---------------------------------------------------
  // SELECT AVATAR
  // ---------------------------------------------------

  const selectAvatar = (url) => {
    setAvatar(url);
    setShowAvatarPicker(false);
  };

  // ---------------------------------------------------
  // SAVE PROFILE
  // ---------------------------------------------------

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error("Your name cannot be empty.");
      return;
    }

    if (bio.length > 300) {
      toast.error("Bio cannot exceed 300 characters.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.put("/auth/profile", {
        name: name.trim(),
        bio: bio.trim(),
        avatar,
      });

      if (response.data.success) {
        const updatedUser =
          response.data.user || response.data;

        // =================================================
        // 🔥 IMPORTANT
        // Update AuthContext immediately.
        // No manual refresh required.
        // =================================================

        setUser(updatedUser);

        toast.success("Your profile has been updated.");

        setEditing(false);
      }
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------------
  // CANCEL EDITING
  // ---------------------------------------------------

  const handleCancelEdit = () => {
    setName(user?.name || "");
    setBio(user?.bio || "");
    setAvatar(user?.avatar || "");

    setEditing(false);
  };

  // ---------------------------------------------------
  // CHANGE PASSWORD
  // ---------------------------------------------------

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
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

    try {
      setChangingPassword(true);

      await api.patch("/auth/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      toast.success("Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowPasswordForm(false);
    } catch (error) {
      console.error("Password change error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // ---------------------------------------------------
  // CHANGE EMAIL
  // ---------------------------------------------------

  const handleChangeEmail = async (event) => {
    event.preventDefault();

    const email = newEmail.trim().toLowerCase();

    if (!email) {
      toast.error("Please enter a new email.");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (email === user?.email?.toLowerCase()) {
      toast.error("This is already your current email.");
      return;
    }

    try {
      setChangingEmail(true);

      const response = await api.patch(
        "/auth/change-email",
        {
          newEmail: email,
        }
      );

      toast.success(
        response.data?.message ||
          "Verification email sent."
      );

      setNewEmail("");
      setShowEmailForm(false);
    } catch (error) {
      console.error("Email change error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to change email."
      );
    } finally {
      setChangingEmail(false);
    }
  };

  // ---------------------------------------------------
  // CURRENT AVATAR NAME
  // ---------------------------------------------------

  const selectedAvatarName = useMemo(() => {
    const found = AVATARS.find(
      (item) => item.url === avatar
    );

    return found?.name || "Your chosen avatar";
  }, [avatar]);

  // =====================================================
  // LOADING
  // =====================================================

  if (!user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          <span>Opening your house record...</span>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-200">
      {/* =================================================
          CURSOR GLOW
      ================================================= */}

      <div
        ref={cursorGlowRef}
        className="pointer-events-none fixed left-0 top-0 z-[1] h-[360px] w-[360px] rounded-full bg-amber-500/[0.045] blur-3xl transition-transform duration-150 ease-out"
      />

      <div
        ref={cursorDotRef}
        className="pointer-events-none fixed left-0 top-0 z-[60] h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.8)] transition-transform duration-75"
      />

      {/* =================================================
          AMBIENT BACKGROUND
      ================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-40 h-80 w-80 rounded-full bg-sky-500/[0.025] blur-3xl" />

        <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-amber-500/[0.025] blur-3xl" />

        {/* Stars */}
        <div className="absolute left-[12%] top-20 h-1 w-1 animate-pulse rounded-full bg-slate-400/60" />
        <div className="absolute left-[28%] top-36 h-1 w-1 animate-pulse rounded-full bg-amber-300/50" />
        <div className="absolute left-[72%] top-28 h-1 w-1 animate-pulse rounded-full bg-slate-300/60" />
        <div className="absolute right-[12%] top-52 h-1 w-1 animate-pulse rounded-full bg-amber-200/50" />
        <div className="absolute right-[30%] top-24 h-1 w-1 animate-pulse rounded-full bg-slate-300/50" />

        {/* Embers */}
        <div className="absolute left-[18%] top-[48%] h-1 w-1 animate-pulse rounded-full bg-orange-400/40" />
        <div className="absolute right-[18%] top-[58%] h-1 w-1 animate-pulse rounded-full bg-amber-400/50" />
        <div className="absolute left-[50%] top-[72%] h-1 w-1 animate-pulse rounded-full bg-orange-300/30" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px] space-y-6">
        {/* =================================================
            HERO
        ================================================= */}

        <section className="group relative overflow-hidden rounded-3xl border border-slate-700/60 bg-[#0b0e11]/95 shadow-2xl shadow-black/40">
          {/* Moon */}
          <div className="absolute right-16 top-10 h-28 w-28 rounded-full border border-slate-400/10 bg-slate-200/[0.035] shadow-[0_0_70px_rgba(226,232,240,0.08)]" />

          {/* Mountains */}
          <div className="absolute bottom-0 left-0 right-0 h-28 opacity-40">
            <div className="absolute bottom-0 left-[5%] h-24 w-48 rotate-12 bg-slate-950/80 [clip-path:polygon(50%_0,100%_100%,0_100%)]" />

            <div className="absolute bottom-0 left-[24%] h-32 w-64 bg-slate-950/80 [clip-path:polygon(50%_0,100%_100%,0_100%)]" />

            <div className="absolute bottom-0 right-[18%] h-28 w-56 -rotate-6 bg-slate-950/80 [clip-path:polygon(50%_0,100%_100%,0_100%)]" />

            <div className="absolute bottom-0 right-[2%] h-20 w-44 bg-slate-950/80 [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
          </div>

          {/* Castle */}
          <div className="absolute bottom-0 right-[28%] opacity-40">
            <div className="relative h-24 w-32 border-x border-t border-slate-700 bg-slate-950/70">
              <div className="absolute -left-4 bottom-0 h-32 w-7 border border-slate-700 bg-slate-950" />
              <div className="absolute -right-4 bottom-0 h-32 w-7 border border-slate-700 bg-slate-950" />

              <div className="absolute left-4 top-8 h-3 w-3 bg-amber-300/30" />
              <div className="absolute left-20 top-12 h-3 w-3 bg-amber-300/20" />
              <div className="absolute left-14 top-2 h-2 w-2 bg-amber-300/20" />
            </div>
          </div>

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0e11] via-[#0b0e11]/90 to-transparent" />

          <div className="relative px-6 py-10 sm:px-10 lg:px-14">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/[0.06]">
                  <Crown className="h-5 w-5 text-amber-300" />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-300/70">
                    The Realm · Identity
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    House Record
                  </p>
                </div>
              </div>

              <h1 className="font-serif text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">
                Your Profile
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">
                Every learner carries a banner. Shape your identity,
                choose your sigil, and keep your record worthy of
                the realm.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-full border border-slate-700/70 bg-black/20 px-4 py-2 text-xs text-slate-400 backdrop-blur-sm">
                  <Shield className="h-3.5 w-3.5 text-sky-300" />
                  Protected Account
                </div>

                <div className="flex items-center gap-2 rounded-full border border-slate-700/70 bg-black/20 px-4 py-2 text-xs text-slate-400 backdrop-blur-sm">
                  <Sword className="h-3.5 w-3.5 text-amber-300" />
                  Learner of the Realm
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          {/* =================================================
              PROFILE CARD
          ================================================= */}

          <section className="group relative overflow-hidden rounded-3xl border border-slate-700/60 bg-[#0b0e11]/95 shadow-xl shadow-black/20">
            {/* Top line */}
            <div className="h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-300" />

                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300/70">
                      Personal Record
                    </p>
                  </div>

                  <h2 className="mt-2 font-serif text-2xl font-semibold text-slate-100">
                    House Identity
                  </h2>
                </div>

                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="group/btn inline-flex items-center justify-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/[0.05] px-4 py-2.5 text-sm font-medium text-amber-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300/40 hover:bg-amber-400/[0.1] hover:shadow-[0_0_25px_rgba(251,191,36,0.08)]"
                  >
                    <Pencil className="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-12" />
                    Edit Record
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm text-slate-300 transition hover:border-slate-600 hover:text-white disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>

                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-sm font-medium text-amber-200 transition hover:bg-amber-400/15 disabled:opacity-50"
                    >
                      {saving ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}

                      {saving ? "Saving..." : "Save Record"}
                    </button>
                  </div>
                )}
              </div>

              {/* =================================================
                  AVATAR
              ================================================= */}

              <div className="mt-8 flex flex-col items-center gap-5 border-b border-slate-800/80 pb-8 sm:flex-row">
                <div className="relative">
                  {/* Outer ring */}
                  <div className="absolute -inset-2 rounded-full border border-amber-300/10" />

                  <div className="absolute -inset-4 rounded-full border border-slate-700/30" />

                  {/* Avatar */}
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-amber-300/30 bg-slate-900 shadow-[0_0_40px_rgba(251,191,36,0.08)] transition-all duration-500 hover:scale-105 hover:border-amber-300/50 hover:shadow-[0_0_55px_rgba(251,191,36,0.14)]">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Profile avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-12 w-12 text-slate-600" />
                      </div>
                    )}

                    <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/[0.08] via-transparent to-black/30" />
                  </div>

                  {/* Online indicator */}
                  <div className="absolute bottom-2 right-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-[#0b0e11] bg-emerald-400">
                    <Check className="h-3 w-3 text-slate-950" />
                  </div>
                </div>

                <div className="text-center sm:text-left">
                  <p className="font-serif text-xl font-semibold text-slate-100">
                    {user.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedAvatarName}
                  </p>

                  {editing && (
                    <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                      <button
                        onClick={() =>
                          setShowAvatarPicker(
                            !showAvatarPicker
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 transition hover:border-amber-400/30 hover:text-amber-200"
                      >
                        <User className="h-3.5 w-3.5" />
                        Choose Sigil
                      </button>

                      <button
                        onClick={randomAvatar}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 transition hover:border-sky-400/30 hover:text-sky-200"
                      >
                        <Shuffle className="h-3.5 w-3.5" />
                        Random
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* =================================================
                  AVATAR PICKER
              ================================================= */}

              {editing && showAvatarPicker && (
                <div className="mt-6 rounded-2xl border border-slate-700/70 bg-[#080b0e] p-4 shadow-2xl">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="font-serif font-semibold text-slate-200">
                        Choose Your Sigil
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Select the banner that represents you.
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setShowAvatarPicker(false)
                      }
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-slate-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                    {AVATARS.map((item) => {
                      const selected =
                        avatar === item.url;

                      return (
                        <button
                          key={item.name}
                          onClick={() =>
                            selectAvatar(item.url)
                          }
                          className={`group relative overflow-hidden rounded-xl border p-2 transition-all duration-300 ${
                            selected
                              ? "border-amber-300/60 bg-amber-300/[0.08] shadow-[0_0_25px_rgba(251,191,36,0.08)]"
                              : "border-slate-800 bg-slate-900/60 hover:-translate-y-1 hover:border-slate-600"
                          }`}
                        >
                          <div className="aspect-square overflow-hidden rounded-lg bg-slate-950">
                            <img
                              src={item.url}
                              alt={item.name}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                            />
                          </div>

                          <p className="mt-2 truncate text-[10px] text-slate-500">
                            {item.name}
                          </p>

                          {selected && (
                            <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-300">
                              <Check className="h-3 w-3 text-slate-950" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* =================================================
                  FORM
              ================================================= */}

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {/* Name */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <User className="h-3.5 w-3.5" />
                    Name
                  </label>

                  {editing ? (
                    <input
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      maxLength={100}
                      className="w-full rounded-xl border border-slate-700 bg-[#080b0e] px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20"
                      placeholder="Enter your name"
                    />
                  ) : (
                    <div className="rounded-xl border border-slate-800 bg-[#080b0e]/70 px-4 py-3 text-sm text-slate-200">
                      {user.name || "Not set"}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#080b0e]/70 px-4 py-3">
                    <span className="min-w-0 flex-1 truncate text-sm text-slate-300">
                      {user.email}
                    </span>

                    {user.isVerified ? (
                      <span className="flex shrink-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    ) : (
                      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                        Unverified
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setShowEmailForm(
                        !showEmailForm
                      )
                    }
                    className="mt-2 inline-flex items-center gap-1.5 text-xs text-sky-300 transition hover:text-sky-200"
                  >
                    <AtSign className="h-3.5 w-3.5" />
                    Change email
                  </button>
                </div>
              </div>

              {/* =================================================
                  BIO
              ================================================= */}

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Chronicle / Bio
                  </label>

                  {editing && (
                    <span
                      className={`text-[10px] ${
                        bio.length > 270
                          ? "text-amber-400"
                          : "text-slate-600"
                      }`}
                    >
                      {bio.length}/300
                    </span>
                  )}
                </div>

                {editing ? (
                  <textarea
                    value={bio}
                    onChange={(e) =>
                      setBio(e.target.value)
                    }
                    maxLength={300}
                    rows={5}
                    placeholder="Write a short description about yourself..."
                    className="w-full resize-none rounded-xl border border-slate-700 bg-[#080b0e] px-4 py-3 text-sm leading-6 text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20"
                  />
                ) : (
                  <div className="min-h-[120px] rounded-xl border border-slate-800 bg-[#080b0e]/70 px-4 py-4 text-sm leading-7 text-slate-400">
                    {user.bio ||
                      "No chronicle has been written yet."}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* =================================================
              ACCOUNT DETAILS
          ================================================= */}

          <div className="space-y-6">
            {/* Account */}
            <section className="relative overflow-hidden rounded-3xl border border-slate-700/60 bg-[#0b0e11]/95 shadow-xl shadow-black/20">
              <div className="h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent" />

              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/[0.05]">
                    <Shield className="h-5 w-5 text-sky-300" />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-sky-300/70">
                      Maester's Archive
                    </p>

                    <h3 className="mt-1 font-serif text-xl font-semibold text-slate-100">
                      Account Details
                    </h3>
                  </div>
                </div>

                <div className="mt-7 space-y-3">
                  {/* Role */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#080b0e]/70 p-4">
                    <div>
                      <p className="text-xs text-slate-500">
                        Rank
                      </p>

                      <p className="mt-1 text-sm font-medium capitalize text-slate-200">
                        {user.role || "student"}
                      </p>
                    </div>

                    <Crown className="h-5 w-5 text-amber-300/70" />
                  </div>

                  {/* Joined */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#080b0e]/70 p-4">
                    <div>
                      <p className="text-xs text-slate-500">
                        Joined the Realm
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-200">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>

                    <CalendarDays className="h-5 w-5 text-slate-500" />
                  </div>

                  {/* Verification */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#080b0e]/70 p-4">
                    <div>
                      <p className="text-xs text-slate-500">
                        Email Status
                      </p>

                      <p
                        className={`mt-1 text-sm font-medium ${
                          user.isVerified
                            ? "text-emerald-400"
                            : "text-amber-400"
                        }`}
                      >
                        {user.isVerified
                          ? "Verified"
                          : "Awaiting verification"}
                      </p>
                    </div>

                    {user.isVerified ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <Mail className="h-5 w-5 text-amber-400" />
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                SECURITY
            ================================================= */}

            <section className="relative overflow-hidden rounded-3xl border border-slate-700/60 bg-[#0b0e11]/95 shadow-xl shadow-black/20">
              <div className="h-px bg-gradient-to-r from-transparent via-red-400/20 to-transparent" />

              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-400/15 bg-red-400/[0.04]">
                    <Sword className="h-5 w-5 text-red-300/80" />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-red-300/60">
                      Keep Your Walls Strong
                    </p>

                    <h3 className="mt-1 font-serif text-xl font-semibold text-slate-100">
                      Security
                    </h3>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                  Protect your account by keeping your password
                  strong and unique.
                </p>

                <button
                  onClick={() =>
                    setShowPasswordForm(
                      !showPasswordForm
                    )
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm text-slate-300 transition hover:border-red-400/30 hover:text-red-200"
                >
                  <Shield className="h-4 w-4" />
                  {showPasswordForm
                    ? "Close"
                    : "Change Password"}
                </button>

                {/* Password form */}
                {showPasswordForm && (
                  <form
                    onSubmit={handleChangePassword}
                    className="mt-5 space-y-3 border-t border-slate-800 pt-5"
                  >
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) =>
                        setCurrentPassword(
                          e.target.value
                        )
                      }
                      placeholder="Current password"
                      className="w-full rounded-xl border border-slate-700 bg-[#080b0e] px-4 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-red-400/40"
                    />

                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(
                          e.target.value
                        )
                      }
                      placeholder="New password"
                      className="w-full rounded-xl border border-slate-700 bg-[#080b0e] px-4 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-red-400/40"
                    />

                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      placeholder="Confirm new password"
                      className="w-full rounded-xl border border-slate-700 bg-[#080b0e] px-4 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-red-400/40"
                    />

                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm font-medium text-red-200 transition hover:bg-red-400/[0.1] disabled:opacity-50"
                    >
                      {changingPassword && (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      )}

                      {changingPassword
                        ? "Changing..."
                        : "Change Password"}
                    </button>
                  </form>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* =================================================
            EMAIL CHANGE
        ================================================= */}

        {showEmailForm && (
          <section className="relative overflow-hidden rounded-3xl border border-slate-700/60 bg-[#0b0e11]/95 shadow-xl">
            <div className="h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent" />

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/[0.05]">
                  <AtSign className="h-5 w-5 text-sky-300" />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-sky-300/70">
                    Raven Message
                  </p>

                  <h3 className="mt-1 font-serif text-xl font-semibold text-slate-100">
                    Change Email Address
                  </h3>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">
                Enter a new email address. A verification message
                will be sent before the new address becomes your
                account email.
              </p>

              <form
                onSubmit={handleChangeEmail}
                className="mt-6 flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) =>
                    setNewEmail(e.target.value)
                  }
                  placeholder="new-email@example.com"
                  className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-[#080b0e] px-4 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-sky-400/40 focus:ring-1 focus:ring-sky-400/10"
                />

                <button
                  type="submit"
                  disabled={changingEmail}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-400/20 bg-sky-400/[0.06] px-5 py-3 text-sm font-medium text-sky-200 transition hover:bg-sky-400/[0.1] disabled:opacity-50"
                >
                  {changingEmail ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}

                  {changingEmail
                    ? "Sending..."
                    : "Send Verification"}
                </button>
              </form>
            </div>
          </section>
        )}

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="flex items-center justify-center gap-3 py-5 text-center">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-slate-700" />

          <span className="text-[10px] uppercase tracking-[0.35em] text-slate-700">
            Your story · Your realm · Your journey
          </span>

          <div className="h-px w-16 bg-gradient-to-l from-transparent to-slate-700" />
        </div>
      </div>
    </div>
  );
}

export default Profile;