import { useState, useRef, useEffect } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { onboard } from "../lib/api";
import { CameraIcon, LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon, ArrowLeftIcon, UploadIcon, XIcon } from "lucide-react";
import { LANGUAGES } from "../constants";
import useAuthNavigation from "../hooks/useAuthNavigation";
import useAuthStore from "../store/useAuthStore";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { generateRandomAvatar, generateProfessionalAvatar, generateFunAvatar, getProfilePicture } from '../utils/avatarUtils';

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const { navigateToHome } = useAuthNavigation();
  const { setUser } = useAuthStore();
  const fileInputRef = useRef(null);

  // Check if user is already onboarded (editing mode vs first-time onboarding)
  const isEditingProfile = authUser?.isOnboarded;

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  // State for file upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: onboard,
    onSuccess: (data) => {
      console.log("✅ PROFILE UPDATE SUCCESS:", data);
      
      if (isEditingProfile) {
        toast.success("Profile updated successfully!");
      } else {
        toast.success("Profile onboarded successfully!");
      }
      
      // Update both React Query cache and Zustand store
      queryClient.setQueryData(["authUser"], data);
      setUser(data.user);
      
      // Navigate based on context
      if (isEditingProfile) {
        // If editing, stay on the page or navigate back to where they came from
        console.log("📝 Profile updated, staying on page");
      } else {
        // If first-time onboarding, navigate to home
        console.log("🏠 Navigating to home page after first onboarding");
        navigateToHome();
      }
    },

    onError: (error) => {
      console.error("Profile update error:", error);
      
      // Handle different error scenarios
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to complete onboarding. Please try again.");
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formState.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!formState.nativeLanguage) {
      toast.error("Please select your native language");
      return;
    }

    if (!formState.learningLanguage) {
      toast.error("Please select the language you're learning");
      return;
    }

    if (formState.nativeLanguage === formState.learningLanguage) {
      toast.error("Your native language and learning language cannot be the same");
      return;
    }

    let finalFormData = { ...formState };

    // Handle file upload if a file is selected
    if (selectedFile) {
      setIsUploading(true);
      try {
        const uploadedUrl = await uploadFile(selectedFile);
        finalFormData.profilePic = uploadedUrl;
        
        // Invalidate auth user query to refresh the profile picture
        await queryClient.invalidateQueries({ queryKey: ["authUser"] });
        
        toast.success("Profile picture uploaded successfully!");
      } catch (uploadError) {
        console.error('File upload error:', uploadError);
        setIsUploading(false);
        toast.error("Failed to upload profile picture. Please try again.");
        return;
      }
      setIsUploading(false);
    }

    onboardingMutation(finalFormData);
  };

  // Avatar generation functions
  const handleRandomAvatar = () => {
    const randomAvatar = generateRandomAvatar();
    console.log('🎲 Generated random avatar:', randomAvatar);
    
    // Clear any file uploads first
    setSelectedFile(null);
    setFilePreview(null);
    
    // Set the new random avatar
    setFormState(prev => ({ ...prev, profilePic: randomAvatar }));
    
    toast.success("Random avatar generated!");
  };

  const handleProfessionalAvatar = () => {
    const professionalAvatar = generateProfessionalAvatar();
    console.log('💼 Generated professional avatar:', professionalAvatar);
    
    // Clear any file uploads first
    setSelectedFile(null);
    setFilePreview(null);
    
    // Set the new professional avatar
    setFormState(prev => ({ ...prev, profilePic: professionalAvatar }));
    
    toast.success("Professional avatar generated!");
  };

  const handleFunAvatar = () => {
    const funAvatar = generateFunAvatar();
    console.log('😄 Generated fun avatar:', funAvatar);
    
    // Clear any file uploads first
    setSelectedFile(null);
    setFilePreview(null);
    
    // Set the new fun avatar
    setFormState(prev => ({ ...prev, profilePic: funAvatar }));
    
    toast.success("Fun avatar generated!");
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // No file size limit - let the backend handle it

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreview(e.target.result);
      // Clear random avatar URL when file is selected
      setFormState({ ...formState, profilePic: "" });
    };
    reader.readAsDataURL(file);
  };

  // Handle file upload
  const uploadFile = async (file) => {
    console.log('🚀 Starting file upload...', file.name);
    
    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      console.log('📤 Making upload request to /api/upload/profile-pic');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/upload/profile-pic`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies for auth
      });

      console.log('📥 Upload response status:', response.status);
      console.log('📥 Upload response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Upload failed - Response:', errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Upload success - Data:', data);
      
      // Invalidate auth user cache to refresh profile picture in navbar
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      
      return data.url; // Assuming the API returns { url: "uploaded-file-url" }
    } catch (error) {
      console.error('❌ File upload error:', error);
      throw new Error('Failed to upload image');
    }
  };

  // Remove selected file
  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Debug: Log form state changes
  useEffect(() => {
    console.log('📊 Form state updated:', {
      profilePic: formState.profilePic,
      filePreview: filePreview ? 'has file preview' : 'no file preview'
    });
  }, [formState.profilePic, filePreview]);

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          {/* Dynamic header based on onboarding status */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">
              {isEditingProfile ? "Edit Your Profile" : "Complete Your Profile"}
            </h1>
            <p className="text-sm opacity-70 mt-2">
              {isEditingProfile 
                ? "Update your information and preferences anytime" 
                : "Tell us about yourself to get the best language learning experience"
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PROFILE PIC CONTAINER */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* IMAGE PREVIEW */}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden relative group">
                {filePreview || formState.profilePic ? (
                  <>
                    <img
                      src={filePreview || formState.profilePic || getProfilePicture(authUser)}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                      onLoad={() => console.log('🖼️ Image loaded:', filePreview || formState.profilePic)}
                      onError={(e) => {
                        console.log('❌ Image failed to load:', e.target.src);
                        // Fallback to default avatar if image fails to load
                        e.target.src = getProfilePicture(authUser);
                      }}
                    />
                    {(filePreview || formState.profilePic) && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (filePreview) {
                              removeSelectedFile();
                            } else {
                              setFormState({ ...formState, profilePic: "" });
                            }
                          }}
                          className="btn btn-sm btn-error btn-circle"
                        >
                          <XIcon className="size-4" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              {/* AVATAR GENERATION BUTTONS */}
              <div className="flex flex-col items-center gap-3 w-full max-w-md">
                {/* File Upload Button */}
                <div className="relative w-full">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="profile-pic-upload"
                  />
                  <label
                    htmlFor="profile-pic-upload"
                    className="btn btn-primary btn-sm w-full cursor-pointer flex items-center gap-2"
                  >
                    <UploadIcon className="size-4" />
                    Upload Custom Photo
                  </label>
                </div>

                {/* Avatar Style Options */}
                <div className="divider text-xs opacity-60">OR GENERATE AVATAR</div>
                
                <div className="grid grid-cols-3 gap-2 w-full">
                  {/* Random Avatar */}
                  <Button
                    type="button"
                    onClick={handleRandomAvatar}
                    variant="accent"
                    className="btn-sm text-xs"
                  >
                    🎲 Random
                  </Button>

                  {/* Professional Avatar */}
                  <Button
                    type="button"
                    onClick={handleProfessionalAvatar}
                    variant="secondary"
                    className="btn-sm text-xs"
                  >
                    💼 Professional
                  </Button>

                  {/* Fun Avatar */}
                  <Button
                    type="button"
                    onClick={handleFunAvatar}
                    variant="success"
                    className="btn-sm text-xs"
                  >
                    😄 Fun
                  </Button>
                </div>
              </div>

              {/* Selected file info */}
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-base-content opacity-70">
                  <span>Selected: {selectedFile.name}</span>
                  <button
                    type="button"
                    onClick={removeSelectedFile}
                    className="btn btn-ghost btn-xs btn-circle"
                  >
                    <XIcon className="size-3" />
                  </button>
                </div>
              )}

              {/* File upload guidelines */}
              <p className="text-xs text-center text-base-content opacity-60 max-w-xs">
                Upload your own photo or choose from our curated avatar styles
              </p>
            </div>

            {/* FULL NAME */}
            <Input
              type="text"
              label="Full Name"
              name="fullName"
              value={formState.fullName}
              onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
              placeholder="Your full name"
              required
            />

            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="textarea border border-base-300 h-24 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>

            {/* LANGUAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NATIVE LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language *</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                  className="select border border-base-300 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* LEARNING LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language *</span>
                </label>
                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                  className="select border border-base-300 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Select language you're learning</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="input w-full pl-10 border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              variant="primary"
              isLoading={isPending || isUploading}
              loadingText={
                isUploading 
                  ? "Uploading image..." 
                  : isPending 
                    ? (isEditingProfile ? "Updating profile..." : "Completing onboarding...")
                    : ""
              }
              disabled={isPending || isUploading}
              className="w-full"
              icon={!isPending && !isUploading ? ShipWheelIcon : undefined}
            >
              {isEditingProfile ? "Update Profile" : "Complete Onboarding"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default OnboardingPage;