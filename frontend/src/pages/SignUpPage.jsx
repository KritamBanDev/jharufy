import { useState } from "react";
import { ShipWheelIcon, UserIcon, MailIcon, LockIcon } from "lucide-react";
import { Link } from "react-router-dom";
import useSignUp from "../hooks/useSignUp";
import Input from "../components/Input";
import Button from "../components/Button";
import { validateForm, FORM_RULES } from "../utils/errorHandler";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const { isPending, signupMutation } = useSignUp();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    
    console.log("Attempting signup with data:", signupData);
    
    // Validate form
    const validation = validateForm(signupData, {
      ...FORM_RULES,
      confirmPassword: { required: true, label: "Confirm Password" }
    });
    
    // Check password confirmation
    if (signupData.password !== signupData.confirmPassword) {
      validation.errors.confirmPassword = "Passwords do not match";
      validation.isValid = false;
    }
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    // Clear errors and submit
    setErrors({});
    signupMutation(signupData);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-2 sm:p-4"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-6xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden h-[95vh] max-h-[800px]">
        {/* SIGNUP FORM - LEFT SIDE */}
        <div className="w-full lg:w-1/2 p-3 sm:p-6 flex flex-col justify-center">
          {/* LOGO */}
          <div className="mb-3 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-8 text-primary" />
            <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Jharufy
            </span>
          </div>

          <div className="w-full flex-1 flex flex-col justify-center">
            <form onSubmit={handleSignup} className="space-y-3">
              <div className="space-y-2">
                <div>
                  <h2 className="text-lg font-semibold">Create an Account</h2>
                  <p className="text-xs opacity-70">
                    Join Jharufy and start your language learning adventure!
                  </p>
                </div>

                <div className="space-y-2">
                  {/* FULLNAME */}
                  <Input
                    label="Full Name"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={signupData.fullName}
                    onChange={handleInputChange}
                    error={errors.fullName}
                    required
                    icon={UserIcon}
                  />
                  
                  {/* EMAIL */}
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="john@gmail.com"
                    value={signupData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    required
                    icon={MailIcon}
                  />

                  {/* PASSWORD */}
                  <Input
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={signupData.password}
                    onChange={handleInputChange}
                    error={errors.password}
                    required
                    icon={LockIcon}
                  />

                  {/* CONFIRM PASSWORD */}
                  {/* CONFIRM PASSWORD */}
                  <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={signupData.confirmPassword}
                    onChange={handleInputChange}
                    error={errors.confirmPassword}
                    required
                    icon={LockIcon}
                  />

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2 py-1">
                      <input type="checkbox" className="checkbox checkbox-sm" required />
                      <span className="text-xs leading-tight">
                        I agree to the{" "}
                        <span className="text-primary hover:underline cursor-pointer">terms of service</span> and{" "}
                        <span className="text-primary hover:underline cursor-pointer">privacy policy</span>
                      </span>
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={isPending}
                  className="w-full mt-2"
                >
                  Create Account
                </Button>

                <div className="text-center mt-2">
                  <p className="text-xs">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* IMAGE SECTION */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-sm p-6">
            {/* Illustration */}
            <div className="relative aspect-square max-w-xs mx-auto">
              <img src="/i.png" alt="Language connection illustration" className="w-full h-full object-contain" />
            </div>

            <div className="text-center space-y-2 mt-4">
              <h2 className="text-lg font-semibold">Join a global community of learners</h2>
              <p className="opacity-70 text-sm">
                Create your account and start connecting with language partners from around the world
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;