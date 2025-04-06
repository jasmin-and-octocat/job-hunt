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
const experienceSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  title: z.string().min(1, "Job title is required"),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isCurrentPosition: z.boolean().default(false),
  description: z.string().optional(),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

interface ExperienceFormProps {
  user: any;
  onNext: () => void;
  onBack: () => void;
}

export const ExperienceForm = ({ user, onNext, onBack }: ExperienceFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [isAddMode, setIsAddMode] = useState(true);
  const { toast } = useToast();

  // Initialize form with default values
  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: "",
      title: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrentPosition: false,
      description: "",
    },
  });

  const onSubmit = async (values: ExperienceFormValues) => {
    setIsSubmitting(true);
    try {
      // Get the job seeker profile ID from user
      // In a real app, you would need to fetch this if not available
      const profileId = user.job_seeker_profile?.id;
      
      if (!profileId) {
        throw new Error("Profile not found. Please complete your basic profile first.");
      }
      
      // Format the experience data
      const experienceData = {
        ...values,
        endDate: values.isCurrentPosition ? null : values.endDate,
        job_seeker_profile: profileId
      };
      
      // Add experience to the user's profile
      await userApi.addExperience(profileId, experienceData);
      
      // Add to local state
      setExperiences([...experiences, { id: Date.now(), ...values }]);
      
      // Reset form
      form.reset({
        company: "",
        title: "",
        location: "",
        startDate: "",
        endDate: "",
        isCurrentPosition: false,
        description: "",
      });
      
      toast({
        title: "Experience added",
        description: "Your work experience has been added to your profile.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add experience. Please try again.",
        variant: "destructive",
      });
      console.error("Error adding experience:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (form.getValues("isCurrentPosition")) {
      e.preventDefault();
      return;
    }
  };

  const handleDelete = (index: number) => {
    const newExperiences = [...experiences];
    newExperiences.splice(index, 1);
    setExperiences(newExperiences);
  };

  const handleContinue = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Display existing experiences */}
      {experiences.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Your Work Experience</h3>
          {experiences.map((exp, index) => (
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
                <div className="font-medium">{exp.title}</div>
                <div>{exp.company}</div>
                <div className="text-sm text-muted-foreground">
                  {exp.startDate} - {exp.isCurrentPosition ? "Present" : exp.endDate}
                </div>
                {exp.location && (
                  <div className="text-sm text-muted-foreground">{exp.location}</div>
                )}
                {exp.description && <div className="text-sm mt-2">{exp.description}</div>}
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
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company*</FormLabel>
                  <FormControl>
                    <Input placeholder="Company or organization name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title*</FormLabel>
                  <FormControl>
                    <Input placeholder="Your job title or position" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="City, Country or Remote" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        disabled={form.watch("isCurrentPosition")}
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
              name="isCurrentPosition"
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
                      I currently work here
                    </FormLabel>
                  </div>
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
                      placeholder="Describe your responsibilities, achievements, and skills used in this role"
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
                {isSubmitting ? "Adding..." : "Add Experience"}
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
          <Plus className="mr-2 h-4 w-4" /> Add Experience
        </Button>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={handleContinue}>
          {experiences.length === 0 ? "Skip" : "Continue"}
        </Button>
      </div>

      <div className="text-sm text-muted-foreground text-center pt-2">
        You can always add or edit your work experience later from your profile.
      </div>
    </div>
  );
};