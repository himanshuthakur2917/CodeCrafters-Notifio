"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { signup, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const fullName = `${formData.firstName} ${formData.lastName}`;
      await signup(formData.email, formData.password, fullName);
      router.push('/');
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="shadow-input mx-auto w-full max-w-md rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-blue-500/20 p-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
          Create Your Account
        </h2>
        <p className="mt-2 max-w-sm text-sm text-cyan-300/70">
          Join Notifio and never miss an important moment
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <LabelInputContainer>
              <Label htmlFor="firstName" className="text-cyan-300">First name</Label>
              <Input 
                id="firstName" 
                placeholder="John" 
                type="text" 
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="bg-slate-800/50 border-blue-500/20 text-white placeholder:text-gray-400 focus:border-cyan-400"
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastName" className="text-cyan-300">Last name</Label>
              <Input 
                id="lastName" 
                placeholder="Doe" 
                type="text" 
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="bg-slate-800/50 border-blue-500/20 text-white placeholder:text-gray-400 focus:border-cyan-400"
              />
            </LabelInputContainer>
          </div>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email" className="text-cyan-300">Email Address</Label>
            <Input 
              id="email" 
              placeholder="john@example.com" 
              type="email" 
              value={formData.email}
              onChange={handleInputChange}
              required
              className="bg-slate-800/50 border-blue-500/20 text-white placeholder:text-gray-400 focus:border-cyan-400"
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-8">
            <Label htmlFor="password" className="text-cyan-300">Password</Label>
            <Input 
              id="password" 
              placeholder="••••••••" 
              type="password" 
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={8}
              className="bg-slate-800/50 border-blue-500/20 text-white placeholder:text-gray-400 focus:border-cyan-400"
            />
          </LabelInputContainer>

          <button
            className="group/btn relative block h-12 w-full rounded-md bg-gradient-to-br from-blue-600 to-cyan-600 font-medium text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
            <BottomGradient />
          </button>

          <div className="my-6 h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

          <div className="text-center">
            <p className="text-sm text-cyan-300/70">
              Already have an account?{' '}
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
