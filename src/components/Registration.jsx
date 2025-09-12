import React, { useState } from "react";
import { Shield, Upload, Calendar, MapPin, Phone, Mail, User, Check } from "lucide-react";
import { useUser } from "../UserContext"; // ✅ import context

const Registration = ({ onNavigate }) => {
  const { addUser } = useUser(); // ✅ get addUser from context

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationality: "Indian",
    documentType: "aadhaar",
    documentNumber: "",
    documentFile: null,
    arrivalDate: "",
    departureDate: "",
    entryPoint: "",
    accommodation: "",
    plannedDestinations: [],
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
    trackingConsent: false,
    notificationPrefs: "all",
  });

  const entryPoints = [
    "Lokpriya Gopinath Bordoloi International Airport (Guwahati)",
    "Dimapur Airport",
    "Silchar Airport",
    "Agartala Airport",
    "Imphal Airport",
    "Dawki Border (Meghalaya-Bangladesh)",
    "Moreh Border (Manipur-Myanmar)",
    "Road Entry via Siliguri",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        documentFile: file,
      }));
    }
  };

  // ✅ Updated handleSubmit to use context
  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      ...formData,
      id: `TID-${Date.now()}`, // simple unique ID
      type: "tourist",
    };
    addUser(newUser); // ✅ store in context
    alert("Digital Tourist ID Generated Successfully!");
    onNavigate("landing"); // go back to landing page after registration
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header and Progress Bar (same as before) */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600 mr-4" />
            <h1 className="text-3xl font-bold text-gray-900">
              Digital Tourist ID Registration
            </h1>
          </div>
          <p className="text-gray-600">
            Secure, blockchain-based identity for safe tourism in Northeast India
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= stepNum ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step > stepNum ? <Check className="h-5 w-5" /> : stepNum}
                </div>
                {stepNum < 4 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step > stepNum ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-16">
            <span className="text-sm text-gray-600">Personal Info</span>
            <span className="text-sm text-gray-600">KYC Documents</span>
            <span className="text-sm text-gray-600">Travel Details</span>
            <span className="text-sm text-gray-600">Completion</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
                   {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Personal Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      handleInputChange("email", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      handleInputChange("phone", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* DOB */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Nationality */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nationality
                  </label>
                  <select
                    value={formData.nationality}
                    onChange={(e) =>
                      handleInputChange("nationality", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Indian">Indian</option>
                    <option value="Foreign">Foreign National</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: KYC Documents */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                KYC Documents
              </h2>

              <div className="space-y-6">
                {/* Document Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type
                  </label>
                  <select
                    value={formData.documentType}
                    onChange={(e) =>
                      handleInputChange("documentType", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="aadhaar">Aadhaar Card</option>
                    <option value="passport">Passport</option>
                    <option value="voter">Voter ID</option>
                    <option value="driving">Driving License</option>
                  </select>
                </div>

                {/* Document Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Number
                  </label>
                  <input
                    type="text"
                    value={formData.documentNumber}
                    onChange={(e) =>
                      handleInputChange("documentNumber", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter document number"
                    required
                  />
                </div>

                {/* Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Upload className="h-4 w-4 inline mr-2" />
                    Upload Document (PDF/JPG/PNG)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="document-upload"
                    />
                    <label
                      htmlFor="document-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                      <span className="text-gray-600">
                        {formData.documentFile
                          ? formData.documentFile.name
                          : "Click to upload document"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Travel Details */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Travel Details
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Arrival Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Arrival Date
                  </label>
                  <input
                    type="date"
                    value={formData.arrivalDate}
                    onChange={(e) =>
                      handleInputChange("arrivalDate", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Departure Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Departure Date
                  </label>
                  <input
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) =>
                      handleInputChange("departureDate", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Entry Point */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Entry Point
                  </label>
                  <select
                    value={formData.entryPoint}
                    onChange={(e) =>
                      handleInputChange("entryPoint", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Entry Point</option>
                    {entryPoints.map((point) => (
                      <option key={point} value={point}>
                        {point}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Accommodation */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accommodation Details
                  </label>
                  <input
                    type="text"
                    value={formData.accommodation}
                    onChange={(e) =>
                      handleInputChange("accommodation", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Hotel/Guest House name and address"
                    required
                  />
                </div>

                {/* Planned Destinations */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Planned Destinations
                  </label>

                  {formData.plannedDestinations.length > 0 ? (
                    formData.plannedDestinations.map((dest, index) => (
                      <div
                        key={index}
                        className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50"
                      >
                        <div className="grid md:grid-cols-2 gap-4">
                          {/* City */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              City
                            </label>
                            <input
                              type="text"
                              value={dest.city}
                              onChange={(e) => {
                                const newDests = [
                                  ...formData.plannedDestinations,
                                ];
                                newDests[index].city = e.target.value;
                                handleInputChange("plannedDestinations", newDests);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Eg. Mumbai"
                              required
                            />
                          </div>

                          {/* Location */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Location
                            </label>
                            <input
                              type="text"
                              value={dest.location}
                              onChange={(e) => {
                                const newDests = [
                                  ...formData.plannedDestinations,
                                ];
                                newDests[index].location = e.target.value;
                                handleInputChange("plannedDestinations", newDests);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Eg. Gate Of India"
                              required
                            />
                          </div>

                          {/* Location Type */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Location Type
                            </label>
                            <input
                              type="text"
                              value={dest.type}
                              onChange={(e) => {
                                const newDests = [
                                  ...formData.plannedDestinations,
                                ];
                                newDests[index].type = e.target.value;
                                handleInputChange("plannedDestinations", newDests);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Eg. Heritage Site"
                              required
                            />
                          </div>

                          {/* Time of Visit */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Time of Visit
                            </label>
                            <select
                              value={dest.time}
                              onChange={(e) => {
                                const newDests = [
                                  ...formData.plannedDestinations,
                                ];
                                newDests[index].time = e.target.value;
                                handleInputChange("plannedDestinations", newDests);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              required
                            >
                              <option value="">Select</option>
                              <option value="morning">Morning</option>
                              <option value="afternoon">Afternoon</option>
                              <option value="evening">Evening</option>
                              <option value="night">Night</option>
                            </select>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <div className="mt-3 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              const newDests =
                                formData.plannedDestinations.filter(
                                  (_, i) => i !== index
                                );
                              handleInputChange("plannedDestinations", newDests);
                            }}
                            className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm mb-2">
                      No destinations added yet.
                    </p>
                  )}

                  {/* Add Destination Button */}
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange("plannedDestinations", [
                        ...formData.plannedDestinations,
                        { city: "", location: "", type: "", time: "" },
                      ]);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    + Add Destination
                  </button>
                </div>

                {/* Emergency Contact */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Emergency Contact
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={formData.emergencyName}
                      onChange={(e) =>
                        handleInputChange("emergencyName", e.target.value)
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Name"
                      required
                    />
                    <input
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) =>
                        handleInputChange("emergencyPhone", e.target.value)
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Phone"
                      required
                    />
                    <input
                      type="text"
                      value={formData.emergencyRelation}
                      onChange={(e) =>
                        handleInputChange("emergencyRelation", e.target.value)
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Relation"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Completion */}
          {step === 4 && (
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Registration Complete
              </h2>
              <p className="text-gray-600">
                Please review your information and click submit to generate your
                Digital Tourist ID.
              </p>
            </div>
          )}
          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Back
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Submit & Generate ID
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
