import { useEffect, useMemo, useRef, useState } from "react";

import {
  ArrowLeft,
  Award,
  BadgeCheck,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clipboard,
  CircleDot,
  Crown,
  Edit3,
  Flame,
  BookOpen,
  Gem,
  KeyRound,
  LoaderCircle,
  Mail,
  Medal,
  Pencil,
  Save,
  Shield,
  ShieldCheck,
  Sparkles,
  Swords,
  Trophy,
  User,
  X,
  WandSparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

/* =========================================================
   PROFILE SIGILS
========================================================= */

const PROFILE_SIGILS = [
  {
    id: "royal",
    name: "The Crown",
    description: "Keeper of Knowledge",
    className: "ROYAL BLOOD",
    icon: Crown,
  },
  {
    id: "wolf",
    name: "The Guardian",
    description: "Guardian of the Realm",
    className: "GUARDIAN",
    icon: Shield,
  },
  {
    id: "warrior",
    name: "The Warrior",
    description: "Master of the Blade",
    className: "WARRIOR",
    icon: Swords,
  },
  {
    id: "dragon",
    name: "The Flame",
    description: "Bearer of Fire",
    className: "DRAGON",
    icon: Flame,
  },
  {
    id: "knight",
    name: "The Knight",
    description: "Protector of Scholars",
    className: "KNIGHT",
    icon: Medal,
  },
  {
    id: "gem",
    name: "The Gem",
    description: "Keeper of Wisdom",
    className: "WISDOM",
    icon: Gem,
  },
];

/* =========================================================
   MAIN
========================================================= */

function InstructorProfile() {
  const navigate = useNavigate();

  const { user, setUser } = useAuth();

  const profileRef = useRef(null);
  const autosaveTimerRef = useRef(null);
  const initialLoadRef = useRef(false);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [selectedSigil, setSelectedSigil] = useState("royal");

  const [showSigilSelector, setShowSigilSelector] = useState(false);

  const [copiedEmail, setCopiedEmail] = useState(false);

  const [cursor, setCursor] = useState({
    x: 50,
    y: 50,
  });

  const [cursorVisible, setCursorVisible] = useState(false);

  const [saveState, setSaveState] = useState("idle");

  /* =======================================================
     LOAD USER
  ======================================================= */

  useEffect(() => {
    if (!user) return;

    setName(user.name || "");

    if (user.profileIcon) {
      setSelectedSigil(user.profileIcon);
    }

    initialLoadRef.current = true;
  }, [user]);

  /* =======================================================
     CLEAN AUTOSAVE TIMER
  ======================================================= */

  useEffect(() => {
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, []);

  /* =======================================================
     CURRENT SIGIL
  ======================================================= */

  const currentSigil = useMemo(() => {
    return (
      PROFILE_SIGILS.find(
        (sigil) => sigil.id === selectedSigil
      ) || PROFILE_SIGILS[0]
    );
  }, [selectedSigil]);

  const SigilIcon = currentSigil.icon;

  /* =======================================================
     MOUSE FOLLOW
  ======================================================= */

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) / rect.width) * 100;

    const y =
      ((event.clientY - rect.top) / rect.height) * 100;

    setCursor({
      x,
      y,
    });
  };

  /* =======================================================
     COPY EMAIL
  ======================================================= */

  const handleCopyEmail = async () => {
    if (!user?.email) return;

    try {
      await navigator.clipboard.writeText(user.email);

      setCopiedEmail(true);

      toast.success("Email copied.");

      setTimeout(() => {
        setCopiedEmail(false);
      }, 2000);
    } catch (error) {
      console.error(error);

      toast.error("Unable to copy email.");
    }
  };

  /* =======================================================
     SAVE PROFILE
  ======================================================= */

  const saveProfile = async (
    nextName = name,
    nextSigil = selectedSigil,
    showToast = false
  ) => {
    const trimmedName = nextName.trim();

    if (!trimmedName) {
      setSaveState("error");

      if (showToast) {
        toast.error("Your name cannot be empty.");
      }

      return false;
    }

    if (trimmedName.length < 2) {
      setSaveState("error");

      if (showToast) {
        toast.error(
          "Your name must contain at least 2 characters."
        );
      }

      return false;
    }

    try {
      setSaving(true);
      setSaveState("saving");

      const response = await api.put("/auth/profile", {
        name: trimmedName,
        profileIcon: nextSigil,
      });

      if (response.data?.success) {
        const updatedUser = response.data.user;

        setUser(updatedUser);

        setName(updatedUser?.name || trimmedName);

        if (updatedUser?.profileIcon) {
          setSelectedSigil(updatedUser.profileIcon);
        }

        setSaveState("saved");

        if (showToast) {
          toast.success("Identity updated.");
        }

        return true;
      }

      setSaveState("error");

      if (showToast) {
        toast.error(
          response.data?.message ||
            "Unable to update your profile."
        );
      }

      return false;
    } catch (error) {
      console.error(
        "Instructor profile update error:",
        error
      );

      setSaveState("error");

      if (showToast) {
        toast.error(
          error.response?.data?.message ||
            "Unable to update your profile."
        );
      }

      return false;
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     AUTO SAVE NAME
  ======================================================= */

  useEffect(() => {
    if (!editing) return;
    if (!initialLoadRef.current) return;

    const trimmedName = name.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setSaveState("error");
      return;
    }

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    setSaveState("waiting");

    autosaveTimerRef.current = setTimeout(() => {
      saveProfile(
        trimmedName,
        selectedSigil,
        false
      );
    }, 900);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [name, editing]);

  /* =======================================================
     SIGIL SELECT
  ======================================================= */

  const handleSigilSelect = async (sigilId) => {
    setSelectedSigil(sigilId);

    setShowSigilSelector(false);

    const sigil =
      PROFILE_SIGILS.find(
        (item) => item.id === sigilId
      ) || PROFILE_SIGILS[0];

    toast.success(`${sigil.name} chosen.`);

    if (editing) {
      await saveProfile(
        name,
        sigilId,
        false
      );
    } else {
      await saveProfile(
        name,
        sigilId,
        false
      );
    }
  };

  /* =======================================================
     DONE EDITING
  ======================================================= */

  const handleFinishEditing = async () => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    const success = await saveProfile(
      name,
      selectedSigil,
      false
    );

    if (success) {
      setEditing(false);
      toast.success("Identity forged successfully.");
    }
  };

  /* =======================================================
     ENTER EDIT MODE
  ======================================================= */

  const handleStartEditing = () => {
    setEditing(true);
    setSaveState("idle");
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (!user) {
    return (
      <div className="flex min-h-[700px] items-center justify-center bg-[#050505] text-white">
        <div className="relative flex flex-col items-center gap-5">
          <div className="absolute h-48 w-48 rounded-full bg-orange-500/10 blur-[100px]" />

          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/20 to-black text-orange-400 shadow-[0_0_50px_rgba(249,115,22,.18)]">
            <Crown size={32} />
          </div>

          <LoaderCircle
            size={22}
            className="animate-spin text-orange-400"
          />

          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500">
            Loading Instructor Profile
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     USER DATA
  ======================================================= */

  const firstLetter =
    user.name?.charAt(0)?.toUpperCase() || "I";

  const joinedDate = user.createdAt
    ? new Date(user.createdAt)
    : null;

  const joinedText = joinedDate
    ? joinedDate.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "Unknown";

  return (
    <div
      ref={profileRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setCursorVisible(true)}
      onPointerLeave={() => setCursorVisible(false)}
      className="got-profile relative min-h-screen overflow-hidden bg-[#030303] px-4 py-8 text-white sm:px-6 lg:px-8"
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <ProfileBackground />

      {/* =====================================================
          CUSTOM ROYAL CURSOR
      ===================================================== */}

      <div
        className={`got-cursor ${
          cursorVisible
            ? "got-cursor-visible"
            : ""
        }`}
        style={{
          left: `${cursor.x}%`,
          top: `${cursor.y}%`,
        }}
      >
        <div className="got-cursor-ring">
          <Crown size={11} />
        </div>

        <div className="got-cursor-core" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* ===================================================
            TOP BAR
        =================================================== */}

        <div className="mb-8 flex items-center justify-between">

          <button
            type="button"
            onClick={() =>
              navigate("/instructor/dashboard")
            }
            className="profile-nav-button group"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            Back to Dashboard
          </button>

          <div className="hidden items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-neutral-600 sm:flex">
            <Shield size={13} />

            Instructor Realm

            <span className="text-orange-500/50">
              •
            </span>

            Identity
          </div>
        </div>

        {/* ===================================================
            TITLE
        =================================================== */}

        <div className="mb-8">

          <div className="mb-4 flex items-center gap-3">

            <div className="h-px w-10 bg-gradient-to-r from-transparent to-orange-500" />

            <span className="text-[9px] font-black uppercase tracking-[0.35em] text-orange-400">
              Hall of Knowledge
            </span>

            <div className="h-px w-10 bg-gradient-to-l from-transparent to-orange-500" />

          </div>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>

              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                Instructor Profile
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500">
                Manage your instructor identity,
                personal information and realm
                preferences.
              </p>

            </div>

            <div className="hidden rounded-full border border-orange-500/20 bg-orange-500/[0.05] px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-orange-400 md:block">
              Smart LMS Identity
            </div>

          </div>
        </div>

        {/* ===================================================
            PROFILE HERO
        =================================================== */}

        <section
          className={`profile-hero relative overflow-hidden ${
            editing
              ? "profile-hero-editing"
              : ""
          }`}
        >

          {/* ENERGY LINE */}

          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-energy" />

          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-900/70 to-transparent" />

          {/* GLOWS */}

          <div className="absolute -right-32 -top-32 h-[450px] w-[450px] rounded-full bg-orange-600/[0.08] blur-[120px]" />

          <div className="absolute -bottom-40 -left-20 h-[400px] w-[400px] rounded-full bg-amber-500/[0.05] blur-[120px]" />

          {/* WATERMARK */}

          <div className="pointer-events-none absolute -right-10 -top-16 text-orange-500/[0.035]">
            <SigilIcon
              size={420}
              strokeWidth={0.7}
            />
          </div>

          {/* FLOATING EMBERS */}

          <div className="hero-embers pointer-events-none">
            {[...Array(14)].map(
              (_, index) => (
                <span
                  key={index}
                  style={{
                    "--ember-delay": `${
                      index * 0.35
                    }s`,
                    "--ember-x": `${
                      (index * 37) % 100
                    }%`,
                  }}
                />
              )
            )}
          </div>

          {/* ROYAL RINGS */}

          <div className="royal-energy-ring">
            <span />
            <span />
            <span />
          </div>

          <div className="relative z-10 p-6 sm:p-9 lg:p-11">

            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

              {/* =================================================
                  IDENTITY
              ================================================= */}

              <div className="flex items-center gap-5 sm:gap-7">

                {/* SIGIL */}

                <button
                  type="button"
                  onClick={() =>
                    setShowSigilSelector(true)
                  }
                  className="profile-sigil group relative shrink-0"
                >

                  <span className="sigil-orbit sigil-orbit-one" />

                  <span className="sigil-orbit sigil-orbit-two" />

                  <span className="absolute left-2 top-2 h-4 w-4 border-l border-t border-orange-400/70" />

                  <span className="absolute right-2 top-2 h-4 w-4 border-r border-t border-orange-400/70" />

                  <span className="absolute bottom-2 left-2 h-4 w-4 border-b border-l border-orange-400/70" />

                  <span className="absolute bottom-2 right-2 h-4 w-4 border-b border-r border-orange-400/70" />

                  <div className="absolute inset-3 rounded-[28px] bg-orange-500/10 blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:bg-orange-500/20" />

                  <div className="relative z-10 flex h-full w-full items-center justify-center">

                    <SigilIcon
                      size={48}
                      strokeWidth={1.1}
                      className="text-orange-400 transition-all duration-700 group-hover:scale-125 group-hover:rotate-[8deg] group-hover:text-orange-300"
                    />

                  </div>

                  <span className="profile-sigil-edit">
                    <Pencil size={11} />
                  </span>

                  <span className="profile-sigil-crown">
                    <Crown size={10} />
                  </span>

                </button>

                {/* INFORMATION */}

                <div className="min-w-0">

                  <div className="mb-3 flex flex-wrap items-center gap-2">

                    <span className="profile-badge">
                      <Crown size={11} />
                      {currentSigil.name}
                    </span>

                    {user.isVerified && (
                      <span className="verified-badge">
                        <BadgeCheck size={11} />
                        Verified
                      </span>
                    )}

                  </div>

                  <h2 className="truncate text-2xl font-black text-white sm:text-4xl">
                    {user.name || firstLetter}
                  </h2>

                  <p className="mt-1 truncate text-sm text-neutral-500">
                    {user.email}
                  </p>

                  <p className="mt-3 text-xs italic text-orange-400/70">
                    "{currentSigil.description}"
                  </p>

                </div>
              </div>

              {/* =================================================
                  EDIT BUTTON / STATUS
              ================================================= */}

              {!editing ? (
                <button
                  type="button"
                  onClick={handleStartEditing}
                  className="profile-primary-button profile-edit-trigger group"
                >

                  <span className="button-energy" />

                  <span className="relative z-10 flex items-center gap-2">

                    <Edit3
                      size={16}
                      className="transition-transform duration-500 group-hover:rotate-[-12deg] group-hover:scale-110"
                    />

                    <span>
                      Forge Identity
                    </span>

                    <Sparkles
                      size={13}
                      className="animate-pulse opacity-60 group-hover:opacity-100"
                    />

                  </span>
                </button>
              ) : (
                <div className="editing-status">

                  <span className="editing-status-orb" />

                  <span className="relative flex items-center gap-2">

                    <WandSparkles size={12} />

                    Forging Identity

                    <span className="editing-dots">
                      <span />
                      <span />
                      <span />
                    </span>

                  </span>

                </div>
              )}

            </div>

            {/* =================================================
                STATS
            ================================================= */}

            <div className="mt-9 grid gap-3 border-t border-white/[0.06] pt-7 sm:grid-cols-3">

              <RealmStat
                icon={<Trophy size={18} />}
                label="Rank"
                value="Knowledge Keeper"
              />

              <RealmStat
                icon={<Flame size={18} />}
                label="Realm Status"
                value="Active Instructor"
              />

              <RealmStat
                icon={<CalendarDays size={18} />}
                label="Joined"
                value={joinedText}
              />

            </div>

          </div>
        </section>

        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.45fr_.55fr]">

          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <section
            className={`profile-panel ${
              editing
                ? "editing-panel-active"
                : ""
            }`}
          >

            <div className="border-b border-white/[0.06] px-6 py-6 sm:px-8">

              <div className="flex items-center justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    <User
                      size={17}
                      className="text-orange-400"
                    />

                    <h2 className="font-bold text-white">
                      Personal Information
                    </h2>

                  </div>

                  <p className="mt-1 text-xs text-neutral-600">
                    Details associated with your
                    instructor account.
                  </p>

                </div>

                {editing && (
                  <div className="editing-status">

                    <span className="editing-status-orb" />

                    <span className="flex items-center gap-2">
                      <WandSparkles size={11} />
                      Editing
                    </span>

                  </div>
                )}

              </div>

            </div>

            <div className="p-6 sm:p-8">

              <div className="grid gap-5 md:grid-cols-2">

                {/* NAME */}

                <FantasyField
                  label="Full Name"
                  icon={<User size={17} />}
                  active={editing}
                >

                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    disabled={!editing || saving}
                    className={`premium-profile-input ${
                      editing
                        ? "premium-profile-input-active"
                        : ""
                    }`}
                    placeholder="Enter your royal name"
                  />

                  {editing && (
                    <div className="input-rune">
                      <Sparkles size={11} />
                      Identity Forge
                    </div>
                  )}

                </FantasyField>

                {/* EMAIL */}

                <FantasyField
                  label="Email Address"
                  icon={<Mail size={17} />}
                >

                  <input
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="premium-profile-input cursor-not-allowed text-neutral-600"
                  />

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-neutral-600 transition-all hover:bg-orange-500/10 hover:text-orange-400"
                  >
                    {copiedEmail ? (
                      <Check size={15} />
                    ) : (
                      <Clipboard size={15} />
                    )}
                  </button>

                </FantasyField>

              </div>

              {/* AUTO SAVE STATUS */}

              {editing && (
                <div className="mt-5 flex items-center justify-between rounded-2xl border border-orange-500/10 bg-orange-500/[0.025] px-4 py-3">

                  <div className="flex items-center gap-2">

                    <div
                      className={`save-status-dot save-status-${saveState}`}
                    />

                    <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                      {saveState === "saving"
                        ? "Forging changes..."
                        : saveState === "saved"
                        ? "Identity saved"
                        : saveState === "waiting"
                        ? "Waiting for changes..."
                        : saveState === "error"
                        ? "Check your identity"
                        : "Auto-save active"}
                    </span>

                  </div>

                  {saveState === "saved" && (
                    <CheckCircle2
                      size={14}
                      className="text-emerald-400"
                    />
                  )}

                  {saveState === "saving" && (
                    <LoaderCircle
                      size={14}
                      className="animate-spin text-orange-400"
                    />
                  )}

                </div>
              )}

              {/* ACCOUNT DETAILS */}

              <div className="mt-9">

                <div className="mb-5 flex items-center gap-4">

                  <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.07]" />

                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-neutral-700">
                    Account Details
                  </span>

                  <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.07]" />

                </div>

                <div className="grid gap-3 sm:grid-cols-2">

                  <InfoTile
                    icon={<Crown size={17} />}
                    title="Realm Role"
                    value={
                      user.role ||
                      "Instructor"
                    }
                  />

                  <InfoTile
                    icon={<ShieldCheck size={17} />}
                    title="Account Status"
                    value={
                      user.isVerified
                        ? "Verified Account"
                        : "Active Account"
                    }
                    verified={user.isVerified}
                  />

                  <InfoTile
                    icon={<Award size={17} />}
                    title="Instructor Rank"
                    value="Knowledge Keeper"
                  />

                  <InfoTile
                    icon={<Sparkles size={17} />}
                    title="Active Sigil"
                    value={currentSigil.name}
                  />

                </div>
              </div>

              {/* DONE */}

              {editing && (
                <div className="mt-8 flex items-center justify-between border-t border-white/[0.06] pt-6">

                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-600">

                    <CircleDot
                      size={11}
                      className="animate-pulse text-orange-400"
                    />

                    Changes save automatically

                  </div>

                  <button
                    type="button"
                    onClick={handleFinishEditing}
                    disabled={saving}
                    className="profile-secondary-button"
                  >

                    {saving ? (
                      <LoaderCircle
                        size={15}
                        className="animate-spin"
                      />
                    ) : (
                      <Check size={15} />
                    )}

                    Done

                  </button>

                </div>
              )}

            </div>
          </section>

          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <div className="space-y-6">

            {/* SIGIL */}

            <section className="profile-small-panel group relative overflow-hidden">

              <div className="absolute -right-12 -top-12 text-orange-500/[0.035] transition-all duration-700 group-hover:scale-125 group-hover:text-orange-500/[0.07]">

                <SigilIcon size={190} />

              </div>

              <div className="relative z-10">

                <div className="flex items-center gap-2">

                  <Shield
                    size={18}
                    className="text-orange-400"
                  />

                  <h2 className="font-bold text-white">
                    Royal Sigil
                  </h2>

                </div>

                <p className="mt-2 text-xs leading-5 text-neutral-600">
                  Choose the symbol representing
                  your instructor identity.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setShowSigilSelector(true)
                  }
                  className="sigil-preview group/sigil mt-5"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/[0.06] text-orange-400 transition-all duration-300 group-hover/sigil:scale-105 group-hover/sigil:shadow-[0_0_30px_rgba(249,115,22,.15)]">

                      <SigilIcon size={22} />

                    </div>

                    <div className="text-left">

                      <p className="text-sm font-bold text-neutral-300">
                        {currentSigil.name}
                      </p>

                      <p className="mt-1 text-[10px] text-neutral-600">
                        {currentSigil.description}
                      </p>

                    </div>

                  </div>

                  <ChevronRight
                    size={17}
                    className="text-neutral-700 transition-all group-hover/sigil:translate-x-1 group-hover/sigil:text-orange-400"
                  />

                </button>

              </div>
            </section>

            {/* SECURITY */}

            <section className="profile-small-panel">

              <div className="flex items-center gap-2">

                <KeyRound
                  size={18}
                  className="text-orange-400"
                />

                <h2 className="font-bold text-white">
                  Account Security
                </h2>

              </div>

              <p className="mt-2 text-xs leading-5 text-neutral-600">
                Manage your account access and
                security settings.
              </p>

              <button
                type="button"
                onClick={() => {
                  toast(
                    "Password management is ready to connect."
                  );

                  navigate(
                    "/instructor/settings"
                  );
                }}
                className="security-button group/security mt-5"
              >

                <div className="flex items-center gap-3">

                  <KeyRound
                    size={16}
                    className="transition-transform group-hover/security:rotate-12"
                  />

                  Change Password

                </div>

                <ChevronRight
                  size={16}
                  className="transition-transform group-hover/security:translate-x-1"
                />

              </button>

            </section>

            {/* VERIFICATION */}

            <section
              className={`profile-small-panel ${
                user.isVerified
                  ? "border-emerald-500/20 bg-emerald-500/[0.025]"
                  : "border-orange-500/20 bg-orange-500/[0.025]"
              }`}
            >

              <div className="flex items-start gap-3">

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                    user.isVerified
                      ? "border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-400"
                      : "border-orange-500/20 bg-orange-500/[0.08] text-orange-400"
                  }`}
                >

                  {user.isVerified ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <Bell size={20} />
                  )}

                </div>

                <div>

                  <h3 className="text-sm font-bold text-white">

                    {user.isVerified
                      ? "Verified Instructor"
                      : "Verification Required"}

                  </h3>

                  <p className="mt-1 text-xs leading-5 text-neutral-600">

                    {user.isVerified
                      ? "Your instructor account has been verified."
                      : "Complete email verification to unlock all account capabilities."}

                  </p>

                </div>

              </div>

            </section>
          </div>
        </div>

        {/* ===================================================
            JOURNEY
        =================================================== */}

        <section className="profile-panel mt-6 overflow-hidden">

          <div className="p-6 sm:p-8">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <Trophy
                    size={19}
                    className="text-orange-400"
                  />

                  <h2 className="font-bold text-white">
                    Instructor Journey
                  </h2>

                </div>

                <p className="mt-1 text-xs text-neutral-600">
                  Your path as a keeper of knowledge.
                </p>

              </div>

              <div className="relative overflow-hidden rounded-full border border-orange-500/20 bg-orange-500/[0.05] px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-orange-400">

                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-orange-400/10 to-transparent animate-shimmer" />

                <span className="relative flex items-center gap-2">

                  <Sparkles size={12} />

                  Level I

                </span>

              </div>

            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-3">

              <JourneyCard
                icon={<BookOpen size={21} />}
                title="Courses"
                value="Your Courses"
                description="Build your learning realm"
              />

              <JourneyCard
                icon={<User size={21} />}
                title="Students"
                value="Your Students"
                description="Guide the next generation"
              />

              <JourneyCard
                icon={<Award size={21} />}
                title="Achievements"
                value="Coming Soon"
                description="Earn your place in history"
              />

            </div>
          </div>
        </section>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <div className="flex items-center justify-center gap-3 py-10">

          <span className="h-px w-20 bg-gradient-to-r from-transparent to-white/[0.08]" />

          <Crown
            size={13}
            className="text-orange-500/50"
          />

          <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-neutral-700">
            Smart LMS • Keeper of Knowledge
          </span>

          <Crown
            size={13}
            className="text-orange-500/50"
          />

          <span className="h-px w-20 bg-gradient-to-l from-transparent to-white/[0.08]" />

        </div>

      </div>

      {/* =====================================================
          SIGIL MODAL
      ===================================================== */}

      {showSigilSelector && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setShowSigilSelector(false);
            }
          }}
        >

          <div className="profile-modal">

            <div className="h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-energy" />

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-6">

              <div>

                <div className="flex items-center gap-2">

                  <Crown
                    size={19}
                    className="text-orange-400"
                  />

                  <h2 className="font-bold text-white">
                    Choose Your Sigil
                  </h2>

                </div>

                <p className="mt-1 text-xs text-neutral-600">
                  Select the symbol representing
                  your instructor identity.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowSigilSelector(false)
                }
                className="rounded-xl p-2 text-neutral-600 transition-all hover:bg-white/[0.05] hover:text-orange-400"
              >
                <X size={18} />
              </button>

            </div>

            {/* CHARACTER SELECTION */}

            <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">

              {PROFILE_SIGILS.map(
                (sigil) => {
                  const Icon = sigil.icon;

                  const selected =
                    selectedSigil ===
                    sigil.id;

                  return (
                    <button
                      key={sigil.id}
                      type="button"
                      onClick={() =>
                        handleSigilSelect(
                          sigil.id
                        )
                      }
                      className={`sigil-option character-card ${
                        selected
                          ? "sigil-selected"
                          : ""
                      }`}
                    >

                      {selected && (
                        <div className="selected-character-crown">
                          <Crown size={12} />
                        </div>
                      )}

                      <span className="character-rune character-rune-top">
                        <CircleDot size={9} />
                      </span>

                      <div
                        className={`sigil-icon ${
                          selected
                            ? "sigil-icon-selected"
                            : ""
                        }`}
                      >
                        <Icon
                          size={27}
                          strokeWidth={1.2}
                        />
                      </div>

                      <p className="mt-4 text-sm font-bold text-neutral-300">
                        {sigil.name}
                      </p>

                      <p className="mt-1 text-[10px] leading-4 text-neutral-600">
                        {sigil.description}
                      </p>

                      <div className="character-class">

                        <Icon size={10} />

                        <span>
                          {sigil.className}
                        </span>

                      </div>

                      <div className="character-energy" />

                    </button>
                  );
                }
              )}

            </div>

            <div className="border-t border-white/[0.06] px-6 py-5">

              <p className="text-center text-[8px] font-bold uppercase tracking-[0.25em] text-neutral-700">
                Your symbol • Your identity • Your realm
              </p>

            </div>

          </div>
        </div>
      )}

      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>
        {`

        /* =====================================================
           ENERGY
        ===================================================== */

        @keyframes energy {

          0%, 100% {
            opacity: .25;
            transform: scaleX(.55);
          }

          50% {
            opacity: 1;
            transform: scaleX(1);
          }

        }

        @keyframes shimmer {

          0% {
            transform: translateX(-100%);
          }

          100% {
            transform: translateX(100%);
          }

        }

        .animate-energy {
          animation: energy 4s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }

        /* =====================================================
           CUSTOM CURSOR
        ===================================================== */

        .got-profile {
          cursor: default;
        }

        .got-cursor {
          position: fixed;
          z-index: 9999;
          width: 42px;
          height: 42px;
          pointer-events: none;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: opacity .25s ease;
          mix-blend-mode: screen;
        }

        .got-cursor-visible {
          opacity: 1;
        }

        .got-cursor-ring {
          position: absolute;
          inset: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 1px solid rgba(249,115,22,.45);
          border-radius: 50%;

          color: #fb923c;

          box-shadow:
            0 0 15px rgba(249,115,22,.15),
            inset 0 0 15px rgba(249,115,22,.08);

          animation: cursorSpin 6s linear infinite;
        }

        .got-cursor-core {
          position: absolute;

          left: 50%;
          top: 50%;

          width: 5px;
          height: 5px;

          transform: translate(-50%, -50%);

          border-radius: 50%;

          background: #fb923c;

          box-shadow:
            0 0 10px #fb923c,
            0 0 25px rgba(249,115,22,.8);
        }

        @keyframes cursorSpin {

          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }

        }

        /* =====================================================
           NAV
        ===================================================== */

        .profile-nav-button {

          display: inline-flex;
          align-items: center;
          gap: .55rem;

          border: 1px solid rgba(255,255,255,.07);

          background: rgba(12,12,12,.75);

          padding: .7rem 1rem;

          border-radius: .85rem;

          font-size: .75rem;

          color: #737373;

          backdrop-filter: blur(18px);

          transition: all .3s ease;

        }

        .profile-nav-button:hover {

          transform: translateX(-4px);

          border-color: rgba(249,115,22,.3);

          background: rgba(249,115,22,.05);

          color: #fb923c;

          box-shadow:
            0 0 30px rgba(249,115,22,.06);

        }

        /* =====================================================
           HERO
        ===================================================== */

        .profile-hero {

          border: 1px solid rgba(249,115,22,.17);

          border-radius: 2rem;

          background:
            radial-gradient(
              circle at 80% 20%,
              rgba(249,115,22,.08),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              rgba(25,18,10,.96),
              rgba(10,9,8,.98) 50%,
              rgba(5,5,5,1)
            );

          box-shadow:
            0 35px 100px rgba(0,0,0,.7),
            inset 0 1px rgba(255,255,255,.025);

          transition:
            border-color .5s ease,
            box-shadow .5s ease;

        }

        .profile-hero::before {

          content: "";

          position: absolute;

          inset: 0;

          pointer-events: none;

          opacity: .025;

          background-image:
            linear-gradient(
              rgba(255,255,255,.5) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,.5) 1px,
              transparent 1px
            );

          background-size: 70px 70px;

        }

        .profile-hero-editing {

          border-color: rgba(249,115,22,.42);

          box-shadow:
            0 35px 100px rgba(0,0,0,.75),
            0 0 70px rgba(249,115,22,.08),
            inset 0 0 70px rgba(249,115,22,.025);

          animation: editingRealm 3s ease-in-out infinite;

        }

        @keyframes editingRealm {

          0%,100% {
            box-shadow:
              0 35px 100px rgba(0,0,0,.75),
              0 0 40px rgba(249,115,22,.04);
          }

          50% {
            box-shadow:
              0 35px 100px rgba(0,0,0,.75),
              0 0 80px rgba(249,115,22,.10);
          }

        }

        /* =====================================================
           SIGIL
        ===================================================== */

        .profile-sigil {

          display: flex;

          height: 8rem;
          width: 8rem;

          align-items: center;
          justify-content: center;

          border-radius: 2rem;

          border: 1px solid rgba(249,115,22,.35);

          background:
            linear-gradient(
              145deg,
              rgba(90,40,10,.5),
              rgba(15,10,7,.95)
            );

          color: #fb923c;

          box-shadow:
            0 0 40px rgba(249,115,22,.12),
            inset 0 1px rgba(255,255,255,.04);

          transition:
            transform .5s cubic-bezier(.2,.8,.2,1),
            border-color .5s ease,
            box-shadow .5s ease;

        }

        .profile-sigil:hover {

          transform:
            translateY(-5px)
            scale(1.03);

          border-color:
            rgba(251,146,60,.7);

          box-shadow:
            0 0 70px rgba(249,115,22,.25),
            inset 0 1px rgba(255,255,255,.07);

        }

        .sigil-orbit {

          position: absolute;

          border: 1px solid rgba(249,115,22,.18);

          border-radius: 50%;

          pointer-events: none;

        }

        .sigil-orbit-one {

          inset: -8px;

          animation:
            orbitRotate 8s linear infinite;

        }

        .sigil-orbit-two {

          inset: -14px;

          border-color:
            rgba(251,146,60,.08);

          animation:
            orbitRotateReverse 12s linear infinite;

        }

        @keyframes orbitRotate {

          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }

        }

        @keyframes orbitRotateReverse {

          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }

        }

        .profile-sigil-edit {

          position: absolute;

          right: 7px;
          bottom: 7px;

          display: flex;

          align-items: center;
          justify-content: center;

          width: 27px;
          height: 27px;

          border: 1px solid rgba(249,115,22,.3);

          border-radius: 8px;

          background:
            rgba(0,0,0,.85);

          color: #fb923c;

          opacity: 0;

          transform:
            translateY(5px);

          transition: all .35s ease;

        }

        .profile-sigil:hover
        .profile-sigil-edit {

          opacity: 1;

          transform:
            translateY(0);

        }

        .profile-sigil-crown {

          position: absolute;

          top: -8px;
          left: 50%;

          display: flex;

          align-items: center;
          justify-content: center;

          width: 23px;
          height: 23px;

          transform:
            translateX(-50%);

          border:
            1px solid rgba(249,115,22,.25);

          border-radius: 50%;

          background:
            #090706;

          color:
            #fb923c;

          box-shadow:
            0 0 20px rgba(249,115,22,.15);

          animation:
            crownFloat 2.8s ease-in-out infinite;

        }

        @keyframes crownFloat {

          0%,100% {
            transform:
              translateX(-50%)
              translateY(0);
          }

          50% {
            transform:
              translateX(-50%)
              translateY(-4px);
          }

        }

        /* =====================================================
           BADGES
        ===================================================== */

        .profile-badge,
        .verified-badge {

          display: inline-flex;

          align-items: center;

          gap: .35rem;

          border-radius: 999px;

          padding:
            .4rem .65rem;

          font-size: 8px;

          font-weight: 800;

          letter-spacing: .15em;

          text-transform: uppercase;

        }

        .profile-badge {

          border:
            1px solid rgba(249,115,22,.22);

          background:
            rgba(249,115,22,.06);

          color:
            #fb923c;

        }

        .verified-badge {

          border:
            1px solid rgba(74,222,128,.18);

          background:
            rgba(74,222,128,.05);

          color:
            #86efac;

        }

        /* =====================================================
           PRIMARY BUTTON
        ===================================================== */

        .profile-primary-button {

          position: relative;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: .55rem;

          overflow: hidden;

          border:
            1px solid rgba(249,115,22,.35);

          border-radius: .85rem;

          background:
            linear-gradient(
              135deg,
              #7c2d12,
              #c2410c,
              #7c2d12
            );

          padding:
            .85rem 1.3rem;

          font-size: .75rem;

          font-weight: 800;

          color: #ffedd5;

          box-shadow:
            0 12px 35px rgba(249,115,22,.12);

          transition:
            all .3s ease;

        }

        .profile-primary-button:hover {

          transform:
            translateY(-4px)
            scale(1.02);

          border-color:
            rgba(251,146,60,.8);

          box-shadow:
            0 20px 50px rgba(249,115,22,.22),
            0 0 30px rgba(249,115,22,.1);

        }

        .profile-edit-trigger {

          isolation: isolate;

        }

        .button-energy {

          position: absolute;

          inset: -100%;

          background:
            conic-gradient(
              from 0deg,
              transparent,
              rgba(255,255,255,.15),
              transparent,
              rgba(251,146,60,.15),
              transparent
            );

          animation:
            buttonEnergy 4s linear infinite;

          z-index: -1;

        }

        @keyframes buttonEnergy {

          to {
            transform: rotate(360deg);
          }

        }

        /* =====================================================
           EDITING STATUS
        ===================================================== */

        .editing-status {

          position: relative;

          display: inline-flex;

          align-items: center;

          padding:
            .5rem .8rem;

          overflow: hidden;

          border:
            1px solid rgba(249,115,22,.3);

          border-radius: 999px;

          background:
            linear-gradient(
              90deg,
              rgba(249,115,22,.06),
              rgba(249,115,22,.12),
              rgba(249,115,22,.06)
            );

          color:
            #fb923c;

          font-size: 8px;

          font-weight: 900;

          letter-spacing: .2em;

          text-transform: uppercase;

          box-shadow:
            0 0 25px rgba(249,115,22,.08),
            inset 0 0 15px rgba(249,115,22,.04);

          animation:
            editingGlow 2s ease-in-out infinite;

        }

        .editing-status-orb {

          width: 6px;
          height: 6px;

          margin-right: 8px;

          border-radius: 50%;

          background:
            #fb923c;

          box-shadow:
            0 0 8px #fb923c,
            0 0 18px rgba(249,115,22,.8);

          animation:
            orbPulse 1.2s ease-in-out infinite;

        }

        @keyframes editingGlow {

          0%,100% {
            border-color:
              rgba(249,115,22,.2);
          }

          50% {
            border-color:
              rgba(249,115,22,.55);
          }

        }

        @keyframes orbPulse {

          0%,100% {
            transform: scale(.7);
            opacity: .5;
          }

          50% {
            transform: scale(1.2);
            opacity: 1;
          }

        }

        .editing-dots {

          display: flex;

          gap: 3px;

        }

        .editing-dots span {

          width: 3px;
          height: 3px;

          border-radius: 50%;

          background:
            #fb923c;

          animation:
            dotWave 1.2s infinite;

        }

        .editing-dots span:nth-child(2) {
          animation-delay: .15s;
        }

        .editing-dots span:nth-child(3) {
          animation-delay: .3s;
        }

        @keyframes dotWave {

          0%,100% {
            opacity: .25;
            transform: translateY(0);
          }

          50% {
            opacity: 1;
            transform: translateY(-3px);
          }

        }

        /* =====================================================
           PANELS
        ===================================================== */

        .profile-panel,
        .profile-small-panel {

          border:
            1px solid rgba(255,255,255,.065);

          background:
            linear-gradient(
              145deg,
              rgba(18,15,12,.96),
              rgba(8,8,7,.98)
            );

          box-shadow:
            0 25px 70px rgba(0,0,0,.5),
            inset 0 1px rgba(255,255,255,.02);

          transition:
            border-color .35s ease,
            transform .35s ease,
            box-shadow .35s ease;

        }

        .profile-panel {

          border-radius:
            1.75rem;

        }

        .profile-small-panel {

          position: relative;

          overflow: hidden;

          border-radius:
            1.75rem;

          padding:
            1.5rem;

        }

        .profile-panel:hover,
        .profile-small-panel:hover {

          border-color:
            rgba(249,115,22,.16);

          box-shadow:
            0 30px 80px rgba(0,0,0,.65),
            0 0 35px rgba(249,115,22,.035);

        }

        .editing-panel-active {

          border-color:
            rgba(249,115,22,.25);

          box-shadow:
            0 30px 80px rgba(0,0,0,.65),
            0 0 50px rgba(249,115,22,.06);

          animation:
            editingPanel 2.5s ease-in-out infinite;

        }

        @keyframes editingPanel {

          0%,100% {
            border-color:
              rgba(249,115,22,.18);
          }

          50% {
            border-color:
              rgba(249,115,22,.35);
          }

        }

        /* =====================================================
           INPUT
        ===================================================== */

        .premium-profile-input {

          width: 100%;

          background:
            transparent;

          padding:
            1rem 1rem 1rem 2.75rem;

          color:
            white;

          outline:
            none;

          font-size:
            .875rem;

          transition:
            color .3s ease,
            transform .3s ease;

        }

        .premium-profile-input-active {

          color:
            #fff7ed;

          animation:
            inputEnter .4s ease;

        }

        @keyframes inputEnter {

          from {
            opacity: .4;
            transform: translateX(-5px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }

        }

        .input-rune {

          position: absolute;

          right: 12px;
          top: 50%;

          display: flex;

          align-items: center;

          gap: 5px;

          transform:
            translateY(-50%);

          color:
            rgba(251,146,60,.55);

          font-size:
            7px;

          font-weight:
            900;

          letter-spacing:
            .15em;

          text-transform:
            uppercase;

          pointer-events:
            none;

          animation:
            runeAppear .5s ease;

        }

        @keyframes runeAppear {

          from {
            opacity: 0;
            transform:
              translateY(-50%)
              translateX(8px);
          }

          to {
            opacity: 1;
            transform:
              translateY(-50%)
              translateX(0);
          }

        }

        /* =====================================================
           FIELD
        ===================================================== */

        .profile-field {

          position: relative;

          overflow: hidden;

          border:
            1px solid rgba(255,255,255,.06);

          border-radius:
            1rem;

          background:
            rgba(0,0,0,.2);

          transition:
            all .3s ease;

        }

        .profile-field:focus-within {

          border-color:
            rgba(249,115,22,.35);

          box-shadow:
            0 0 35px rgba(249,115,22,.07);

          transform:
            translateY(-2px);

        }

        /* =====================================================
           SIGIL PREVIEW
        ===================================================== */

        .sigil-preview,
        .security-button {

          display: flex;

          width: 100%;

          align-items: center;

          justify-content: space-between;

          border:
            1px solid rgba(255,255,255,.06);

          border-radius:
            1rem;

          background:
            rgba(255,255,255,.018);

          padding:
            .75rem;

          color:
            #737373;

          transition:
            all .3s ease;

        }

        .sigil-preview:hover,
        .security-button:hover {

          transform:
            translateY(-3px);

          border-color:
            rgba(249,115,22,.25);

          background:
            rgba(249,115,22,.04);

          color:
            #fb923c;

          box-shadow:
            0 15px 40px rgba(0,0,0,.35);

        }

        /* =====================================================
           SAVE STATUS
        ===================================================== */

        .save-status-dot {

          width: 7px;
          height: 7px;

          border-radius: 50%;

          background:
            #525252;

        }

        .save-status-saving {

          background:
            #fb923c;

          box-shadow:
            0 0 10px #fb923c;

          animation:
            orbPulse 1s infinite;

        }

        .save-status-saved {

          background:
            #4ade80;

          box-shadow:
            0 0 10px rgba(74,222,128,.8);

        }

        .save-status-waiting {

          background:
            #f59e0b;

          animation:
            orbPulse 1.4s infinite;

        }

        .save-status-error {

          background:
            #ef4444;

          box-shadow:
            0 0 10px rgba(239,68,68,.5);

        }

        /* =====================================================
           SECONDARY
        ===================================================== */

        .profile-secondary-button {

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: .5rem;

          border:
            1px solid rgba(255,255,255,.08);

          border-radius:
            .85rem;

          padding:
            .75rem 1.2rem;

          color:
            #737373;

          transition:
            all .3s ease;

        }

        .profile-secondary-button:hover {

          border-color:
            rgba(249,115,22,.25);

          background:
            rgba(249,115,22,.04);

          color:
            #fb923c;

          transform:
            translateY(-2px);

        }

        /* =====================================================
           MODAL
        ===================================================== */

        .profile-modal {

          width: 100%;

          max-width:
            42rem;

          overflow: hidden;

          border:
            1px solid rgba(249,115,22,.2);

          border-radius:
            1.8rem;

          background:
            radial-gradient(
              circle at top right,
              rgba(249,115,22,.07),
              transparent 35%
            ),
            #090909;

          box-shadow:
            0 40px 120px rgba(0,0,0,.95),
            0 0 60px rgba(249,115,22,.05);

          animation:
            modalIn .35s cubic-bezier(.2,.8,.2,1);

        }

        @keyframes modalIn {

          from {
            opacity: 0;
            transform:
              translateY(20px)
              scale(.96);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }

        }

        /* =====================================================
           CHARACTER CARDS
        ===================================================== */

        .sigil-option {

          position: relative;

          overflow: hidden;

          border:
            1px solid rgba(255,255,255,.06);

          border-radius:
            1rem;

          background:
            rgba(255,255,255,.015);

          padding:
            1.25rem;

          text-align:
            left;

          transition:
            all .35s cubic-bezier(.2,.8,.2,1);

        }

        .character-card {

          isolation:
            isolate;

        }

        .character-card::before {

          content:
            "";

          position:
            absolute;

          inset:
            -100%;

          background:
            conic-gradient(
              from 0deg,
              transparent,
              rgba(249,115,22,.08),
              transparent,
              rgba(251,146,60,.05),
              transparent
            );

          opacity:
            0;

          animation:
            characterRotate 7s linear infinite;

          transition:
            opacity .4s ease;

          z-index:
            -1;

        }

        .character-card:hover::before,
        .character-card.sigil-selected::before {

          opacity:
            1;

        }

        @keyframes characterRotate {

          to {
            transform:
              rotate(360deg);
          }

        }

        .character-card:hover {

          transform:
            translateY(-8px)
            scale(1.015);

          border-color:
            rgba(249,115,22,.3);

          background:
            rgba(249,115,22,.035);

          box-shadow:
            0 20px 45px rgba(0,0,0,.5),
            0 0 30px rgba(249,115,22,.06);

        }

        .sigil-selected {

          border-color:
            rgba(249,115,22,.45);

          background:
            radial-gradient(
              circle at top right,
              rgba(249,115,22,.1),
              transparent 55%
            ),
            rgba(249,115,22,.035);

          box-shadow:
            0 20px 50px rgba(0,0,0,.55),
            0 0 30px rgba(249,115,22,.08);

        }

        .sigil-icon {

          display: flex;

          height:
            3.5rem;

          width:
            3.5rem;

          align-items:
            center;

          justify-content:
            center;

          border:
            1px solid rgba(255,255,255,.07);

          border-radius:
            1rem;

          background:
            rgba(255,255,255,.025);

          color:
            #737373;

          transition:
            all .35s ease;

        }

        .character-card:hover
        .sigil-icon {

          transform:
            scale(1.15)
            rotate(-4deg);

          border-color:
            rgba(249,115,22,.3);

          color:
            #fb923c;

          box-shadow:
            0 0 30px rgba(249,115,22,.12);

        }

        .sigil-icon-selected {

          border-color:
            rgba(249,115,22,.4);

          background:
            rgba(249,115,22,.08);

          color:
            #fb923c;

        }

        .selected-character-crown {

          position:
            absolute;

          right:
            12px;

          top:
            12px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          width:
            25px;

          height:
            25px;

          border:
            1px solid rgba(249,115,22,.35);

          border-radius:
            50%;

          background:
            #120b07;

          color:
            #fb923c;

          box-shadow:
            0 0 20px rgba(249,115,22,.18);

          animation:
            selectedCrown 2s ease-in-out infinite;

        }

        @keyframes selectedCrown {

          0%,100% {
            transform:
              translateY(0)
              rotate(-3deg);
          }

          50% {
            transform:
              translateY(-4px)
              rotate(3deg);
          }

        }

        .character-rune {

          position:
            absolute;

          color:
            rgba(249,115,22,.25);

        }

        .character-rune-top {

          left:
            12px;

          top:
            12px;

        }

        .character-class {

          display:
            inline-flex;

          align-items:
            center;

          gap:
            5px;

          margin-top:
            15px;

          color:
            rgba(251,146,60,.45);

          font-size:
            7px;

          font-weight:
            900;

          letter-spacing:
            .18em;

        }

        .character-energy {

          position:
            absolute;

          left:
            50%;

          bottom:
            0;

          width:
            0;

          height:
            1px;

          transform:
            translateX(-50%);

          background:
            linear-gradient(
              90deg,
              transparent,
              #f97316,
              #fb923c,
              #f97316,
              transparent
            );

          box-shadow:
            0 0 15px rgba(249,115,22,.6);

          transition:
            width .5s ease;

        }

        .character-card:hover
        .character-energy,
        .character-card.sigil-selected
        .character-energy {

          width:
            85%;

        }

        /* =====================================================
           EMBERS
        ===================================================== */

        .hero-embers {

          position:
            absolute;

          inset:
            0;

          overflow:
            hidden;

        }

        .hero-embers span {

          position:
            absolute;

          left:
            var(--ember-x);

          bottom:
            -20px;

          width:
            3px;

          height:
            3px;

          border-radius:
            50%;

          background:
            #fb923c;

          box-shadow:
            0 0 8px #fb923c,
            0 0 16px rgba(249,115,22,.6);

          opacity:
            0;

          animation:
            emberRise 6s linear infinite;

          animation-delay:
            var(--ember-delay);

        }

        @keyframes emberRise {

          0% {
            opacity:
              0;

            transform:
              translateY(0)
              translateX(0)
              scale(.5);
          }

          15% {
            opacity:
              .8;
          }

          70% {
            opacity:
              .5;
          }

          100% {
            opacity:
              0;

            transform:
              translateY(-420px)
              translateX(40px)
              scale(1.3);
          }

        }

        /* =====================================================
           JOURNEY
        ===================================================== */

        .journey-card {

          position:
            relative;

          overflow:
            hidden;

          border:
            1px solid rgba(255,255,255,.06);

          border-radius:
            1rem;

          background:
            rgba(255,255,255,.015);

          transition:
            all .4s ease;

        }

        .journey-card:hover {

          transform:
            translateY(-8px);

          border-color:
            rgba(249,115,22,.2);

        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 640px) {

          .profile-sigil {

            height:
              6rem;

            width:
              6rem;

            border-radius:
              1.5rem;

          }

          .got-cursor {
            display:
              none;
          }

          .input-rune {
            display:
              none;
          }

        }

        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          *,
          *::before,
          *::after {

            animation-duration:
              .01ms !important;

            animation-iteration-count:
              1 !important;

            transition-duration:
              .01ms !important;

          }

        }

        `}
      </style>
    </div>
  );
}

/* =========================================================
   BACKGROUND
========================================================= */

function ProfileBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

      <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-orange-600/[0.035] blur-[160px]" />

      <div className="absolute -right-40 top-[10%] h-[600px] w-[600px] rounded-full bg-amber-500/[0.025] blur-[170px]" />

      <div className="absolute bottom-[-300px] left-[30%] h-[650px] w-[650px] rounded-full bg-orange-700/[0.025] blur-[180px]" />

      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#050505_88%)]" />

    </div>
  );
}

/* =========================================================
   REALM STAT
========================================================= */

function RealmStat({
  icon,
  label,
  value,
}) {
  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.015] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/20 hover:bg-orange-500/[0.025]">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-500/15 bg-orange-500/[0.05] text-orange-400 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(249,115,22,.12)]">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[8px] font-bold uppercase tracking-[.2em] text-neutral-700">
          {label}
        </p>

        <p className="mt-1 truncate text-xs font-bold text-neutral-400">
          {value}
        </p>

      </div>
    </div>
  );
}

/* =========================================================
   FANTASY FIELD
========================================================= */

function FantasyField({
  label,
  icon,
  children,
  active = false,
}) {
  return (
    <div>

      <label className="mb-2 block text-[9px] font-black uppercase tracking-[.2em] text-neutral-600">
        {label}
      </label>

      <div
        className={`profile-field group ${
          active
            ? "profile-field-active"
            : ""
        }`}
      >

        <span className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-neutral-700 transition-colors group-focus-within:text-orange-400">
          {icon}
        </span>

        {children}

        <span className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-orange-500 to-transparent transition-all duration-500 group-focus-within:w-full" />

      </div>
    </div>
  );
}

/* =========================================================
   INFO TILE
========================================================= */

function InfoTile({
  icon,
  title,
  value,
  verified = false,
}) {
  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.015] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/15">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-500/10 bg-orange-500/[0.04] text-orange-500/70 transition-all duration-300 group-hover:scale-105 group-hover:text-orange-400">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[8px] font-bold uppercase tracking-[.17em] text-neutral-700">
          {title}
        </p>

        <p
          className={`mt-1 truncate text-sm font-bold ${
            verified
              ? "text-emerald-400"
              : "text-neutral-400"
          }`}
        >
          {value}
        </p>

      </div>
    </div>
  );
}

/* =========================================================
   JOURNEY CARD
========================================================= */

function JourneyCard({
  icon,
  title,
  value,
  description,
}) {
  return (
    <div className="journey-card group relative p-5">

      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-orange-500/10 opacity-0 blur-[35px] transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-orange-500/15 bg-orange-500/[0.05] text-orange-400 transition-all duration-400 group-hover:scale-110 group-hover:rotate-3 group-hover:border-orange-500/30 group-hover:shadow-[0_0_30px_rgba(249,115,22,.12)]">
        {icon}
      </div>

      <p className="relative mt-5 text-[8px] font-black uppercase tracking-[.2em] text-neutral-700">
        {title}
      </p>

      <p className="relative mt-1 text-sm font-bold text-neutral-400">
        {value}
      </p>

      <p className="relative mt-1 text-[10px] leading-5 text-neutral-700">
        {description}
      </p>

      <div className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-orange-500 to-transparent transition-all duration-500 group-hover:w-[80%]" />

    </div>
  );
}

export default InstructorProfile;