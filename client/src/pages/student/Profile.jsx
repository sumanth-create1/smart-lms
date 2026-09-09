import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  Crown,
  Flame,
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

// =====================================================
// MEDIEVAL FANTASY AVATARS
// =====================================================

const AVATARS = [
  {
    id: "northern-warden",
    name: "Northern Warden",
    seed: "Northern Warden",
    icon: "❄️",
    description: "Guardian of the North",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Northern-Warden",
  },
  {
    id: "wolf-lord",
    name: "Wolf Lord",
    seed: "Wolf Lord",
    icon: "🐺",
    description: "Lord of the Wolves",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Wolf-Lord",
  },
  {
    id: "iron-king",
    name: "Iron King",
    seed: "Iron King",
    icon: "👑",
    description: "Ruler of the Realm",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Iron-King",
  },
  {
    id: "dragon-rider",
    name: "Dragon Rider",
    seed: "Dragon Rider",
    icon: "🐉",
    description: "Rider of Ancient Beasts",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Dragon-Rider",
  },
  {
    id: "royal-guardian",
    name: "Royal Guardian",
    seed: "Royal Guardian",
    icon: "🛡️",
    description: "Shield of the Crown",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Royal-Guardian",
  },
  {
    id: "raven-keeper",
    name: "Raven Keeper",
    seed: "Raven Keeper",
    icon: "🐦‍⬛",
    description: "Keeper of Secrets",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Raven-Keeper",
  },
  {
    id: "fireborn",
    name: "Fireborn",
    seed: "Fireborn Warrior",
    icon: "🔥",
    description: "Born of Fire",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Fireborn-Warrior",
  },
  {
    id: "night-warden",
    name: "Night Warden",
    seed: "Night Warden",
    icon: "🌑",
    description: "Watcher Beyond the Wall",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Night-Warden",
  },
  {
    id: "shadow-blade",
    name: "Shadow Blade",
    seed: "Shadow Blade",
    icon: "🗡️",
    description: "Master of Silent Blades",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Shadow-Blade",
  },
  {
    id: "castle-lord",
    name: "Castle Lord",
    seed: "Castle Lord",
    icon: "🏰",
    description: "Lord of the Fortress",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Castle-Lord",
  },
  {
    id: "realm-queen",
    name: "Realm Queen",
    seed: "Realm Queen",
    icon: "👸",
    description: "Queen of the Realm",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Realm-Queen",
  },
  {
    id: "dragon-knight",
    name: "Dragon Knight",
    seed: "Dragon Knight",
    icon: "🐲",
    description: "Knight of the Ancient Order",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Dragon-Knight",
  },
];

// =====================================================
// INFO CARD
// =====================================================

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-800/80 bg-[#0b1014]/80 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/25 hover:bg-[#0d1318]">
      <div className="pointer-events-none absolute inset-y-0 -left-24 w-20 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent transition-transform duration-700 group-hover:translate-x-[500px]" />

      <div className="relative flex items-center gap-3">
        <div className="rounded-lg border border-cyan-400/10 bg-cyan-400/[0.06] p-2.5 transition-all duration-300 group-hover:border-amber-400/20 group-hover:bg-amber-400/[0.06]">
          <Icon className="h-5 w-5 text-cyan-400 transition-colors duration-300 group-hover:text-amber-400" />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
            {label}
          </p>

          <p className="mt-1 truncate text-sm font-medium capitalize text-slate-200">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// FLOATING PARTICLES
// =====================================================

function FloatingParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 25 }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 8}s`,
        duration: `${7 + Math.random() * 8}s`,
        size: `${1 + Math.random() * 3}px`,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute bottom-0 rounded-full bg-amber-300/40 opacity-0"
          style={{
            left: particle.left,
            width: particle.size,
            height: particle.size,
            animation: `riseParticle ${particle.duration} linear ${particle.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

// =====================================================
// PROFILE
// =====================================================

function Profile() {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    avatar: "",
  });

  // ===================================================
  // FETCH PROFILE
  // ===================================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/auth/me");

        if (response.data?.success) {
          const currentUser = response.data.user;

          setUser(currentUser);

          setFormData({
            name: currentUser?.name || "",
            bio: currentUser?.bio || "",
            avatar: currentUser?.avatar || "",
          });
        } else {
          setError("Unable to load your profile.");
        }
      } catch (error) {
        console.error("Fetch profile error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ===================================================
  // INPUT CHANGE
  // ===================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // ===================================================
  // EDIT
  // ===================================================

  const handleEdit = () => {
    setFormData({
      name: user?.name || "",
      bio: user?.bio || "",
      avatar: user?.avatar || "",
    });

    setError("");
    setEditing(true);
  };

  // ===================================================
  // CANCEL
  // ===================================================

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      bio: user?.bio || "",
      avatar: user?.avatar || "",
    });

    setError("");
    setEditing(false);
  };

  // ===================================================
  // SELECT AVATAR
  // ===================================================

  const handleAvatarSelect = (avatar) => {
    setFormData((prev) => ({
      ...prev,
      avatar: avatar.url,
    }));

    setError("");
  };

  // ===================================================
  // RANDOM AVATAR
  // ===================================================

  const handleRandomAvatar = () => {
    const currentIndex = AVATARS.findIndex(
      (avatar) => avatar.url === formData.avatar
    );

    let randomIndex;

    do {
      randomIndex = Math.floor(
        Math.random() * AVATARS.length
      );
    } while (
      AVATARS.length > 1 &&
      randomIndex === currentIndex
    );

    setFormData((prev) => ({
      ...prev,
      avatar: AVATARS[randomIndex].url,
    }));

    setError("");

    toast.success(
      `The ${AVATARS[randomIndex].name} has been chosen.`
    );
  };

  // ===================================================
  // SAVE
  // ===================================================

  const handleSaveProfile = async () => {
    try {
      const trimmedName = formData.name.trim();
      const trimmedBio = formData.bio.trim();

      if (!trimmedName) {
        setError("Name is required.");
        return;
      }

      if (trimmedBio.length > 300) {
        setError("Bio cannot exceed 300 characters.");
        return;
      }

      setSaving(true);
      setError("");

      const response = await api.put("/auth/profile", {
        name: trimmedName,
        bio: trimmedBio,
        avatar: formData.avatar,
      });

      if (response.data?.success) {
        const updatedUser = response.data.user;

        setUser(updatedUser);

        setFormData({
          name: updatedUser?.name || "",
          bio: updatedUser?.bio || "",
          avatar: updatedUser?.avatar || "",
        });

        setEditing(false);

        toast.success("Your record has been updated.");
      } else {
        setError(
          response.data?.message ||
            "Unable to update your profile."
        );
      }
    } catch (error) {
      console.error("Update profile error:", error);

      const message =
        error.response?.data?.message ||
        "Unable to update your profile.";

      setError(message);

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="absolute -inset-5 animate-ping rounded-full bg-cyan-400/[0.03]" />

            <div className="absolute -inset-2 animate-pulse rounded-full border border-amber-400/10" />

            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/20 bg-[#0a0e11] shadow-2xl">
              <LoaderCircle className="h-7 w-7 animate-spin text-cyan-400" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400/70">
              Consulting the records
            </p>

            <p className="mt-2 text-[11px] text-slate-600">
              Retrieving your identity from the realm...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (error && !user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="max-w-md rounded-2xl border border-red-500/20 bg-red-950/10 p-8 text-center">
          <Shield className="mx-auto h-10 w-10 text-red-400" />

          <h2 className="mt-4 text-lg font-semibold text-red-300">
            The records could not be opened
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-6 pb-12">
      {/* =================================================
          ANIMATIONS
      ================================================= */}

      <style>
        {`
          @keyframes riseParticle {
            0% {
              transform: translateY(20px) scale(.7);
              opacity: 0;
            }

            15% {
              opacity: .45;
            }

            70% {
              opacity: .18;
            }

            100% {
              transform: translateY(-380px) scale(1);
              opacity: 0;
            }
          }

          @keyframes moonPulse {
            0%, 100% {
              opacity: .22;
              transform: scale(1);
            }

            50% {
              opacity: .38;
              transform: scale(1.06);
            }
          }

          @keyframes slowFloat {
            0%, 100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-5px);
            }
          }

          @keyframes pulseGlow {
            0%, 100% {
              opacity: .2;
            }

            50% {
              opacity: .6;
            }
          }

          @keyframes swordGlow {
            0%, 100% {
              opacity: .3;
              transform: scaleX(1);
            }

            50% {
              opacity: .8;
              transform: scaleX(1.04);
            }
          }
        `}
      </style>

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[25%] top-10 h-[420px] w-[420px] rounded-full bg-cyan-500/[0.025] blur-[150px]" />

        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-amber-500/[0.025] blur-[170px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#06080a_90%)]" />
      </div>

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="relative">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-400">
          <Sparkles className="h-3.5 w-3.5" />
          The Realm · Identity
        </div>

        <div className="mt-2 flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
            Your Profile
          </h1>

          <div className="hidden h-px flex-1 bg-gradient-to-r from-slate-800 via-amber-400/20 to-transparent sm:block" />
        </div>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          Your identity within the realm. Choose your banner,
          maintain your record, and continue your journey.
        </p>
      </div>

      {/* =================================================
          MAIN PROFILE CARD
      ================================================= */}

      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#080c0f] shadow-2xl shadow-black/40">
        {/* =================================================
            FANTASY BANNER
        ================================================= */}

        <div className="relative h-52 overflow-hidden border-b border-slate-800/70 bg-gradient-to-b from-[#0b141c] via-[#080e13] to-[#080c0f]">
          <FloatingParticles />

          {/* Moon */}
          <div
            className="absolute right-[13%] top-8 h-20 w-20 rounded-full bg-slate-300/[0.08]"
            style={{
              animation:
                "moonPulse 5s ease-in-out infinite",
            }}
          />

          <div
            className="absolute right-[10%] top-4 h-28 w-28 rounded-full bg-slate-200/[0.035] blur-xl"
            style={{
              animation:
                "moonPulse 5s ease-in-out infinite",
            }}
          />

          {/* Stars */}

          <span className="absolute left-[12%] top-10 h-1 w-1 rounded-full bg-slate-300/40" />
          <span className="absolute left-[25%] top-7 h-1 w-1 rounded-full bg-cyan-200/30" />
          <span className="absolute left-[39%] top-20 h-1 w-1 rounded-full bg-slate-300/40" />
          <span className="absolute left-[53%] top-9 h-1 w-1 rounded-full bg-slate-300/30" />
          <span className="absolute left-[70%] top-24 h-1 w-1 rounded-full bg-cyan-200/30" />
          <span className="absolute left-[84%] top-12 h-1 w-1 rounded-full bg-slate-300/40" />

          {/* Mountains */}

          <div
            className="absolute bottom-0 left-0 h-28 w-[48%] opacity-40"
            style={{
              clipPath:
                "polygon(0 100%, 14% 48%, 27% 70%, 43% 20%, 58% 64%, 75% 34%, 100% 100%)",
              background: "#040607",
            }}
          />

          <div
            className="absolute bottom-0 right-0 h-32 w-[52%] opacity-30"
            style={{
              clipPath:
                "polygon(0 100%, 18% 60%, 35% 30%, 52% 70%, 68% 40%, 82% 60%, 100% 25%, 100% 100%)",
              background: "#040607",
            }}
          />

          {/* Castle */}

          <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-end opacity-45">
            <div className="h-20 w-40 bg-[#030405]" />

            <div className="relative h-32 w-9 bg-[#020304]">
              <div className="absolute -top-5 left-0 h-5 w-9 bg-[#020304]" />
            </div>

            <div className="relative h-24 w-10 bg-[#020304]">
              <div className="absolute -top-5 left-0 h-5 w-10 bg-[#020304]" />
            </div>

            <div className="relative h-36 w-11 bg-[#020304]">
              <div className="absolute -top-5 left-0 h-5 w-11 bg-[#020304]" />
            </div>

            <div className="h-20 w-40 bg-[#030405]" />
          </div>

          {/* Castle lights */}

          <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 gap-7 opacity-40">
            <span className="h-2.5 w-1 rounded-full bg-amber-300 blur-[1px]" />
            <span className="h-3.5 w-1 rounded-full bg-amber-300 blur-[1px]" />
            <span className="h-2.5 w-1 rounded-full bg-amber-300 blur-[1px]" />
          </div>

          {/* Mist */}

          <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-[#080c0f] via-[#080c0f]/70 to-transparent" />

          {/* Horizon */}

          <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="relative px-5 pb-8 sm:px-8">
          {/* =================================================
              IDENTITY
          ================================================= */}

          <div className="-mt-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              {/* Avatar */}

              <div
                className="relative"
                style={{
                  animation:
                    "slowFloat 5s ease-in-out infinite",
                }}
              >
                <div
                  className="absolute -inset-4 rounded-full bg-cyan-400/[0.035] blur-xl"
                  style={{
                    animation:
                      "pulseGlow 4s ease-in-out infinite",
                  }}
                />

                <div className="absolute -inset-1 rounded-full border border-amber-400/20" />

                <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-[5px] border-[#080c0f] bg-gradient-to-br from-slate-800 to-slate-950 shadow-2xl shadow-black/60">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user?.name || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-slate-600" />
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent" />
                </div>

                {/* Verified */}

                <div className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-[#080c0f] bg-emerald-500 shadow-lg shadow-emerald-950/40">
                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                </div>
              </div>

              {/* Name */}

              <div className="pb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-white">
                    {user?.name || "Unknown User"}
                  </h2>

                  <Crown className="h-4 w-4 text-amber-400" />
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-cyan-400/10 bg-cyan-400/[0.06] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
                    {user?.role || "student"}
                  </span>

                  <span className="text-xs text-slate-700">
                    ·
                  </span>

                  <span className="text-xs text-slate-600">
                    Member of the Realm
                  </span>
                </div>
              </div>
            </div>

            {/* Edit button */}

            {!editing && (
              <button
                type="button"
                onClick={handleEdit}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg border border-amber-400/20 bg-amber-400/[0.06] px-5 py-2.5 text-sm font-medium text-amber-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/40 hover:bg-amber-400/10 hover:shadow-lg hover:shadow-amber-950/20"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                <Pencil className="relative h-4 w-4" />

                <span className="relative">
                  Edit Profile
                </span>
              </button>
            )}
          </div>

          {/* =================================================
              EDIT PANEL
          ================================================= */}

          {editing && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-amber-400/15 bg-gradient-to-br from-amber-400/[0.025] to-cyan-400/[0.02]">
              {/* Header */}

              <div className="border-b border-slate-800/80 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg border border-amber-400/10 bg-amber-400/[0.05] p-2">
                    <Sword className="h-4 w-4 text-amber-400" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
                      Rewrite Your Record
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      Choose the identity that represents you.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-7 p-5 sm:p-6">
                {/* =================================================
                    AVATAR SELECTION
                ================================================= */}

                <div>
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <label className="text-sm font-semibold text-slate-200">
                        Choose Your Banner
                      </label>

                      <p className="mt-1 text-xs text-slate-600">
                        Choose a warrior, ruler, guardian, or
                        creature to represent your realm identity.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleRandomAvatar}
                      className="group inline-flex w-fit items-center gap-2 rounded-lg border border-cyan-400/15 bg-cyan-400/[0.04] px-3 py-2 text-xs font-medium text-cyan-300 transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/[0.08]"
                    >
                      <Shuffle className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180" />

                      Random Avatar
                    </button>
                  </div>

                  {/* Avatar Grid */}

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {AVATARS.map((avatar) => {
                      const selected =
                        formData.avatar === avatar.url;

                      return (
                        <button
                          key={avatar.id}
                          type="button"
                          onClick={() =>
                            handleAvatarSelect(avatar)
                          }
                          className={`group relative overflow-hidden rounded-xl border p-2 text-left transition-all duration-300 ${
                            selected
                              ? "scale-[1.02] border-amber-400/60 bg-amber-400/[0.07] shadow-xl shadow-amber-950/30"
                              : "border-slate-800 bg-[#070a0d] hover:-translate-y-1 hover:border-slate-600 hover:bg-slate-950"
                          }`}
                        >
                          {/* Avatar */}

                          <div className="relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-slate-800/70 to-black">
                            <img
                              src={avatar.url}
                              alt={avatar.name}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                            />

                            {/* Dark overlay */}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                            {/* Selected */}

                            {selected && (
                              <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-lg">
                                <Check className="h-3.5 w-3.5" />
                              </div>
                            )}

                            {/* Icon */}

                            <div className="absolute bottom-2 left-2 text-lg drop-shadow-lg">
                              {avatar.icon}
                            </div>
                          </div>

                          {/* Name */}

                          <div className="mt-3">
                            <div className="flex items-center gap-1.5">
                              <p
                                className={`text-xs font-semibold ${
                                  selected
                                    ? "text-amber-300"
                                    : "text-slate-300"
                                }`}
                              >
                                {avatar.name}
                              </p>
                            </div>

                            <p className="mt-1 text-[9px] leading-4 text-slate-600">
                              {avatar.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Current selection */}

                  {formData.avatar && (
                    <div className="mt-4 flex items-center gap-3 rounded-lg border border-amber-400/10 bg-amber-400/[0.025] px-4 py-3">
                      <div className="h-9 w-9 overflow-hidden rounded-full border border-amber-400/20">
                        <img
                          src={formData.avatar}
                          alt="Selected avatar"
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-slate-600">
                          Current Selection
                        </p>

                        <p className="mt-0.5 text-xs font-medium text-amber-300">
                          {AVATARS.find(
                            (avatar) =>
                              avatar.url ===
                              formData.avatar
                          )?.name ||
                            "Custom Realm Avatar"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Divider */}

                <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

                {/* =================================================
                    NAME
                ================================================= */}

                <div>
                  <label
                    htmlFor="profile-name"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Display Name
                  </label>

                  <input
                    id="profile-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={100}
                    placeholder="Enter your name"
                    className="w-full rounded-lg border border-slate-800 bg-[#070a0d] px-4 py-3 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-700 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/10"
                  />
                </div>

                {/* =================================================
                    BIO
                ================================================= */}

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="profile-bio"
                      className="text-sm font-medium text-slate-300"
                    >
                      Biography
                    </label>

                    <span
                      className={`text-xs ${
                        formData.bio.length >= 280
                          ? "text-amber-400"
                          : "text-slate-700"
                      }`}
                    >
                      {formData.bio.length}/300
                    </span>
                  </div>

                  <textarea
                    id="profile-bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    maxLength={300}
                    rows={4}
                    placeholder="Tell the realm a little about yourself..."
                    className="w-full resize-none rounded-lg border border-slate-800 bg-[#070a0d] px-4 py-3 text-sm leading-relaxed text-slate-200 outline-none transition-all placeholder:text-slate-700 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/10"
                  />
                </div>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                  <div className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/[0.04] px-4 py-3 text-sm text-red-400">
                    <Shield className="h-4 w-4 shrink-0" />

                    <span>{error}</span>
                  </div>
                )}

                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="flex flex-col-reverse gap-3 border-t border-slate-800/70 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-5 py-2.5 text-sm font-medium text-slate-400 transition-all hover:border-slate-700 hover:bg-slate-900 hover:text-slate-200 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />

                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-cyan-950/40 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                    {saving ? (
                      <LoaderCircle className="relative h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="relative h-4 w-4" />
                    )}

                    <span className="relative">
                      {saving
                        ? "Saving..."
                        : "Save Changes"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              ACCOUNT INFORMATION
          ================================================= */}

          <div className="mt-9">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-8 bg-amber-400/30" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-600">
                Account Information
              </p>

              <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent" />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <InfoCard
                icon={User}
                label="Name"
                value={user?.name || "Not provided"}
              />

              <InfoCard
                icon={Mail}
                label="Email"
                value={user?.email || "Not provided"}
              />

              <InfoCard
                icon={Shield}
                label="Role"
                value={user?.role || "Not provided"}
              />

              <InfoCard
                icon={CalendarDays}
                label="Member since"
                value={
                  user?.createdAt
                    ? new Date(
                        user.createdAt
                      ).toLocaleDateString()
                    : "Not available"
                }
              />
            </div>
          </div>

          {/* =================================================
              BIO
          ================================================= */}

          <div className="group relative mt-6 overflow-hidden rounded-xl border border-slate-800 bg-[#0a0e11]/70 p-5">
            <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-amber-400/40 to-transparent" />

            <div className="pointer-events-none absolute inset-y-0 -left-32 w-32 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.025] to-transparent transition-transform duration-1000 group-hover:translate-x-[800px]" />

            <div className="relative">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-600">
                  About the Seeker
                </p>
              </div>

              <p className="text-sm leading-7 text-slate-400">
                {user?.bio?.trim()
                  ? user.bio
                  : "No biography has been written yet. Tell the realm a little about yourself."}
              </p>
            </div>
          </div>

          {/* =================================================
              EMAIL VERIFICATION
          ================================================= */}

          <div
            className={`group relative mt-6 overflow-hidden rounded-xl border p-5 transition-all duration-300 ${
              user?.isVerified
                ? "border-emerald-500/15 bg-emerald-500/[0.025] hover:border-emerald-500/30"
                : "border-amber-500/15 bg-amber-500/[0.025] hover:border-amber-500/30"
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div
                  className={`rounded-lg border p-2.5 ${
                    user?.isVerified
                      ? "border-emerald-400/10 bg-emerald-400/[0.06]"
                      : "border-amber-400/10 bg-amber-400/[0.06]"
                  }`}
                >
                  {user?.isVerified ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <Mail className="h-5 w-5 text-amber-400" />
                  )}
                </div>

                <div>
                  <p className="font-medium text-slate-200">
                    Email Verification
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {user?.isVerified
                      ? "Your email address has been verified and your account record is secure."
                      : "Your email address has not been verified yet."}
                  </p>
                </div>
              </div>

              <span
                className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${
                  user?.isVerified
                    ? "border-emerald-400/15 bg-emerald-500/[0.06] text-emerald-400"
                    : "border-amber-400/15 bg-amber-500/[0.06] text-amber-400"
                }`}
              >
                {user?.isVerified
                  ? "Verified"
                  : "Unverified"}
              </span>
            </div>
          </div>

          {/* =================================================
              REALM FOOTER
          ================================================= */}

          <div className="mt-8 flex flex-col items-center justify-center gap-2">
            <div
              className="h-px w-32 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"
              style={{
                animation:
                  "swordGlow 3s ease-in-out infinite",
              }}
            />

            <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.35em] text-slate-700">
              <Crown className="h-3 w-3 text-amber-400/30" />

              <span>
                Your record · Your banner · Your realm
              </span>

              <Crown className="h-3 w-3 text-amber-400/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;