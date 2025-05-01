"use client"

import { useState, useRef } from "react"
import Button from "../../components/shared/SubmitButton.jsx"
import SectionTitle from "./SectionTitle.jsx"
import TextInputField from "@/components/shared/TextInputField.jsx"
import { Toast } from "@/helpers/toastService.js"
import { useUser } from "@/hooks/useUser.js"
import { validateForm, scrollToFirstError } from "../../components/shared/validationUtils.jsx"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Link } from "react-router-dom"
import { useSelector } from 'react-redux';

function UpdatePasswordPage() {
  const currentPasswordRef = useRef(null)
  const newPasswordRef = useRef(null)
  const confirmPasswordRef = useRef(null)
  const user = useSelector((state) => state.user.user)

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // State for password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Define validation rules
  const validationRules = {
    currentPassword: {
      required: true,
      requiredMessage: "Current password is required",
    },
    newPassword: {
      required: true,
      requiredMessage: "New password is required",
      minLength: 8,
      minLengthMessage: "Password must be at least 8 characters long",
    },
    confirmPassword: {
      required: true,
      requiredMessage: "Please confirm your new password",
      match: "newPassword",
      matchMessage: "Passwords do not match",
    },
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))

    // Clear error when field is being edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const { handleUpdatePassword } = useUser()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    const newErrors = validateForm(formData, validationRules)

    // Additional validation: check if new password is same as current
    if (formData.newPassword === formData.currentPassword) {
      newErrors.newPassword = "New password must be different from your current password"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      scrollToFirstError({
        currentPassword: currentPasswordRef,
        newPassword: newPasswordRef,
        confirmPassword: confirmPasswordRef,
      })
      return
    }

    setIsSubmitting(true)

    try {
      await handleUpdatePassword(
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
        user._id,
        setError,
      )

      // Reset form after successful submission
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (err) {
      // Error handling is done by the handleUpdatePassword function
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case "current":
        setShowCurrentPassword(!showCurrentPassword)
        break
      case "new":
        setShowNewPassword(!showNewPassword)
        break
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword)
        break
      default:
        break
    }
  }

  return (
    <div className="h-screen max-w-screen items-center justify-between bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Link to="/profile/edit" className="mb-6 flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Link>

        <SectionTitle title="Change Password" subtitle="Update your password to keep your account secure" />

        <div className="mt-8 rounded-lg bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div ref={currentPasswordRef} className="relative">
                <TextInputField
                  label="Current Password"
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                  error={errors.currentPassword}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  onClick={() => togglePasswordVisibility("current")}
                >
                  {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <div ref={newPasswordRef} className="relative">
                <TextInputField
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter your new password"
                  error={errors.newPassword}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  onClick={() => togglePasswordVisibility("new")}
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long.</p>
              </div>

              <div ref={confirmPasswordRef} className="relative">
                <TextInputField
                  label="Confirm New Password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your new password"
                  error={errors.confirmPassword}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-800">{error}</div>}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Link to="/profile">
                <Button className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300 sm:w-auto" type="button">
                  Cancel
                </Button>
              </Link>
              <Button
                className="w-full bg-black text-white transition-colors duration-200 hover:bg-gray-900 sm:w-auto"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdatePasswordPage
