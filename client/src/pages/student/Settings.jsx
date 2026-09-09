import { useState } from "react";
import {
  User,
  Shield,
  Bell,
  Palette,
  LockKeyhole,
  Mail,
  Save,
  Eye,
  EyeOff,
  LogOut,
  Trash2,
  Crown,
  Sword,
  Castle,
  Snowflake,
  Flame,
  Feather,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Settings() {
  const navigate = useNavigate();

  // =====================================================
  // PROFILE
  // =====================================================

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  // =====================================================
  // PASSWORD
  // =====================================================

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

  // =====================================================
  // PREFERENCES
  // =====================================================

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    achievementNotifications: true,
    courseCompletionNotifications: true,
    weeklyReminders: true,
  });

  // =====================================================
  // UI STATE
  // =====================================================

  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // =====================================================
  // HANDLERS
  // =====================================================

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePreference = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    toast.success("Preference updated.");
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!profile.name.trim()) {
      toast.error("Your name cannot be empty.");
      return;
    }

    setSavingProfile(true);

    try {
      // Backend API will be connected here.
      await new Promise((resolve) => setTimeout(resolve, 700));

      toast.success("Your profile has been updated.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to update your profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwords;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Complete all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must contain at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setChangingPassword(true);

    try {
      // Backend API will be connected here.
      await new Promise((resolve) => setTimeout(resolve, 700));

      toast.success("Your password has been changed.");

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Unable to change your password.");
    } finally {
      setChangingPassword(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("You have left the realm.");

    navigate("/login");
  };

  // =====================================================
  // DELETE ACCOUNT
  // =====================================================

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone."
    );

    if (!confirmed) return;

    toast.error("Account deletion API is not connected yet.");
  };

  // =====================================================
  // TOGGLE
  // =====================================================

  const Toggle = ({ enabled, onClick }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`
          relative h-7 w-12 rounded-full border transition-all duration-300
          ${
            enabled
              ? "border-amber-400/50 bg-amber-500/20 shadow-[0_0_18px_rgba(202,168,88,0.18)]"
              : "border-white/10 bg-white/[0.04]"
          }
        `}
      >
        <span
          className={`
            absolute top-1 h-5 w-5 rounded-full transition-all duration-300
            ${
              enabled
                ? "left-6 bg-amber-300 shadow-[0_0_10px_rgba(245,200,100,0.55)]"
                : "left-1 bg-slate-500"
            }
          `}
        />
      </button>
    );
  };

  // =====================================================
  // PASSWORD FIELD
  // =====================================================

  const PasswordField = ({
    label,
    name,
    value,
    visible,
    onToggle,
  }) => {
    return (
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          {label}
        </label>

        <div className="relative">
          <LockKeyhole
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type={visible ? "text" : "password"}
            name={name}
            value={value}
            onChange={handlePasswordChange}
            className="
              w-full rounded-xl border border-white/10
              bg-black/30 py-3 pl-11 pr-12
              text-sm text-slate-200
              outline-none transition
              placeholder:text-slate-600
              focus:border-amber-400/40
              focus:bg-black/40
              focus:ring-1 focus:ring-amber-400/20
            "
            placeholder={`Enter ${label.toLowerCase()}`}
          />

          <button
            type="button"
            onClick={onToggle}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-amber-300"
          >
            {visible ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06080a] text-slate-200">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Moon */}
        <div className="absolute right-[8%] top-16 h-32 w-32 rounded-full bg-slate-200/10 blur-[1px] shadow-[0_0_70px_rgba(180,210,230,0.12)]" />

        {/* Moon glow */}
        <div className="absolute right-[5%] top-8 h-52 w-52 rounded-full bg-cyan-300/[0.025] blur-3xl" />

        {/* Mountains */}
        <div
          className="
            absolute bottom-0 left-0 h-72 w-full
            bg-[linear-gradient(135deg,transparent_45%,#11171b_45%,#11171b_55%,transparent_55%)]
            opacity-70
          "
        />

        <div
          className="
            absolute bottom-0 left-0 h-56 w-full
            bg-[linear-gradient(45deg,transparent_45%,#0c1114_45%,#0c1114_55%,transparent_55%)]
            opacity-80
          "
        />

        {/* Castle silhouette */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-30">
          <div className="relative h-32 w-64 bg-[#111519]">
            <div className="absolute -left-8 bottom-0 h-24 w-12 bg-[#111519]" />
            <div className="absolute -right-8 bottom-0 h-24 w-12 bg-[#111519]" />

            <div className="absolute -left-8 -top-5 flex gap-2">
              <span className="h-6 w-3 bg-[#111519]" />
              <span className="h-6 w-3 bg-[#111519]" />
              <span className="h-6 w-3 bg-[#111519]" />
            </div>

            <div className="absolute -right-8 -top-5 flex gap-2">
              <span className="h-6 w-3 bg-[#111519]" />
              <span className="h-6 w-3 bg-[#111519]" />
              <span className="h-6 w-3 bg-[#111519]" />
            </div>

            <div className="absolute -top-8 left-1/2 h-10 w-14 -translate-x-1/2 bg-[#111519]" />

            <div className="absolute left-1/2 bottom-0 h-14 w-8 -translate-x-1/2 rounded-t-full bg-black/60" />
          </div>
        </div>

        {/* Fog */}
        <div className="settings-fog absolute bottom-20 left-[-10%] h-24 w-[120%] rounded-full bg-slate-300/[0.025] blur-3xl" />
        <div className="settings-fog-two absolute bottom-40 left-[-20%] h-20 w-[120%] rounded-full bg-cyan-200/[0.02] blur-3xl" />

        {/* Snow */}
        {Array.from({ length: 28 }).map((_, index) => (
          <span
            key={`snow-${index}`}
            className="settings-snow absolute h-1 w-1 rounded-full bg-slate-200/40"
            style={{
              left: `${(index * 37) % 100}%`,
              animationDelay: `${(index % 9) * 0.8}s`,
              animationDuration: `${7 + (index % 5)}s`,
            }}
          />
        ))}

        {/* Embers */}
        {Array.from({ length: 14 }).map((_, index) => (
          <span
            key={`ember-${index}`}
            className="settings-ember absolute h-1 w-1 rounded-full bg-amber-300/50"
            style={{
              left: `${(index * 53) % 100}%`,
              bottom: `${5 + (index % 5) * 5}%`,
              animationDelay: `${(index % 6) * 0.7}s`,
              animationDuration: `${4 + (index % 4)}s`,
            }}
          />
        ))}

        {/* Stone texture */}
        <div
          className="
            absolute inset-0 opacity-[0.035]
            bg-[radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)]
            [background-size:17px_17px]
          "
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#030506_100%)]" />
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="relative">
              <Castle
                size={18}
                className="text-amber-300"
              />

              <span className="absolute -right-2 -top-2 h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-amber-300/80">
              The Realm · Personal Record
            </span>
          </div>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="font-serif text-4xl font-bold tracking-wide text-slate-100 sm:text-5xl">
                Settings
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Shape your account, protect your realm, and choose how
                your learning journey is recorded.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-amber-300/10 bg-black/30 px-4 py-3 backdrop-blur-xl">
              <Crown
                size={18}
                className="text-amber-300"
              />

              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
                  Your Record
                </p>

                <p className="text-xs font-semibold text-slate-300">
                  Keeper of Your Journey
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 h-px bg-gradient-to-r from-transparent via-amber-300/30 to-transparent" />
        </div>

        {/* =====================================================
            SETTINGS GRID
        ===================================================== */}

        <div className="space-y-6">
          {/* =================================================
              PROFILE
          ================================================= */}

          <section className="settings-card relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0e11]/90 shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />

            <div className="absolute right-0 top-0 opacity-[0.035]">
              <Shield size={220} />
            </div>

            <div className="relative p-6 sm:p-8">
              <div className="mb-7 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/5">
                  <User
                    size={20}
                    className="text-cyan-300"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-300/80">
                    Identity
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-100">
                    Profile & Account
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Keep your identity within the realm up to date.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile}>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Full Name
                    </label>

                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />

                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleProfileChange}
                        placeholder="Enter your name"
                        className="
                          w-full rounded-xl border border-white/10
                          bg-black/30 py-3 pl-11 pr-4
                          text-sm text-slate-200
                          outline-none transition
                          placeholder:text-slate-600
                          focus:border-cyan-300/30
                          focus:ring-1 focus:ring-cyan-300/20
                        "
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />

                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        placeholder="Enter your email"
                        className="
                          w-full rounded-xl border border-white/10
                          bg-black/30 py-3 pl-11 pr-4
                          text-sm text-slate-200
                          outline-none transition
                          placeholder:text-slate-600
                          focus:border-cyan-300/30
                          focus:ring-1 focus:ring-cyan-300/20
                        "
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="
                    mt-6 inline-flex items-center gap-2
                    rounded-xl border border-amber-300/25
                    bg-amber-300/10 px-5 py-3
                    text-xs font-bold uppercase tracking-[0.16em]
                    text-amber-200
                    transition-all
                    hover:border-amber-300/50
                    hover:bg-amber-300/15
                    hover:shadow-[0_0_25px_rgba(202,168,88,0.12)]
                    disabled:cursor-not-allowed disabled:opacity-50
                  "
                >
                  <Save size={15} />

                  {savingProfile ? "Recording..." : "Save Changes"}
                </button>
              </form>
            </div>
          </section>

          {/* =================================================
              SECURITY
          ================================================= */}

          <section className="settings-card relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0e11]/90 shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />

            <div className="absolute right-5 top-5 opacity-[0.035]">
              <Sword size={180} />
            </div>

            <div className="relative p-6 sm:p-8">
              <div className="mb-7 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/5">
                  <Shield
                    size={20}
                    className="text-amber-300"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-300/80">
                    Defenses
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-100">
                    Security
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Strengthen the walls protecting your account.
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePassword}>
                <div className="grid gap-5 md:grid-cols-3">
                  <PasswordField
                    label="Current Password"
                    name="currentPassword"
                    value={passwords.currentPassword}
                    visible={showPasswords.current}
                    onToggle={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        current: !prev.current,
                      }))
                    }
                  />

                  <PasswordField
                    label="New Password"
                    name="newPassword"
                    value={passwords.newPassword}
                    visible={showPasswords.new}
                    onToggle={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        new: !prev.new,
                      }))
                    }
                  />

                  <PasswordField
                    label="Confirm Password"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    visible={showPasswords.confirm}
                    onToggle={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="
                    mt-6 inline-flex items-center gap-2
                    rounded-xl border border-cyan-300/20
                    bg-cyan-300/5 px-5 py-3
                    text-xs font-bold uppercase tracking-[0.16em]
                    text-cyan-200
                    transition-all
                    hover:border-cyan-300/40
                    hover:bg-cyan-300/10
                    hover:shadow-[0_0_25px_rgba(100,200,240,0.1)]
                    disabled:cursor-not-allowed disabled:opacity-50
                  "
                >
                  <LockKeyhole size={15} />

                  {changingPassword
                    ? "Strengthening..."
                    : "Change Password"}
                </button>
              </form>
            </div>
          </section>

          {/* =================================================
              LEARNING PREFERENCES
          ================================================= */}

          <section className="settings-card relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0e11]/90 shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/30 to-transparent" />

            <div className="relative p-6 sm:p-8">
              <div className="mb-7 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-300/5">
                  <Bell
                    size={20}
                    className="text-violet-300"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-violet-300/80">
                    Ravens
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-100">
                    Learning Preferences
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Decide which messages reach you during your journey.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-white/[0.06]">
                {/* Email */}
                <div className="flex items-center justify-between gap-6 py-5 first:pt-0">
                  <div className="flex items-start gap-4">
                    <Mail
                      size={18}
                      className="mt-1 text-slate-500"
                    />

                    <div>
                      <h3 className="text-sm font-semibold text-slate-200">
                        Email Notifications
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Receive important learning updates by email.
                      </p>
                    </div>
                  </div>

                  <Toggle
                    enabled={preferences.emailNotifications}
                    onClick={() =>
                      togglePreference("emailNotifications")
                    }
                  />
                </div>

                {/* Achievement */}
                <div className="flex items-center justify-between gap-6 py-5">
                  <div className="flex items-start gap-4">
                    <Crown
                      size={18}
                      className="mt-1 text-amber-300"
                    />

                    <div>
                      <h3 className="text-sm font-semibold text-slate-200">
                        Achievement Notifications
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Be alerted when you unlock a new achievement.
                      </p>
                    </div>
                  </div>

                  <Toggle
                    enabled={preferences.achievementNotifications}
                    onClick={() =>
                      togglePreference(
                        "achievementNotifications"
                      )
                    }
                  />
                </div>

                {/* Course completion */}
                <div className="flex items-center justify-between gap-6 py-5">
                  <div className="flex items-start gap-4">
                    <CheckCircle2
                      size={18}
                      className="mt-1 text-emerald-300"
                    />

                    <div>
                      <h3 className="text-sm font-semibold text-slate-200">
                        Course Completion
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Receive a notification when a course is completed.
                      </p>
                    </div>
                  </div>

                  <Toggle
                    enabled={
                      preferences.courseCompletionNotifications
                    }
                    onClick={() =>
                      togglePreference(
                        "courseCompletionNotifications"
                      )
                    }
                  />
                </div>

                {/* Weekly reminder */}
                <div className="flex items-center justify-between gap-6 py-5 last:pb-0">
                  <div className="flex items-start gap-4">
                    <Flame
                      size={18}
                      className="mt-1 text-orange-300"
                    />

                    <div>
                      <h3 className="text-sm font-semibold text-slate-200">
                        Weekly Learning Reminder
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Keep your weekly learning goal alive.
                      </p>
                    </div>
                  </div>

                  <Toggle
                    enabled={preferences.weeklyReminders}
                    onClick={() =>
                      togglePreference("weeklyReminders")
                    }
                  />
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              APPEARANCE
          ================================================= */}

          <section className="settings-card relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0e11]/90 shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />

            <div className="relative p-6 sm:p-8">
              <div className="mb-7 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/5">
                  <Palette
                    size={20}
                    className="text-cyan-300"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-300/80">
                    The Realm
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-100">
                    Appearance
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Your interface follows the dark realm aesthetic.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative overflow-hidden rounded-xl border border-amber-300/20 bg-[#07090b] p-5">
                  <div className="absolute right-3 top-3">
                    <CheckCircle2
                      size={17}
                      className="text-amber-300"
                    />
                  </div>

                  <Crown
                    size={24}
                    className="mb-4 text-amber-300"
                  />

                  <h3 className="font-semibold text-slate-200">
                    Dark Medieval
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Stone, iron, moonlight and fire.
                  </p>

                  <div className="mt-5 flex gap-2">
                    <span className="h-2 w-8 rounded-full bg-slate-800" />
                    <span className="h-2 w-8 rounded-full bg-amber-400/70" />
                    <span className="h-2 w-8 rounded-full bg-cyan-300/60" />
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 opacity-50">
                  <Sparkles
                    size={24}
                    className="mb-4 text-slate-400"
                  />

                  <h3 className="font-semibold text-slate-400">
                    Other Themes
                  </h3>

                  <p className="mt-1 text-xs text-slate-600">
                    More realm styles may be added later.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              DANGER ZONE
          ================================================= */}

          <section className="relative overflow-hidden rounded-2xl border border-red-400/15 bg-red-950/[0.08] shadow-2xl">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/40 to-transparent" />

            <div className="relative p-6 sm:p-8">
              <div className="mb-7 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/5">
                  <AlertTriangle
                    size={20}
                    className="text-red-300"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-300/80">
                    The Last Watch
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-100">
                    Danger Zone
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Actions here can affect your account and learning record.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Logout */}
                <div className="flex flex-col justify-between gap-4 rounded-xl border border-white/[0.06] bg-black/20 p-5 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-4">
                    <LogOut
                      size={18}
                      className="mt-1 text-slate-400"
                    />

                    <div>
                      <h3 className="text-sm font-semibold text-slate-200">
                        Leave the Realm
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Sign out from your current session.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      inline-flex items-center justify-center gap-2
                      rounded-lg border border-white/10
                      bg-white/[0.04] px-4 py-2.5
                      text-xs font-bold uppercase tracking-wider
                      text-slate-300
                      transition
                      hover:border-amber-300/20
                      hover:bg-amber-300/5
                      hover:text-amber-200
                    "
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>

                {/* Delete */}
                <div className="flex flex-col justify-between gap-4 rounded-xl border border-red-400/10 bg-red-400/[0.02] p-5 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-4">
                    <Trash2
                      size={18}
                      className="mt-1 text-red-400"
                    />

                    <div>
                      <h3 className="text-sm font-semibold text-red-200">
                        Delete Account
                      </h3>

                      <p className="mt-1 max-w-xl text-xs leading-5 text-red-300/40">
                        Permanently delete your account and associated
                        learning data. This action cannot be undone.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="
                      inline-flex items-center justify-center gap-2
                      rounded-lg border border-red-400/20
                      bg-red-400/5 px-4 py-2.5
                      text-xs font-bold uppercase tracking-wider
                      text-red-300
                      transition
                      hover:border-red-400/40
                      hover:bg-red-400/10
                    "
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <Feather
              size={15}
              className="text-slate-600"
            />

            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
              Your choices · Your journey · Your record
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-slate-700">
            <Snowflake size={12} />
            <span>The realm remembers</span>
          </div>
        </div>
      </div>

      {/* =====================================================
          ANIMATIONS
      ===================================================== */}

      <style>{`
        .settings-card {
          animation: settingsRise 0.7s ease both;
        }

        .settings-card:nth-child(2) {
          animation-delay: 0.08s;
        }

        .settings-card:nth-child(3) {
          animation-delay: 0.16s;
        }

        .settings-card:nth-child(4) {
          animation-delay: 0.24s;
        }

        .settings-card:nth-child(5) {
          animation-delay: 0.32s;
        }

        .settings-fog {
          animation: fogDrift 18s ease-in-out infinite alternate;
        }

        .settings-fog-two {
          animation: fogDriftTwo 24s ease-in-out infinite alternate;
        }

        .settings-snow {
          top: -10px;
          animation: snowFall linear infinite;
        }

        .settings-ember {
          animation: emberRise ease-in-out infinite;
        }

        @keyframes settingsRise {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fogDrift {
          from {
            transform: translateX(-5%);
          }

          to {
            transform: translateX(8%);
          }
        }

        @keyframes fogDriftTwo {
          from {
            transform: translateX(8%);
          }

          to {
            transform: translateX(-8%);
          }
        }

        @keyframes snowFall {
          0% {
            transform: translateY(-10px) translateX(0);
            opacity: 0;
          }

          15% {
            opacity: 0.7;
          }

          100% {
            transform: translateY(100vh) translateX(35px);
            opacity: 0;
          }
        }

        @keyframes emberRise {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }

          20% {
            opacity: 0.8;
          }

          70% {
            opacity: 0.5;
          }

          100% {
            transform: translateY(-140px) translateX(25px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default Settings;