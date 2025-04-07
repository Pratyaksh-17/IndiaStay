import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Form schema for registration
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
});

// Form schema for login
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional()
});

type RegisterFormValues = z.infer<typeof registerSchema>;
type LoginFormValues = z.infer<typeof loginSchema>;

const AuthPage = () => {
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      acceptTerms: false
    }
  });
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });
  
  // Handle register submission
  const onRegisterSubmit = (data: RegisterFormValues) => {
    const { name, email, password } = data;
    registerMutation.mutate({ name, email, password }, {
      onSuccess: () => {
        setLocation("/");
      }
    });
  };
  
  // Handle login submission
  const onLoginSubmit = (data: LoginFormValues) => {
    const { email, password } = data;
    loginMutation.mutate({ email, password }, {
      onSuccess: () => {
        setLocation("/");
      }
    });
  };
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);
  
  // If already logged in, don't render the auth page
  if (user) {
    return null;
  }
  
  return (
    <>
      <Helmet>
        <title>Login or Sign Up - IndiaStay</title>
        <meta name="description" content="Login to your IndiaStay account or create a new account to book hotels across India." />
      </Helmet>
      
      <div className="pt-24 md:pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row overflow-hidden bg-white rounded-lg shadow-xl">
            {/* Left side - Auth forms */}
            <div className="lg:w-1/2 p-6 md:p-10">
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold mb-2">Welcome to IndiaStay</h1>
                <p className="text-neutral-600">Book your perfect stay across India</p>
              </div>
              
              <Tabs 
                defaultValue="login" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your email" 
                                type="email" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex justify-between items-center">
                              <FormLabel>Password</FormLabel>
                              <a href="#" className="text-primary text-sm">Forgot Password?</a>
                            </div>
                            <FormControl>
                              <Input 
                                placeholder="Enter your password" 
                                type="password" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="rememberMe"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange} 
                              />
                            </FormControl>
                            <Label htmlFor="rememberMe" className="text-sm font-normal">
                              Remember me
                            </Label>
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <LoadingSpinner size="sm" className="mr-2" />
                        ) : null}
                        Login
                      </Button>
                    </form>
                  </Form>
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-neutral-600">
                      Don't have an account? {" "}
                      <button 
                        className="text-primary font-semibold hover:underline"
                        onClick={() => setActiveTab("register")}
                      >
                        Sign up
                      </button>
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your full name" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your email" 
                                type="email" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Create a password" 
                                type="password" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="acceptTerms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange} 
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <Label htmlFor="acceptTerms" className="text-sm font-normal">
                                I agree to the <a href="#" className="text-primary">Terms & Conditions</a> and <a href="#" className="text-primary">Privacy Policy</a>
                              </Label>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? (
                          <LoadingSpinner size="sm" className="mr-2" />
                        ) : null}
                        Sign Up
                      </Button>
                    </form>
                  </Form>
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-neutral-600">
                      Already have an account? {" "}
                      <button 
                        className="text-primary font-semibold hover:underline"
                        onClick={() => setActiveTab("login")}
                      >
                        Login
                      </button>
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Right side - Hero image */}
            <div 
              className="hidden lg:block lg:w-1/2 bg-cover bg-center" 
              style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')" 
              }}
            >
              <div className="h-full w-full bg-black bg-opacity-30 p-12 flex flex-col justify-end">
                <div className="text-white mb-8">
                  <h2 className="text-3xl font-bold mb-4">Experience Incredible India</h2>
                  <p className="text-lg">
                    From the majestic Himalayas to the tropical beaches of Kerala, 
                    book your perfect stay with IndiaStay and experience the rich 
                    diversity of India.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
