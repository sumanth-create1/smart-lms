import { useEffect, useMemo, useState } from "react";

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
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

/* =========================================================
   SIGILS
========================================================= */

const PROFILE_SIGILS = [
  {
    id: "royal",
    name: "The Crown",
    description: "Keeper of Knowledge",
    icon: Crown,
  },
  {
    id: "wolf",
    name: "The Guardian",
    description: "Guardian of the Realm",
    icon: Shield,
  },
  {
    id: "warrior",
    name: "The Warrior",
    description: "Master of the Blade",
    icon: Swords,
  },
  {
    id: "dragon",
    name: "The Flame",
    description: "Bearer of Fire",
    icon: Flame,
  },
  {
    id: "knight",
    name: "The Knight",
    description: "Protector of Scholars",
    icon: Medal,
  },
  {
    id: "gem",
    name: "The Gem",
    description: "Keeper of Wisdom",
    icon: Gem,
  },
];

/* =========================================================
   MAIN
========================================================= */

function InstructorProfile() {
  const navigate = useNavigate();

  const { user, setUser } = useAuth();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");

  const [selectedSigil, setSelectedSigil] =
    useState("royal");

  const [showSigilSelector, setShowSigilSelector] =
    useState(false);

  const [copiedEmail, setCopiedEmail] =
    useState(false);

  /* =======================================================
     LOAD USER
  ======================================================= */

  useEffect(() => {
    if (!user) return;

    setName(user.name || "");

    if (user.profileIcon) {
      setSelectedSigil(user.profileIcon);
    }
  }, [user]);

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
     COPY EMAIL
  ======================================================= */

  const handleCopyEmail = async () => {
    if (!user?.email) return;

    try {
      await navigator.clipboard.writeText(user.email);

      setCopiedEmail(true);

      toast.success("Email copied to the royal scroll.");

      setTimeout(() => {
        setCopiedEmail(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Unable to copy email.");
    }
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSave = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Your name cannot be empty.");
      return;
    }

    if (trimmedName.length < 2) {
      toast.error(
        "Your name must contain at least 2 characters."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await api.put(
        "/auth/profile",
        {
          name: trimmedName,
          profileIcon: selectedSigil,
        }
      );

      if (response.data?.success) {
        const updatedUser = response.data.user;

        setUser(updatedUser);

        setName(updatedUser?.name || "");

        if (updatedUser?.profileIcon) {
          setSelectedSigil(
            updatedUser.profileIcon
          );
        }

        setEditing(false);

        toast.success(
          "Your royal profile has been updated."
        );
      } else {
        toast.error(
          response.data?.message ||
            "Unable to update your profile."
        );
      }
    } catch (error) {
      console.error(
        "Instructor profile update error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     CANCEL
  ======================================================= */

  const handleCancel = () => {
    setName(user?.name || "");

    if (user?.profileIcon) {
      setSelectedSigil(user.profileIcon);
    }

    setEditing(false);
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (!user) {
    return (
      <div className="flex min-h-[600px] items-center justify-center bg-[#050505]">
        <div className="relative flex flex-col items-center gap-5">

          <div className="absolute h-40 w-40 rounded-full bg-[#c9a227]/10 blur-[70px]" />

          <div
            className="
              relative
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-3xl
              border
              border-[#9c7927]
              bg-gradient-to-br
              from-[#33250d]
              via-[#171208]
              to-[#080706]
              text-[#d4af37]
              shadow-[0_0_45px_rgba(201,162,39,.25)]
              animate-pulse
            "
          >
            <Crown size={32} />
          </div>

          <LoaderCircle
            size={22}
            className="animate-spin text-[#d4af37]"
          />

          <p className="text-xs tracking-[0.2em] text-[#887554]">
            SUMMONING YOUR PROFILE
          </p>
        </div>
      </div>
    );
  }

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
    <div className="relative min-h-full overflow-hidden bg-[#050505] px-4 py-8 text-[#e8dcc2] sm:px-6 lg:px-8">

      {/* =====================================================
          AMBIENT BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-[#6b1018]/20 blur-[140px] animate-ambientOne" />

        <div className="absolute right-[-120px] top-[15%] h-[500px] w-[500px] rounded-full bg-[#b38a24]/10 blur-[150px] animate-ambientTwo" />

        <div className="absolute bottom-[-150px] left-[35%] h-[400px] w-[400px] rounded-full bg-[#73131a]/10 blur-[140px]" />

        {/* Grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
            [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)]
            [background-size:70px_70px]
          "
        />

        {/* Vignette */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#050505_85%)]" />

        {/* Floating particles */}

        <span className="particle particle1" />
        <span className="particle particle2" />
        <span className="particle particle3" />
        <span className="particle particle4" />
        <span className="particle particle5" />
        <span className="particle particle6" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* ===================================================
            TOP NAV
        =================================================== */}

        <div className="mb-8 flex items-center justify-between">

          <button
            type="button"
            onClick={() =>
              navigate("/instructor/dashboard")
            }
            className="
              group
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-[#2c2418]
              bg-[#0b0907]/70
              px-4
              py-2.5
              text-sm
              text-[#82745f]
              shadow-[0_10px_30px_rgba(0,0,0,.3)]
              backdrop-blur-xl
              transition-all
              duration-300
              hover:-translate-x-1
              hover:border-[#806521]
              hover:bg-[#151008]
              hover:text-[#d4af37]
              hover:shadow-[0_0_25px_rgba(201,162,39,.1)]
            "
          >
            <ArrowLeft
              size={17}
              className="transition-transform group-hover:-translate-x-1"
            />

            Return to the Keep
          </button>

          <div className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#625541] sm:flex">
            <Shield size={13} />
            Instructor Realm
            <span>•</span>
            Profile
          </div>
        </div>

        {/* ===================================================
            HEADING
        =================================================== */}

        <div className="mb-8">

          <div className="mb-4 flex items-center gap-3">

            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a227]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#b58d32]">
              Hall of Knowledge
            </span>

            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a227]" />
          </div>

          <h1 className="text-4xl font-black tracking-tight text-[#eee3cb] sm:text-5xl">
            Instructor Profile
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#776a57]">
            Your identity, your sigil and your journey
            within the Smart LMS realm.
          </p>
        </div>

        {/* ===================================================
            HERO
        =================================================== */}

        <section
          className="
            premium-card
            relative
            overflow-hidden
            rounded-[32px]
            border
            border-[#4b3920]
            bg-gradient-to-br
            from-[#17130d]
            via-[#0c0a08]
            to-[#060606]
            shadow-[0_35px_100px_rgba(0,0,0,.7)]
          "
        >

          {/* Animated gold border */}

          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent animate-goldLine" />

          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#762027]/70 to-transparent" />

          {/* Background glow */}

          <div className="absolute -right-20 -top-32 h-[400px] w-[400px] rounded-full bg-[#9b151c]/10 blur-[100px]" />

          <div className="absolute -left-20 bottom-[-150px] h-[350px] w-[350px] rounded-full bg-[#c9a227]/8 blur-[100px]" />

          {/* Giant watermark */}

          <div className="pointer-events-none absolute right-[-50px] top-[-60px] text-[#d4af37] opacity-[0.035]">
            <SigilIcon size={400} strokeWidth={0.8} />
          </div>

          <div className="relative z-10 p-6 sm:p-9 lg:p-11">

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

              {/* PROFILE */}

              <div className="flex items-center gap-6">

                {/* SIGIL */}

                <button
                  type="button"
                  onClick={() =>
                    setShowSigilSelector(true)
                  }
                  className="
                    profile-sigil
                    group
                    relative
                    flex
                    h-32
                    w-32
                    shrink-0
                    items-center
                    justify-center
                    rounded-[32px]
                    border
                    border-[#a47f29]
                    bg-gradient-to-br
                    from-[#3a290d]
                    via-[#171108]
                    to-[#060606]
                    text-[#d4af37]
                    shadow-[0_0_35px_rgba(201,162,39,.2)]
                    transition-all
                    duration-500
                    hover:scale-105
                    hover:border-[#e2c15a]
                    hover:shadow-[0_0_65px_rgba(201,162,39,.4)]
                  "
                >

                  <div className="absolute inset-2 rounded-[25px] border border-[#634d21]" />

                  <div className="absolute inset-5 rounded-[20px] border border-[#493818] opacity-50" />

                  <span className="absolute left-3 top-3 h-3 w-3 border-l border-t border-[#c9a227]" />
                  <span className="absolute right-3 top-3 h-3 w-3 border-r border-t border-[#c9a227]" />
                  <span className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-[#c9a227]" />
                  <span className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[#c9a227]" />

                  <div className="absolute inset-0 rounded-[32px] bg-[#d4af37]/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

                  <SigilIcon
                    size={50}
                    strokeWidth={1.2}
                    className="relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                  />

                  <span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg border border-[#71591f] bg-[#090806] text-[#d4af37] opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100">
                    <Pencil size={12} />
                  </span>
                </button>

                {/* IDENTITY */}

                <div className="min-w-0">

                  <div className="mb-3 flex flex-wrap items-center gap-2">

                    <span className="premium-badge">
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

                  <h2 className="text-2xl font-black text-[#eee4ce] sm:text-4xl">
                    {user.name || firstLetter}
                  </h2>

                  <p className="mt-1 text-sm text-[#786b58]">
                    {user.email}
                  </p>

                  <p className="mt-3 text-xs italic text-[#a98846]">
                    "{currentSigil.description}"
                  </p>
                </div>
              </div>

              {/* EDIT */}

              {!editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="
                    premium-button
                    group
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-[#80631f]
                    bg-gradient-to-r
                    from-[#33230d]
                    via-[#6d5015]
                    to-[#33230d]
                    px-6
                    py-3.5
                    text-sm
                    font-bold
                    text-[#ffe7a0]
                    shadow-[0_12px_35px_rgba(201,162,39,.12)]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-[#d4af37]
                    hover:shadow-[0_15px_45px_rgba(201,162,39,.25)]
                  "
                >
                  <Edit3
                    size={17}
                    className="transition-transform group-hover:rotate-[-8deg]"
                  />

                  Edit Identity

                  <Sparkles
                    size={14}
                    className="opacity-50 transition group-hover:rotate-12 group-hover:opacity-100"
                  />
                </button>
              )}
            </div>

            {/* =================================================
                STATS
            ================================================= */}

            <div className="mt-9 grid gap-3 border-t border-[#2b2116] pt-7 sm:grid-cols-3">

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
            CONTENT
        =================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.45fr_.55fr]">

          {/* PERSONAL */}

          <section className="premium-card overflow-hidden rounded-[28px] border border-[#3b2e1e] bg-[#0b0907] shadow-[0_25px_70px_rgba(0,0,0,.5)]">

            <div className="border-b border-[#272016] px-6 py-6 sm:px-8">

              <div className="flex items-center justify-between">

                <div>

                  <div className="flex items-center gap-2">
                    <User
                      size={18}
                      className="text-[#c09a3b]"
                    />

                    <h2 className="font-bold text-[#e2d7bf]">
                      Personal Information
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-[#70634f]">
                    The details recorded within your
                    instructor scroll.
                  </p>
                </div>

                {editing && (
                  <span className="animate-pulse rounded-full border border-[#704f1c] bg-[#201609] px-3 py-1 text-[9px] font-bold uppercase tracking-[.15em] text-[#c9a227]">
                    Editing
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 sm:p-8">

              <form onSubmit={handleSave}>

                <div className="grid gap-5 md:grid-cols-2">

                  <FantasyField
                    label="Full Name"
                    icon={<User size={17} />}
                  >
                    <input
                      type="text"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      disabled={!editing || saving}
                      className="w-full bg-transparent py-4 pl-11 pr-4 text-sm text-[#e5d9bd] outline-none placeholder:text-[#544a3c] disabled:cursor-not-allowed"
                      placeholder="Enter your name"
                    />
                  </FantasyField>

                  <FantasyField
                    label="Email Address"
                    icon={<Mail size={17} />}
                  >
                    <input
                      type="email"
                      value={user.email || ""}
                      disabled
                      className="w-full cursor-not-allowed bg-transparent py-4 pl-11 pr-11 text-sm text-[#786d5b] outline-none"
                    />

                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="
                        absolute
                        right-3
                        top-1/2
                        flex
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-lg
                        p-2
                        text-[#71634e]
                        transition-all
                        hover:bg-[#21180c]
                        hover:text-[#d4af37]
                        hover:shadow-[0_0_20px_rgba(201,162,39,.15)]
                      "
                    >
                      {copiedEmail ? (
                        <Check size={15} />
                      ) : (
                        <Clipboard size={15} />
                      )}
                    </button>
                  </FantasyField>
                </div>

                {/* ACCOUNT */}

                <div className="mt-9">

                  <div className="mb-5 flex items-center gap-4">
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#302419]" />

                    <span className="text-[9px] font-bold uppercase tracking-[.25em] text-[#705f43]">
                      Account Details
                    </span>

                    <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#302419]" />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">

                    <InfoTile
                      icon={<Crown size={17} />}
                      title="Realm Role"
                      value={
                        user.role || "Instructor"
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
                      title="Sigil"
                      value={currentSigil.name}
                    />
                  </div>
                </div>

                {/* ACTIONS */}

                {editing && (
                  <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#292016] pt-6 sm:flex-row sm:justify-end">

                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="
                        rounded-xl
                        border
                        border-[#3b3023]
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-[#857864]
                        transition-all
                        hover:-translate-y-1
                        hover:border-[#68553b]
                        hover:bg-[#16110c]
                        hover:text-[#c1b094]
                      "
                    >
                      <span className="inline-flex items-center gap-2">
                        <X size={17} />
                        Cancel
                      </span>
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="
                        group
                        relative
                        overflow-hidden
                        rounded-xl
                        border
                        border-[#aa8529]
                        bg-gradient-to-r
                        from-[#5c4313]
                        via-[#b28b2b]
                        to-[#5c4313]
                        px-6
                        py-3
                        text-sm
                        font-black
                        text-[#fff1c8]
                        shadow-[0_12px_35px_rgba(201,162,39,.2)]
                        transition-all
                        hover:-translate-y-1
                        hover:shadow-[0_18px_45px_rgba(201,162,39,.35)]
                        disabled:opacity-60
                      "
                    >

                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                      <span className="relative inline-flex items-center gap-2">
                        {saving ? (
                          <>
                            <LoaderCircle
                              size={17}
                              className="animate-spin"
                            />
                            Inscribing...
                          </>
                        ) : (
                          <>
                            <Save size={17} />
                            Save Identity
                          </>
                        )}
                      </span>
                    </button>

                  </div>
                )}
              </form>
            </div>
          </section>

          {/* RIGHT SIDE */}

          <div className="space-y-6">

            {/* SIGIL */}

            <section className="premium-card group relative overflow-hidden rounded-[28px] border border-[#40311d] bg-gradient-to-br from-[#151008] to-[#080706] p-6 shadow-[0_25px_60px_rgba(0,0,0,.5)]">

              <div className="absolute -right-12 -top-12 text-[#d4af37] opacity-[0.035] transition-all duration-700 group-hover:scale-125 group-hover:opacity-[0.07]">
                <SigilIcon size={190} />
              </div>

              <div className="relative z-10">

                <div className="flex items-center gap-2">
                  <Shield
                    size={18}
                    className="text-[#c09a3b]"
                  />

                  <h2 className="font-bold text-[#e2d6bd]">
                    Royal Sigil
                  </h2>
                </div>

                <p className="mt-2 text-xs leading-5 text-[#71634f]">
                  Choose the symbol that represents
                  your instructor identity.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setShowSigilSelector(true)
                  }
                  className="
                    group/sigil
                    mt-5
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-2xl
                    border
                    border-[#3d2f1c]
                    bg-[#0d0a07]
                    p-3
                    shadow-[inset_0_1px_0_rgba(255,255,255,.03)]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-[#806521]
                    hover:bg-[#151008]
                    hover:shadow-[0_12px_35px_rgba(0,0,0,.5),0_0_25px_rgba(201,162,39,.08)]
                  "
                >

                  <div className="flex items-center gap-3">

                    <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-[#735a20] bg-gradient-to-br from-[#2b1e0b] to-[#100c07] text-[#d4af37] shadow-[0_0_20px_rgba(201,162,39,.1)] transition-all group-hover/sigil:shadow-[0_0_30px_rgba(201,162,39,.25)]">

                      <SigilIcon
                        size={22}
                        className="transition-transform duration-300 group-hover/sigil:scale-110"
                      />
                    </div>

                    <div className="text-left">

                      <p className="text-sm font-bold text-[#d8ccb2]">
                        {currentSigil.name}
                      </p>

                      <p className="mt-1 text-[10px] text-[#70634f]">
                        {currentSigil.description}
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    size={17}
                    className="text-[#766346] transition-transform group-hover/sigil:translate-x-1 group-hover/sigil:text-[#d4af37]"
                  />
                </button>
              </div>
            </section>

            {/* SECURITY */}

            <section className="premium-card group rounded-[28px] border border-[#382c1e] bg-[#0b0907] p-6 shadow-[0_25px_60px_rgba(0,0,0,.45)]">

              <div className="flex items-center gap-2">
                <KeyRound
                  size={18}
                  className="text-[#c09a3b]"
                />

                <h2 className="font-bold text-[#e2d6bd]">
                  Account Security
                </h2>
              </div>

              <p className="mt-2 text-xs leading-5 text-[#71634f]">
                Protect your access to the instructor
                realm.
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
                className="
                  group/security
                  mt-5
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-[#352a1d]
                  bg-[#0e0b08]
                  px-4
                  py-3.5
                  text-sm
                  font-medium
                  text-[#95856d]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#806521]
                  hover:bg-[#171008]
                  hover:text-[#d4af37]
                  hover:shadow-[0_12px_35px_rgba(0,0,0,.5)]
                "
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
              className={`premium-card rounded-[28px] border p-6 shadow-[0_25px_60px_rgba(0,0,0,.45)] ${
                user.isVerified
                  ? "border-[#314625] bg-[#0b1109]"
                  : "border-[#51391c] bg-[#130e08]"
              }`}
            >

              <div className="flex items-start gap-3">

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                    user.isVerified
                      ? "border-[#405b32] bg-[#13200f] text-[#8aaa67] shadow-[0_0_25px_rgba(105,150,70,.12)]"
                      : "border-[#684c20] bg-[#20150a] text-[#bd9235]"
                  }`}
                >
                  {user.isVerified ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <Bell size={20} />
                  )}
                </div>

                <div>

                  <h3 className="text-sm font-bold text-[#ded2b8]">
                    {user.isVerified
                      ? "Verified Instructor"
                      : "Verification Required"}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[#746751]">
                    {user.isVerified
                      ? "Your instructor account has been verified and is ready to rule the realm."
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

        <section className="premium-card mt-6 overflow-hidden rounded-[28px] border border-[#3b2d1d] bg-[#0a0806] shadow-[0_25px_70px_rgba(0,0,0,.5)]">

          <div className="p-6 sm:p-8">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <Trophy
                    size={19}
                    className="text-[#c9a227]"
                  />

                  <h2 className="font-bold text-[#e3d7bd]">
                    Instructor Journey
                  </h2>
                </div>

                <p className="mt-1 text-xs text-[#756750]">
                  Your path as a keeper of knowledge.
                </p>

              </div>

              <div className="relative overflow-hidden rounded-full border border-[#654c1e] bg-[#171007] px-4 py-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#c49b38] shadow-[0_0_20px_rgba(201,162,39,.08)]">

                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#d4af37]/10 to-transparent animate-shimmer" />

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

        {/* FOOTER */}

        <div className="flex items-center justify-center gap-3 py-10">

          <span className="h-px w-20 bg-gradient-to-r from-transparent to-[#3a2c1b]" />

          <Crown
            size={14}
            className="text-[#705929]"
          />

          <span className="text-[9px] font-semibold uppercase tracking-[.3em] text-[#594c39]">
            Smart LMS • Keeper of Knowledge
          </span>

          <Crown
            size={14}
            className="text-[#705929]"
          />

          <span className="h-px w-20 bg-gradient-to-l from-transparent to-[#3a2c1b]" />

        </div>
      </div>

      {/* =====================================================
          SIGIL MODAL
      ===================================================== */}

      {showSigilSelector && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setShowSigilSelector(false);
            }
          }}
        >

          <div className="modal-card relative w-full max-w-2xl overflow-hidden rounded-[30px] border border-[#59431f] bg-[#090806] shadow-[0_40px_120px_rgba(0,0,0,.9)]">

            <div className="h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent animate-goldLine" />

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-[#292016] px-6 py-6">

              <div>

                <div className="flex items-center gap-2">

                  <Crown
                    size={19}
                    className="text-[#d4af37]"
                  />

                  <h2 className="font-bold text-[#e5d9bf]">
                    Choose Your Royal Sigil
                  </h2>
                </div>

                <p className="mt-1 text-xs text-[#766850]">
                  Every instructor deserves a symbol.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowSigilSelector(false)
                }
                className="rounded-xl border border-transparent p-2 text-[#71634e] transition-all hover:border-[#493719] hover:bg-[#171109] hover:text-[#d4af37]"
              >
                <X size={18} />
              </button>

            </div>

            {/* SIGILS */}

            <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">

              {PROFILE_SIGILS.map((sigil) => {

                const Icon = sigil.icon;

                const selected =
                  selectedSigil === sigil.id;

                return (
                  <button
                    key={sigil.id}
                    type="button"
                    onClick={() => {
                      setSelectedSigil(
                        sigil.id
                      );

                      setShowSigilSelector(
                        false
                      );

                      toast.success(
                        `${sigil.name} has been chosen as your sigil.`
                      );
                    }}
                    className={`
                      sigil-option
                      group
                      relative
                      overflow-hidden
                      rounded-2xl
                      border
                      p-5
                      text-left
                      transition-all
                      duration-400
                      ${
                        selected
                          ? "selected-sigil"
                          : "border-[#302619] bg-[#0d0b08] hover:-translate-y-2 hover:border-[#71551e] hover:bg-[#151008]"
                      }
                    `}
                  >

                    {selected && (
                      <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#80611e] text-[#090806] shadow-[0_0_20px_rgba(201,162,39,.35)]">
                        <Check size={13} />
                      </span>
                    )}

                    <div
                      className={`
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        transition-all
                        duration-400
                        ${
                          selected
                            ? "border-[#a17b27] bg-[#241a09] text-[#d8b64d] shadow-[0_0_30px_rgba(201,162,39,.2)]"
                            : "border-[#3b2d1b] bg-[#151008] text-[#806c43]"
                        }
                        group-hover:scale-110
                        group-hover:rotate-3
                        group-hover:border-[#9a7728]
                        group-hover:text-[#d4af37]
                        group-hover:shadow-[0_0_30px_rgba(201,162,39,.2)]
                      `}
                    >
                      <Icon
                        size={25}
                        strokeWidth={1.3}
                      />
                    </div>

                    <p className="mt-4 text-sm font-bold text-[#d8ccb2]">
                      {sigil.name}
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-[#70634f]">
                      {sigil.description}
                    </p>

                    <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent transition-all duration-500 group-hover:w-full" />
                  </button>
                );
              })}
            </div>

            <div className="border-t border-[#292016] px-6 py-5">

              <p className="text-center text-[9px] font-semibold uppercase tracking-[.25em] text-[#594c39]">
                Your symbol • Your identity • Your realm
              </p>

            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          ANIMATIONS
      ===================================================== */}

      <style>
        {`
          @keyframes ambientOne {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }

            50% {
              transform: translate(50px, 30px) scale(1.12);
            }
          }

          @keyframes ambientTwo {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }

            50% {
              transform: translate(-40px, 50px) scale(1.08);
            }
          }

          @keyframes goldLine {
            0% {
              opacity: .3;
              transform: scaleX(.5);
            }

            50% {
              opacity: 1;
              transform: scaleX(1);
            }

            100% {
              opacity: .3;
              transform: scaleX(.5);
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

          @keyframes floatParticle {
            0% {
              transform: translateY(0) translateX(0);
              opacity: 0;
            }

            20% {
              opacity: .6;
            }

            80% {
              opacity: .2;
            }

            100% {
              transform: translateY(-180px) translateX(60px);
              opacity: 0;
            }
          }

          .animate-ambientOne {
            animation: ambientOne 12s ease-in-out infinite;
          }

          .animate-ambientTwo {
            animation: ambientTwo 15s ease-in-out infinite;
          }

          .animate-goldLine {
            animation: goldLine 4s ease-in-out infinite;
          }

          .animate-shimmer {
            animation: shimmer 3s ease-in-out infinite;
          }

          .premium-card {
            transition:
              transform .45s cubic-bezier(.2,.8,.2,1),
              border-color .45s ease,
              box-shadow .45s ease;
          }

          .premium-card:hover {
            border-color: rgba(151,119,42,.45);
            box-shadow:
              0 35px 90px rgba(0,0,0,.7),
              0 0 35px rgba(201,162,39,.05);
          }

          .premium-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            border: 1px solid rgba(128,100,34,.55);
            border-radius: 999px;
            background: linear-gradient(
              135deg,
              rgba(48,35,12,.9),
              rgba(22,16,8,.9)
            );
            padding: 6px 10px;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: .15em;
            text-transform: uppercase;
            color: #c9a54d;
            box-shadow:
              inset 0 1px rgba(255,255,255,.04),
              0 0 20px rgba(201,162,39,.05);
          }

          .verified-badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            border: 1px solid rgba(68,104,47,.6);
            border-radius: 999px;
            background: rgba(18,31,13,.8);
            padding: 6px 10px;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: .14em;
            text-transform: uppercase;
            color: #8aaa67;
          }

          .particle {
            position: absolute;
            bottom: -20px;
            width: 3px;
            height: 3px;
            border-radius: 50%;
            background: #c9a227;
            box-shadow: 0 0 12px rgba(201,162,39,.7);
            animation: floatParticle 8s linear infinite;
          }

          .particle1 {
            left: 12%;
            animation-delay: 1s;
          }

          .particle2 {
            left: 28%;
            animation-delay: 4s;
          }

          .particle3 {
            left: 47%;
            animation-delay: 2s;
          }

          .particle4 {
            left: 64%;
            animation-delay: 6s;
          }

          .particle5 {
            left: 78%;
            animation-delay: 3s;
          }

          .particle6 {
            left: 90%;
            animation-delay: 5s;
          }

          .modal-card {
            animation: modalIn .35s cubic-bezier(.2,.8,.2,1);
          }

          @keyframes modalIn {
            from {
              opacity: 0;
              transform: translateY(20px) scale(.96);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .selected-sigil {
            border-color: #a47f29;
            background:
              radial-gradient(
                circle at top right,
                rgba(201,162,39,.15),
                transparent 50%
              ),
              #191107;
            box-shadow:
              0 15px 40px rgba(0,0,0,.5),
              0 0 30px rgba(201,162,39,.1),
              inset 0 1px rgba(255,255,255,.04);
          }

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: .01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: .01ms !important;
            }
          }
        `}
      </style>
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
    <div
      className="
        group
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-[#2b2117]
        bg-gradient-to-br
        from-[#14100b]
        to-[#0c0a08]
        p-4
        shadow-[inset_0_1px_rgba(255,255,255,.025)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#69511f]
        hover:shadow-[0_12px_35px_rgba(0,0,0,.5),0_0_25px_rgba(201,162,39,.06)]
      "
    >

      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-[#49371d]
          bg-gradient-to-br
          from-[#21170a]
          to-[#0e0b08]
          text-[#b58b32]
          shadow-[0_0_15px_rgba(201,162,39,.06)]
          transition-all
          duration-300
          group-hover:scale-110
          group-hover:text-[#d4af37]
          group-hover:shadow-[0_0_25px_rgba(201,162,39,.18)]
        "
      >
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[9px] font-semibold uppercase tracking-[.18em] text-[#625540]">
          {label}
        </p>

        <p className="mt-1 truncate text-xs font-bold text-[#b9aa90]">
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
}) {
  return (
    <div>

      <label className="mb-2 block text-[10px] font-bold uppercase tracking-[.18em] text-[#82745d]">
        {label}
      </label>

      <div
        className="
          group
          relative
          overflow-hidden
          rounded-2xl
          border
          border-[#382c1e]
          bg-gradient-to-br
          from-[#14100b]
          to-[#0b0907]
          shadow-[inset_0_1px_rgba(255,255,255,.025)]
          transition-all
          duration-300
          focus-within:border-[#8c6d25]
          focus-within:shadow-[0_0_30px_rgba(201,162,39,.1)]
        "
      >

        <span className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#786445] transition-colors group-focus-within:text-[#d4af37]">
          {icon}
        </span>

        {children}

        <span className="absolute bottom-0 left-1/2 h-[1px] w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent transition-all duration-500 group-focus-within:w-full" />

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
    <div
      className="
        group
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-[#292016]
        bg-gradient-to-br
        from-[#14100b]
        to-[#0d0a08]
        p-4
        shadow-[inset_0_1px_rgba(255,255,255,.02)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#55401e]
        hover:shadow-[0_12px_35px_rgba(0,0,0,.4)]
      "
    >

      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-[#3b2d1b]
          bg-[#171109]
          text-[#a7812c]
          transition-all
          duration-300
          group-hover:scale-105
          group-hover:text-[#d4af37]
          group-hover:shadow-[0_0_20px_rgba(201,162,39,.1)]
        "
      >
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[9px] font-semibold uppercase tracking-[.15em] text-[#615540]">
          {title}
        </p>

        <p
          className={`mt-1 truncate text-sm font-bold ${
            verified
              ? "text-[#8aaa67]"
              : "text-[#b8aa91]"
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
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-[#2d2318]
        bg-gradient-to-br
        from-[#14100b]
        via-[#0f0c09]
        to-[#090806]
        p-5
        shadow-[0_15px_35px_rgba(0,0,0,.35)]
        transition-all
        duration-400
        hover:-translate-y-2
        hover:border-[#71551e]
        hover:shadow-[0_25px_55px_rgba(0,0,0,.6),0_0_30px_rgba(201,162,39,.07)]
      "
    >

      {/* hover glow */}

      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#c9a227]/10 opacity-0 blur-[35px] transition-opacity duration-500 group-hover:opacity-100" />

      <div
        className="
          relative
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-xl
          border
          border-[#44341c]
          bg-gradient-to-br
          from-[#21170a]
          to-[#100c08]
          text-[#aa842e]
          shadow-[0_0_15px_rgba(201,162,39,.05)]
          transition-all
          duration-400
          group-hover:scale-110
          group-hover:rotate-3
          group-hover:border-[#947126]
          group-hover:text-[#d4af37]
          group-hover:shadow-[0_0_30px_rgba(201,162,39,.2)]
        "
      >
        {icon}
      </div>

      <p className="relative mt-5 text-[9px] font-bold uppercase tracking-[.18em] text-[#625540]">
        {title}
      </p>

      <p className="relative mt-1 text-sm font-bold text-[#c9bba0]">
        {value}
      </p>

      <p className="relative mt-1 text-[10px] leading-5 text-[#685d4b]">
        {description}
      </p>

      {/* bottom line */}

      <div className="absolute bottom-0 left-1/2 h-[1px] w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#c9a227] to-transparent transition-all duration-500 group-hover:w-[80%]" />
    </div>
  );
}

export default InstructorProfile;