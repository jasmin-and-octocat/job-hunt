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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { userApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { X, Plus } from "lucide-react";

// Form validation schema
const educationSchema = z.object({
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree/certificate is required"),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isCurrentEducation: z.boolean().default(false),
  description: z.string().optional(),
  grade: z.string().optional(),
});

type EducationFormValues = z.infer<typeof educationSchema>;

interface EducationFormProps {
  user: any;
  onNext: () => void;
  onBack: () => void;
}

export const EducationForm = ({ user, onNext, onBack }: EducationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [educations, setEducations] = useState<any[]>([]);
  const [isAddMode, setIsAddMode] = useState(true);
  const { toast } = useToast();

  // Initialize form with default values
  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      isCurrentEducation: false,
      description: "",
      grade: "",
    },
  });

  const onSubmit = async (values: EducationFormValues) => {
    setIsSubmitting(true);
    try {
      // Get the job seeker profile ID from user
      // In a real app, you would need to fetch this if not available
      const profileId = user.job_seeker_profile?.id;
      
      if (!profileId) {
        throw new Error("Profile not found. Please complete your basic profile first.");
      }
      
      // Format the education data
      const educationData = {
        ...values,
        endDate: values.isCurrentEducation ? null : values.endDate,
        job_seeker_profile: profileId
      };
      
      // Add education to the user's profile
      await userApi.addEducation(profileId, educationData);
      
      // Add to local state
      setEducations([...educations, { id: Date.now(), ...values }]);
      
      // Reset form
      form.reset({
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        isCurrentEducation: false,
        description: "",
        grade: "",
      });
      
      toast({
        title: "Education added",
        description: "Your education has been added to your profile.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add education. Please try again.",
        variant: "destructive",
      });
      console.error("Error adding education:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (form.getValues("isCurrentEducation")) {
      e.preventDefault();
      return;
    }
  };

  const handleDelete = (index: number) => {
    const newEducations = [...educations];
    newEducations.splice(index, 1);
    setEducations(newEducations);
  };

  const handleContinue = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Display existing educations */}
      {educations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Your Education</h3>
          {educations.map((edu, index) => (
            <Card key={index} className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => handleDelete(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              <CardContent className="p-4">
                <div className="font-medium">{edu.degree}</div>
                <div>{edu.institution}</div>
                <div className="text-sm text-muted-foreground">
                  {edu.startDate} - {edu.isCurrentEducation ? "Present" : edu.endDate}
                </div>
                {edu.description && <div className="text-sm mt-2">{edu.description}</div>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isAddMode ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution*</FormLabel>
                  <FormControl>
                    <Input placeholder="University, School or Institution name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree/Certificate*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Bachelor's, Master's, Certificate" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fieldOfStudy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field of Study</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date*</FormLabel>
                    <FormControl>
                      <Input type="month" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="month" 
                        disabled={form.watch("isCurrentEducation")}
                        {...field}
                        onChange={(e) => {
                          handleEndDateChange(e);
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isCurrentEducation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I am currently studying here
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade/GPA</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 3.8/4.0, First Class" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Activities, achievements or coursework"
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-4">
              <Button type="submit" disabled={isSubmitting} variant="secondary">
                {isSubmitting ? "Adding..." : "Add Education"}
              </Button>
              <Button type="button" onClick={handleContinue}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <Button 
          onClick={() => setIsAddMode(true)}
          className="w-full"
          variant="outline"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Education
        </Button>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={handleContinue}>
          {educations.length === 0 ? "Skip" : "Continue"}
        </Button>
      </div>

      <div className="text-sm text-muted-foreground text-center pt-2">
        You can always add or edit your education later from your profile.
      </div>
    </div>
  );
};