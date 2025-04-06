"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, X, ChevronsUpDown, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { skillsApi } from "@/lib/api";
import { userApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

interface SkillsFormProps {
  user: any;
  onNext: () => void;
  onBack: () => void;
}

// Helper function to normalize skill data no matter what the structure is
const normalizeSkill = (skill: any) => {
  // If it's already in the expected format, return it
  if (skill && skill.attributes && skill.attributes.name) {
    return skill;
  }
  
  // If it's a newly created skill and has a different structure
  if (skill && skill.name) {
    return {
      id: skill.id,
      attributes: { name: skill.name }
    };
  }
  
  // As a fallback, create a structure that won't break the component
  return {
    id: skill?.id || Math.random().toString(36),
    attributes: {
      name: skill?.name || "Unknown Skill"
    }
  };
};

// Helper function to get skill name safely
const getSkillName = (skill: any) => {
  if (skill?.attributes?.name) {
    return skill.attributes.name;
  }
  return skill?.name || "Unknown Skill";
};

export const SkillsForm = ({ user, onNext, onBack }: SkillsFormProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);
  const [skills, setSkills] = useState<any[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  // Fetch skills on mount
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await skillsApi.getSkills({ pageSize: 100 });
        setSkills(response.data || []);
      } catch (error) {
        console.error("Error fetching skills:", error);
        toast({
          title: "Error",
          description: "Failed to fetch skills. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSkills();
  }, [toast]);

  const handleSelectSkill = (skill: any) => {
    // Normalize the skill before using it
    const normalizedSkill = normalizeSkill(skill);
    
    // Check if skill is already selected
    if (selectedSkills.some(s => s.id === normalizedSkill.id)) {
      setSelectedSkills(selectedSkills.filter(s => s.id !== normalizedSkill.id));
    } else {
      setSelectedSkills([...selectedSkills, normalizedSkill]);
    }
    setOpen(false);
  };

  const handleRemoveSkill = (skillId: number | string) => {
    setSelectedSkills(selectedSkills.filter(skill => skill.id !== skillId));
  };

  // Handle creating a new skill
  const handleCreateSkill = async () => {
    if (!search.trim()) return;
    
    setIsCreatingSkill(true);
    try {
      // Create a new skill using our API
      const newSkillData = await skillsApi.createSkill({
        name: search.trim(),
        slug: search.trim().toLowerCase().replace(/\s+/g, '-')
      });
      
      // Make sure the new skill is in the expected format
      const newSkill = normalizeSkill(newSkillData.data);
      
      // Add the new skill to our skills list
      setSkills([...skills, newSkill]);
      
      // Select the newly created skill
      setSelectedSkills([...selectedSkills, newSkill]);
      
      // Clear search
      setSearch("");
      setOpen(false);
      
      toast({
        title: "Skill created",
        description: `"${search.trim()}" has been added to your skills.`,
      });
    } catch (error) {
      console.error("Error creating skill:", error);
      toast({
        title: "Error",
        description: "Failed to create skill. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingSkill(false);
    }
  };

  const handleSubmit = async () => {
    if (selectedSkills.length === 0) {
      toast({
        title: "No skills selected",
        description: "Please select at least one skill to continue.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // Get the job seeker profile ID from user
      const profileId = user.job_seeker_profile?.id;
      
      if (!profileId) {
        throw new Error("Profile not found. Please complete your basic profile first.");
      }
      // Update the profile with selected skills
      await userApi.updateUserProfile(profileId, {
        skills: selectedSkills.map(skill => skill.id)
      });
      
      toast({
        title: "Skills updated",
        description: "Your skills have been added to your profile.",
      });
      
      onNext();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update your skills. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating skills:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSkills = search
    ? skills.filter(skill => {
        const skillName = getSkillName(skill);
        return skillName.toLowerCase().includes(search.toLowerCase());
      })
    : skills;
    
  // Check if there's a search term but no matching skills
  const noMatchingSkills = search.trim().length > 0 && filteredSkills.length === 0;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Select skills that represent your expertise. These skills will help employers find you for relevant job opportunities.
        </div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
              disabled={isLoading}
            >
              {isLoading ? "Loading skills..." : "Search and select skills"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput 
                placeholder="Search skills..." 
                value={search}
                onValueChange={setSearch}
              />
              <CommandList>
                <CommandEmpty>
                  {noMatchingSkills ? (
                    <div className="py-3 px-2">
                      <p className="text-sm text-muted-foreground mb-2">
                        No skills found. Create "{search.trim()}"?
                      </p>
                      <Button 
                        size="sm"
                        className="w-full"
                        onClick={handleCreateSkill}
                        disabled={isCreatingSkill}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {isCreatingSkill ? "Creating..." : "Create New Skill"}
                      </Button>
                    </div>
                  ) : (
                    "No skills found."
                  )}
                </CommandEmpty>
                <CommandGroup heading="Available Skills">
                  {filteredSkills.map((skill) => {
                    const skillName = getSkillName(skill);
                    return (
                      <CommandItem
                        key={skill.id}
                        value={skillName}
                        onSelect={() => handleSelectSkill(skill)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedSkills.some(s => s.id === skill.id) 
                              ? "opacity-100" 
                              : "opacity-0"
                          )}
                        />
                        {skillName}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Selected Skills ({selectedSkills.length}):</h4>
          <div className="flex flex-wrap gap-2">
            {selectedSkills.length === 0 ? (
              <div className="text-sm text-muted-foreground">No skills selected yet</div>
            ) : (
              selectedSkills.map((skill) => (
                <Badge key={skill.id} className="pl-2 pr-1 py-1">
                  {getSkillName(skill)}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 ml-1"
                    onClick={() => handleRemoveSkill(skill.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting || selectedSkills.length === 0}>
          {isSubmitting ? "Saving..." : "Continue"}
        </Button>
      </div>
      <div className="text-sm text-muted-foreground text-center">
        You can always update your skills later from your profile.
      </div>
    </div>
  );
};