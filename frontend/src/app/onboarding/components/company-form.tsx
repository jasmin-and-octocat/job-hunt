"use client";
import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authApi, CompanyData } from "@/lib/auth";
import { industryApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/context/auth-context";

// Form validation schema
const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  description: z.string().optional(),
  website: z.string().optional(),
  location: z.string().optional(),
  size: z.string().optional(),
  foundedYear: z.string()
    .optional()
    .transform((val) => val ? parseInt(val, 10) : undefined),
  companyType: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  phoneNumber: z.string().optional(),
  industry: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

interface CompanyFormProps {
  user: any;
  onNext: () => void;
  onBack: () => void;
}

export const CompanyForm = ({ user, onNext, onBack }: CompanyFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [industries, setIndustries] = useState<any[]>([]);
  const [isLoadingIndustries, setIsLoadingIndustries] = useState(true);
  const { toast } = useToast();
  const { setOnboardingComplete } = useAuth();

  // Initialize form with default values
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      location: "",
      size: "",
      foundedYear: "",
      companyType: "",
      email: "",
      phoneNumber: "",
      industry: "",
    },
  });

  // Fetch industries on mount
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await industryApi.getIndustries();
        setIndustries(response.data || []);
      } catch (error) {
        console.error("Error fetching industries:", error);
        toast({
          title: "Error",
          description: "Failed to fetch industries. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingIndustries(false);
      }
    };
    fetchIndustries();
  }, [toast]);

  const onSubmit = async (values: CompanyFormValues) => {
    setIsSubmitting(true);
    try {
      // The industry ID is passed as a number, our API function will handle formatting for Strapi
      const companyData: CompanyData = {
        ...values,
        description: values.description 
          ? { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: values.description }] }] } 
          : undefined,
        industry: values.industry ? parseInt(values.industry, 10) : undefined,
      };

      const response = await authApi.createCompany(companyData);
      
      toast({
        title: "Company created",
        description: "Your company profile has been created successfully.",
      });
      
      onNext();
    } catch (error: any) {
      console.error("Error creating company profile:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to create your company profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const companySizeOptions = [
    { value: "one_to_ten", label: "1-10 employees" },
    { value: "eleven_to_fifty", label: "11-50 employees" },
    { value: "fifty_one_to_two_hundred", label: "51-200 employees" },
    { value: "two_hundred_one_to_five_hundred", label: "201-500 employees" },
    { value: "five_hundred_one_to_one_thousand", label: "501-1,000 employees" },
    { value: "one_thousand_one_to_five_thousand", label: "1,001-5,000 employees" },
    { value: "five_thousand_above", label: "5,000+ employees" },
  ];

  const companyTypeOptions = [
    { value: "public", label: "Public Company" },
    { value: "private", label: "Private Company" },
    { value: "non-profit", label: "Non-Profit Organization" },
    { value: "government", label: "Government" },
    { value: "startup", label: "Startup" },
    { value: "other", label: "Other" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter company name" {...field} />
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
              <FormLabel>Company Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your company"
                  className="min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingIndustries ? (
                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : (
                      industries.map((industry) => (
                        <SelectItem key={industry.id} value={industry.id.toString()}>
                          {industry.attributes.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
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
                <FormLabel>Company Location</FormLabel>
                <FormControl>
                  <Input placeholder="City, Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Size</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      {companySizeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="foundedYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Founded Year</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Year company was founded" 
                    min={1800}
                    max={new Date().getFullYear()}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="companyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Type</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company type" />
                    </SelectTrigger>
                    <SelectContent>
                      {companyTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Email</FormLabel>
                <FormControl>
                  <Input placeholder="contact@company.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Company phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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