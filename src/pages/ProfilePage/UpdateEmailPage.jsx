"use client"

import { useState, useRef } from "react"
import Button from "../../components/shared/SubmitButton.jsx"
import SectionTitle from "./SectionTitle.jsx"
import TextInputField from "@/components/shared/TextInputField.jsx"
import { Toast } from "@/helpers/toastService.js"
import { useSelector } from "react-redux"
import { useUser } from "@/hooks/useUser.js"
import { validateForm, scrollToFirstError, validationPatterns } from "../../components/shared/validationUtils.jsx"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

function UpdateEmailPage() {
  const { user } = useSelector((state) => state.user)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Define validation rules
  const validationRules = {
    email: {
      required: true,
      requiredMessage: "New email address is required",
      pattern: validationPatterns.email.pattern,
      patternMessage: validationPatterns.email.message,
    },
    password: {
      required: true,
      requiredMessage: "Password is required to confirm this change",
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

  const { handleUpdateEmail } = useUser()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    const newErrors = validateForm(formData, validationRules)
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      scrollToFirstError({ email: emailRef, password: passwordRef })
      return
    }

    // Check if new email is the same as current email
    if (formData.email === user.email) {
      setErrors({
        email: "New email must be different from your current email",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await handleUpdateEmail(
        {
          email: formData.email,
          password: formData.password,
        },
        setError,
      )

      // Reset form after successful submission
      setFormData({
        email: "",
        password: "",
      })

      Toast.success("Email update request sent. Please check your new email for verification.")
    } catch (err) {
      // Error handling is done by the handleUpdateEmail function
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-screen max-w-screen items-center justify-between bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Link to="/profile/edit" className="mb-6 flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Link>

        <SectionTitle title="Update Email Address" subtitle="Change the email address associated with your account" />

        <div className="mt-8 rounded-lg bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 rounded-md bg-blue-50 p-4 text-sm text-blue-800">
            <p>
              <strong>Note:</strong> Changing your email will require verification. We'll send a confirmation link to
              your new email address.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <h4 className="mb-2 font-medium text-gray-700">Current Email</h4>
                <p className="text-gray-600">{user.email}</p>
              </div>

              <div ref={emailRef}>
                <TextInputField
                  label="New Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your new email address"
                  error={errors.email}
                  required
                />
              </div>

              <div ref={passwordRef}>
                <TextInputField
                  label="Confirm with Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                  error={errors.password}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  For security reasons, please enter your current password to confirm this change.
                </p>
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
                {isSubmitting ? "Updating..." : "Update Email"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdateEmailPage
