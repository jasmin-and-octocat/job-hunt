"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authApi, EmployerProfileData } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/context/auth-context";

// Form validation schema
const employerProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNnumber: z.string().optional(),
  designation: z.string().optional(),
  linkedin: z.string().optional(),
});

type EmployerProfileFormValues = z.infer<typeof employerProfileSchema>;

interface EmployerProfileFormProps {
  user: any;
  onNext: () => void;
  onBack: () => void;
}

export const EmployerProfileForm = ({ user, onNext, onBack }: EmployerProfileFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { setOnboardingComplete } = useAuth();

  // Initialize form with default values
  const form = useForm<EmployerProfileFormValues>({
    resolver: zodResolver(employerProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: user?.email || "",
      phoneNnumber: "",
      designation: "",
      linkedin: "",
    },
  });

  const onSubmit = async (values: EmployerProfileFormValues) => {
    setIsSubmitting(true);
    try {
      // User ID is passed as a normal number, the API will handle the formatting
      const profileData: EmployerProfileData = {
        ...values,
        users_permissions_user: user.id,
      };

      const response = await authApi.createEmployerProfile(profileData);
      
      // Update the user object with the new profile data
      if (response.data) {
        user.employer_profile = response.data;
      }
      
      toast({
        title: "Profile created",
        description: "Your employer profile has been created successfully.",
      });
      
      onNext();
    } catch (error: any) {
      console.error("Error creating employer profile:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to create your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email*</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phoneNnumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter your phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="designation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title / Designation</FormLabel>
              <FormControl>
                <Input placeholder="e.g. HR Manager, Recruiter, CEO" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="linkedin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn Profile</FormLabel>
              <FormControl>
                <Input placeholder="LinkedIn profile URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Continue"}
          </Button>
        </div>
      </form>
    </Form>
  );
};