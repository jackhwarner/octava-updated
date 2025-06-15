import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const EMAIL_CONFIRMATION_REQUIRED = true; // Set to true if your Supabase project requires email confirmation

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successEmail, setSuccessEmail] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeTerms) {
      toast({
        variant: "destructive",
        title: "Terms and Conditions",
        description: "You must agree to the terms and conditions to continue."
      });
      return;
    }

    setIsLoading(true);

    try {
      const redirectToUrl = `${window.location.origin}/login`;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectToUrl,
          data: {
            role: accountType
          }
        }
      });

      if (error) throw error;

      setShowSuccess(true);
      setSuccessEmail(email);

      if (!EMAIL_CONFIRMATION_REQUIRED) {
        toast({
          title: "Account created",
          description: "Let's set up your profile."
        });
        navigate("/profile-setup", { state: { role: accountType } });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message || "There was an error creating your account. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/profile-setup`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google signup failed",
        description: error.message
      });
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    // Success state after signup: email confirmation required
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex flex-col justify-center items-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Check your email</CardTitle>
            <CardDescription className="text-center">
              We sent a confirmation link to <span className="font-bold">{successEmail}</span>.<br />
              Please verify your email before logging in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 text-center text-sm text-gray-600">
              Didn’t get the email? Check your spam/junk folder or&nbsp;
              <button
                className="text-purple-600 underline hover:text-purple-700"
                onClick={async () => {
                  setIsLoading(true);
                  const { error } = await supabase.auth.resend({ type: 'signup', email: successEmail });
                  setIsLoading(false);
                  toast({
                    title: error ? "Failed to resend confirmation email" : "Confirmation email resent",
                    description: error?.message || "Please check your inbox.",
                    variant: error ? "destructive" : undefined,
                  });
                }}
                disabled={isLoading}
              >resend it</button>.
            </div>
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => navigate("/login")}
              disabled={isLoading}
            >
              Continue to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex flex-col justify-center items-center p-4">
      <Link to="/" className="flex items-center mb-8">
        <img
          src="/lovable-uploads/octava-large-purple.png"
          alt="Octava Logo"
          className="h-10 mr-2"
        />
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Start your musical journey with Octava
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Must be at least 8 characters long with a number and special character
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="account-type">I am a...</Label>
              <Select value={accountType} onValueChange={setAccountType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your primary role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vocalist">Vocalist</SelectItem>
                  <SelectItem value="producer">Producer</SelectItem>
                  <SelectItem value="instrumentalist">Instrumentalist</SelectItem>
                  <SelectItem value="songwriter">Songwriter</SelectItem>
                  <SelectItem value="composer">Composer</SelectItem>
                  <SelectItem value="engineer">Engineer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked === true)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link to="/terms" className="text-purple-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-purple-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>

          <Button
            variant="outline"
            type="button"
            className="w-full"
            onClick={handleGoogleSignup}
            disabled={isLoading}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Sign up with Google
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-gray-500 w-full">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 hover:underline font-medium">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>

      <p className="mt-6 text-center text-xs text-gray-500 max-w-md">
        By signing up, you'll start with a 7-day free trial of Octava Pro. After the trial ends, you'll be charged
        $9.99/month unless you cancel before the trial period.
      </p>
    </div>
  );
};

export default Signup;
