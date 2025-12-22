import { useState } from "react";
import MainText from "../components/ApplicationPage/MainText";

function ApplicationFormPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "", // ✅ NEW
    resume: null,
    coverLetter: null,
    motivation: "",
    expertise: "",
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Allow only numbers and common phone formatting characters
      const filteredValue = value.replace(/[^0-9+\-() ]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: filteredValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user updates field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];

    if (file) {
      // Check file size (10MB max)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          [name]: "File size must be less than 10MB",
        }));
        return;
      }

      // Check file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.oasis.opendocument.text",
        "text/plain",
        "application/rtf",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [name]:
            "Invalid file type. Please upload PDF, DOC, DOCX, ODT, TXT, or RTF",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.position) {
      newErrors.position = "Please select a position";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Form submitted:", formData);
      setShowSuccessModal(true);

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        position: "", // ✅ reset
        resume: null,
        coverLetter: null,
        motivation: "",
        expertise: "",
      });
    }
  };

  const handlePositionChange = (position) => {
    setFormData((prev) => ({
      ...prev,
      position,
    }));

    // clear validation error if any
    if (errors.position) {
      setErrors((prev) => ({
        ...prev,
        position: "",
      }));
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #EFF6FF 0%, #E0E7FF 100%)",
      }}
    >
      {/* Header */}
      <header className="bg-white md:block hidden py-6 px-6">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-center max-h-[60px] justify-start">
            <img src="/Logo.svg" alt="Prime Clinics Logo" />
          </div>
        </div>
      </header>

      <div className="bg-blue-50 py-12 px-4">
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-10">
          {/* Left Section: Company Info and Benefits */}
          <div className="max-w-[635px]">
            <MainText
              className={"flex flex-col gap-[28px]"}
              onSelectPosition={handlePositionChange}
            />
          </div>

          {/* Right Section: Application Form */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="bg-[#F9FAFB] rounded-[16px] shadow-lg max-w-[599px] py-[23px] px-[15px] md:px-[32px] mb-8">
              <h3 className="text-[24px] font-semibold text-[#101828] text-center leading-[36px] mb-2">
                Start Your Application Now!
              </h3>
              <p className="text-[#364153] text-center text-[14px] font-normal leading-[22px] mb-8">
                We're excited to learn more about you. Please complete the form
                below to submit your job application at Prime Clinics
              </p>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-start gap-4 md:gap-10  pt-12 px-4 md:px-12 pb-10 rounded-2xl bg-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] self-stretch"
              >
                {/* Personal Information */}
                <div className="mb-4 w-full">
                  <h4 className="text-[20px] font-medium text-[#101828] leading-[32px] mb-4">
                    Personal Information
                  </h4>
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-[14px] font-medium text-[#364153] leading-[14px] mb-1"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Please enter your full name"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.fullName ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-[14px] font-medium text-[#364153] leading-[14px] mb-1"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter a valid email address"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-[14px] font-medium text-[#364153] leading-[14px] mb-1"
                      >
                        Phone Number <span className="!text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="position"
                        className="block text-[14px] font-medium text-[#364153] leading-[14px] mb-1"
                      >
                        Position you want to apply for{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <select
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.position ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="" disabled>
                          Select a position
                        </option>
                        <option value="nurse_practitioner">
                          Nurse Practitioner (NP)
                        </option>
                        <option value="licensed_practical_nurse">
                          Licensed Practical Nurse (LPN)
                        </option>
                      </select>

                      {errors.position && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.position}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Upload Documents */}
                <div className="mb-4 w-full">
                  <h4 className="text-[20px] font-medium text-[#101828] leading-[32px] mb-4">
                    Upload Documents
                  </h4>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[14px] font-medium text-[#364153] leading-[14px] mb-2">
                        Resume (Optional)
                      </label>
                      <label
                        htmlFor="resume"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-10 h-10 mb-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Upload your resume/CV
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Max. 10MB, in PDF, DOCX, DOC
                          </p>
                        </div>
                        <input
                          type="file"
                          id="resume"
                          name="resume"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.odt,.txt,.rtf"
                          className="hidden"
                        />
                      </label>
                      {formData.resume && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ {formData.resume.name}
                        </p>
                      )}
                      {errors.resume && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.resume}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[14px] font-medium text-[#364153] leading-[14px] mb-2">
                        Cover Letter (Optional)
                      </label>
                      <label
                        htmlFor="coverLetter"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-10 h-10 mb-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Upload your cover letter (optional)
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Max. 10MB, in PDF, DOCX, DOC
                          </p>
                        </div>
                        <input
                          type="file"
                          id="coverLetter"
                          name="coverLetter"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.odt,.txt,.rtf"
                          className="hidden"
                        />
                      </label>
                      {formData.coverLetter && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ {formData.coverLetter.name}
                        </p>
                      )}
                      {errors.coverLetter && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.coverLetter}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="md:mb-4">
                  <h4 className="text-[20px] font-medium text-[#101828] leading-[32px] mb-4">
                    Additional Information
                  </h4>
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="motivation"
                        className="block text-[14px] leading-[24px] font-medium text-[#364153]  mb-1"
                      >
                        Why do you want to work at Prime Clinics?
                      </label>
                      <textarea
                        id="motivation"
                        name="motivation"
                        value={formData.motivation}
                        onChange={handleInputChange}
                        placeholder="Tell us your motivation to join Prime Clinics"
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="expertise"
                        className="block text-[14px] leading-[24px] font-medium text-[#364153]  mb-1"
                      >
                        What are your areas of expertise or interest in health
                        optimization?
                      </label>
                      <textarea
                        id="expertise"
                        name="expertise"
                        value={formData.expertise}
                        onChange={handleInputChange}
                        placeholder="Describe your professional background, specializations, or relevant experience."
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#155DFC] text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Submit Application
                </button>

                {/* Disclaimer */}
                <p className="text-xs text-gray-500 text-center mt-4">
                  By submitting this form, you acknowledge that the information
                  provided is accurate to the best of your knowledge.
                </p>
              </form>
            </div>
          </div>
          <div className="mb-12 md:hidden block ">
            <h3 className="text-[30px] sm:text-[32px] font-semibold text-[#101828] text-center sm:text-start leading-[36px] sm:leading-[40px] mb-8">
              Why You'll Love Working Here
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                  >
                    <path
                      d="M19.8788 31C19.7002 30.3079 19.3394 29.6762 18.834 29.1708C18.3286 28.6653 17.6969 28.3046 17.0048 28.126L4.73476 24.962C4.52542 24.9026 4.34118 24.7765 4.20999 24.6029C4.07879 24.4293 4.00781 24.2176 4.00781 24C4.00781 23.7824 4.07879 23.5707 4.20999 23.3971C4.34118 23.2235 4.52542 23.0974 4.73476 23.038L17.0048 19.872C17.6967 19.6936 18.3282 19.3332 18.8336 18.8281C19.339 18.323 19.6999 17.6918 19.8788 17L23.0428 4.73001C23.1016 4.51985 23.2275 4.33469 23.4014 4.2028C23.5753 4.0709 23.7875 3.99951 24.0058 3.99951C24.224 3.99951 24.4363 4.0709 24.6101 4.2028C24.784 4.33469 24.91 4.51985 24.9688 4.73001L28.1308 17C28.3093 17.6922 28.6701 18.3238 29.1755 18.8292C29.681 19.3347 30.3126 19.6955 31.0048 19.874L43.2748 23.036C43.4858 23.0942 43.6719 23.22 43.8045 23.3942C43.9371 23.5683 44.0089 23.7811 44.0089 24C44.0089 24.2189 43.9371 24.4317 43.8045 24.6059C43.6719 24.78 43.4858 24.9058 43.2748 24.964L31.0048 28.126C30.3126 28.3046 29.681 28.6653 29.1755 29.1708C28.6701 29.6762 28.3093 30.3079 28.1308 31L24.9668 43.27C24.908 43.4802 24.782 43.6653 24.6081 43.7972C24.4343 43.9291 24.222 44.0005 24.0038 44.0005C23.7855 44.0005 23.5733 43.9291 23.3994 43.7972C23.2255 43.6653 23.0996 43.4802 23.0408 43.27L19.8788 31Z"
                      stroke="#155DFC"
                      stroke-width="2.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M40.0078 6V14"
                      stroke="#155DFC"
                      stroke-width="2.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M44 10H36"
                      stroke="#155DFC"
                      stroke-width="2.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7.99219 34V38"
                      stroke="#155DFC"
                      stroke-width="2.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M10 36H6"
                      stroke="#155DFC"
                      stroke-width="2.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <h4 className="text-[16px] font-bold text-[#101828] text-center leading-[28px] mb-2">
                  Excellence in Practice
                </h4>
                <p className="text-[#364153] text-center text-[14px] sm:text-[18px] font-normal leading-[22px] sm:leading-[26px]">
                  Work with cutting-edge protocols in a refined, professional
                  setting.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                  >
                    <path
                      d="M44.0078 14L27.0078 31L17.0078 21L4.00781 34"
                      stroke="#155DFC"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M31.9922 14H43.9922V26"
                      stroke="#155DFC"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <h4 className="text-[16px]  font-bold text-[#101828] text-center leading-[28px] mb-2">
                  Skill Advancement
                </h4>
                <p className="text-[#364153] text-center text-[14px] sm:text-[18px] font-normal leading-[22px] sm:leading-[26px]">
                  Ongoing training in wellness, performance, and
                  aesthetic-focused care.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                  >
                    <path
                      d="M24.0078 44C35.0535 44 44.0078 35.0457 44.0078 24C44.0078 12.9543 35.0535 4 24.0078 4C12.9621 4 4.00781 12.9543 4.00781 24C4.00781 35.0457 12.9621 44 24.0078 44Z"
                      stroke="#155DFC"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M24 12V24L32 28"
                      stroke="#155DFC"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <h4 className="text-[16px] font-bold text-[#101828] text-center leading-[28px] mb-2">
                  Balanced, Predictable Schedule
                </h4>
                <p className="text-[#364153] text-center text-[14px] sm:text-[18px] font-normal leading-[22px] sm:leading-[26px]">
                  Designed to support your professional and personal life.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                  >
                    <path
                      d="M32.0078 42V38C32.0078 35.8783 31.165 33.8434 29.6647 32.3431C28.1644 30.8429 26.1295 30 24.0078 30H12.0078C9.88608 30 7.85125 30.8429 6.35096 32.3431C4.85067 33.8434 4.00781 35.8783 4.00781 38V42"
                      stroke="#155DFC"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M18.0078 22C22.4261 22 26.0078 18.4183 26.0078 14C26.0078 9.58172 22.4261 6 18.0078 6C13.5895 6 10.0078 9.58172 10.0078 14C10.0078 18.4183 13.5895 22 18.0078 22Z"
                      stroke="#155DFC"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M43.9922 42V38C43.9909 36.2275 43.4009 34.5056 42.3149 33.1046C41.2289 31.7037 39.7084 30.7031 37.9922 30.26"
                      stroke="#155DFC"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M31.9922 6.26001C33.713 6.70061 35.2383 7.70141 36.3275 9.10463C37.4167 10.5078 38.0079 12.2337 38.0079 14.01C38.0079 15.7864 37.4167 17.5122 36.3275 18.9154C35.2383 20.3186 33.713 21.3194 31.9922 21.76"
                      stroke="#155DFC"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <h4 className="text-[16px] font-bold text-[#101828] text-center leading-[28px] mb-2">
                  Elite Team Culture
                </h4>
                <p className="text-[#364153] text-center text-[14px] sm:text-[18px] font-normal leading-[22px] sm:leading-[26px]">
                  Collaborate with highly skilled professionals who value
                  precision, discretion, and quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {!showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="flex flex-col items-center gap-6 sm:gap-6 w-full max-w-[704px] py-8 px-6 sm:py-[56px] sm:px-[48px] rounded-2xl bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] relative">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* SVG Icon Container */}
            <div className="flex w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] justify-center items-center aspect-square rounded-full bg-[#EFF6FF]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 sm:w-16 sm:h-16"
                viewBox="0 0 64 64"
                fill="none"
              >
                <path
                  d="M32.0026 58.6667C46.7302 58.6667 58.6693 46.7276 58.6693 32C58.6693 17.2724 46.7302 5.33337 32.0026 5.33337C17.275 5.33337 5.33594 17.2724 5.33594 32C5.33594 46.7276 17.275 58.6667 32.0026 58.6667Z"
                  stroke="#1D4AA7"
                  strokeWidth="5.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M24 32L29.3333 37.3333L40 26.6666"
                  stroke="#1D4AA7"
                  strokeWidth="5.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h3 className="text-[#101828] text-center text-[24px] sm:text-[36px] font-semibold leading-[38px] sm:leading-[40px]">
              Application Submitted!
            </h3>

            <p className="text-[#364153] text-center md:text-[16px] text-[14px] sm:text-lg font-normal leading-[22px] sm:leading-[28px]">
              Thank you for applying to join our nursing team at Prime Clinics.
              We've received your application and will review it carefully. If
              your skills and experience match our needs, a member of our team
              will contact you shortly.
            </p>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-[#155DFC] text-white py-4 px-[25px] rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationFormPage;
