import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Edit3,
  LoaderCircle,
  Mail,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function InstructorProfile() {
  const navigate = useNavigate();

  const {
    user,
    setUser,
    getCurrentUser,
  } = useAuth();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  // =========================================
  // SAVE PROFILE
  // =========================================

  const handleSave = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Name cannot be empty.");
      return;
    }

    if (trimmedName.length < 2) {
      toast.error("Name must contain at least 2 characters.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.put(
        "/auth/profile",
        {
          name: trimmedName,
        }
      );

      if (response.data?.success) {
        const updatedUser = response.data.user;

        setUser(updatedUser);

        setName(updatedUser.name || "");

        setEditing(false);

        toast.success(
          "Profile updated successfully."
        );
      } else {
        toast.error(
          response.data?.message ||
            "Unable to update profile."
        );
      }
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // CANCEL EDIT
  // =========================================

  const handleCancel = () => {
    setName(user?.name || "");
    setEditing(false);
  };

  // =========================================
  // LOADING USER
  // =========================================

  if (!user) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle
            size={36}
            className="animate-spin text-indigo-600"
          />

          <p className="text-sm text-gray-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  const firstLetter =
    user.name?.charAt(0)?.toUpperCase() || "I";

  return (
    <div className="min-h-full bg-[#F7F6F2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-8">

          <button
            type="button"
            onClick={() =>
              navigate("/instructor")
            }
            className="
              mb-5
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-gray-500
              transition
              hover:text-gray-900
            "
          >
            <ArrowLeft size={18} />

            Back to Dashboard
          </button>

          <div>
            <p className="text-sm font-medium text-indigo-600">
              Account
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#15121F]">
              Instructor Profile
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your personal account information.
            </p>
          </div>
        </div>

        {/* =====================================
            PROFILE CARD
        ===================================== */}

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

          {/* TOP PROFILE */}

          <div className="border-b border-gray-100 px-6 py-8 sm:px-8">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-5">

                {/* AVATAR */}

                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="
                      h-20
                      w-20
                      shrink-0
                      rounded-2xl
                      object-cover
                      shadow-sm
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-20
                      w-20
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-indigo-100
                      text-2xl
                      font-bold
                      text-indigo-600
                      shadow-sm
                    "
                  >
                    {firstLetter}
                  </div>
                )}

                <div className="min-w-0">

                  <h2 className="truncate text-xl font-bold text-gray-900">
                    {user.name}
                  </h2>

                  <p className="mt-1 truncate text-sm text-gray-500">
                    {user.email}
                  </p>

                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold capitalize text-indigo-600">
                    <ShieldCheck size={14} />

                    {user.role || "Instructor"}
                  </div>

                </div>
              </div>

              {/* EDIT BUTTON */}

              {!editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-gray-700
                    shadow-sm
                    transition
                    hover:border-indigo-200
                    hover:bg-indigo-50
                    hover:text-indigo-600
                  "
                >
                  <Edit3 size={17} />

                  Edit Profile
                </button>
              )}

            </div>
          </div>

          {/* =====================================
              INFORMATION
          ===================================== */}

          <div className="p-6 sm:p-8">

            <div className="mb-6">

              <h2 className="text-lg font-semibold text-gray-900">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Update the information associated with
                your instructor account.
              </p>

            </div>

            <form onSubmit={handleSave}>

              <div className="grid gap-5 md:grid-cols-2">

                {/* NAME */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>

                  <div className="relative">

                    <User
                      size={18}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                    />

                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      disabled={!editing || saving}
                      className={`
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        py-3.5
                        pl-11
                        pr-4
                        text-sm
                        text-gray-900
                        outline-none
                        transition
                        ${
                          editing
                            ? "bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                            : "cursor-not-allowed bg-gray-50"
                        }
                      `}
                    />

                  </div>

                </div>

                {/* EMAIL */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                    />

                    <input
                      type="email"
                      value={user.email || ""}
                      disabled
                      className="
                        w-full
                        cursor-not-allowed
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-50
                        py-3.5
                        pl-11
                        pr-4
                        text-sm
                        text-gray-600
                        outline-none
                      "
                    />

                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    Email address cannot be changed here.
                  </p>

                </div>

              </div>

              {/* =================================
                  ACCOUNT DETAILS
              ================================= */}

              <div className="mt-8 grid gap-4 sm:grid-cols-2">

                <ProfileInfo
                  icon={<ShieldCheck size={19} />}
                  title="Account Role"
                  value={
                    user.role || "Instructor"
                  }
                />

                <ProfileInfo
                  icon={<Check size={19} />}
                  title="Account Status"
                  value={
                    user.isVerified
                      ? "Verified"
                      : "Active"
                  }
                />

              </div>

              {/* =================================
                  ACTIONS
              ================================= */}

              {editing && (
                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-gray-200
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-gray-600
                      transition
                      hover:bg-gray-50
                      disabled:opacity-50
                    "
                  >
                    <X size={17} />

                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-indigo-600
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-white
                      shadow-sm
                      transition
                      hover:bg-indigo-700
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {saving ? (
                      <>
                        <LoaderCircle
                          size={17}
                          className="animate-spin"
                        />

                        Saving...
                      </>
                    ) : (
                      <>
                        <Check size={17} />

                        Save Changes
                      </>
                    )}
                  </button>

                </div>
              )}

            </form>
          </div>
        </div>

        {/* =====================================
            SECURITY CARD
        ===================================== */}

        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-lg font-semibold text-gray-900">
                Account Security
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Keep your account secure by managing
                your password and login settings.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                toast("Password change will be added next.")
              }
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                border
                border-gray-200
                px-4
                py-3
                text-sm
                font-semibold
                text-gray-700
                transition
                hover:border-indigo-200
                hover:bg-indigo-50
                hover:text-indigo-600
              "
            >
              Change Password
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

/* ============================================
   PROFILE INFO
============================================ */

function ProfileInfo({
  icon,
  title,
  value,
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-xs font-medium text-gray-400">
          {title}
        </p>

        <p className="mt-1 text-sm font-semibold capitalize text-gray-800">
          {value}
        </p>

      </div>

    </div>
  );
}

export default InstructorProfile;