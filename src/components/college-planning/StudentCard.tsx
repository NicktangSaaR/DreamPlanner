import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, School, BookOpen, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { StudentProfile } from "./types/student-management";

interface StudentCardProps {
  student: StudentProfile;
}

export default function StudentCard({ student }: StudentCardProps) {
  const navigate = useNavigate();
  const [applicationYear, setApplicationYear] = useState<string>(student.application_year || '');

  const handleViewDashboard = () => {
    console.log("Navigating to student dashboard:", student.id);
    window.location.href = `/college-planning/student/${student.id}`;
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear + i).toString());

  const handleYearChange = async (year: string) => {
    try {
      console.log("Updating application year for student:", student.id, "to year:", year);
      
      const { error } = await supabase
        .from('profiles')
        .update({ application_year: year })
        .eq('id', student.id);

      if (error) throw error;

      setApplicationYear(year);
      toast.success("Application year updated successfully");
    } catch (error) {
      console.error("Error updating application year:", error);
      toast.error("Failed to update application year");
    }
  };

  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{student.full_name}</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={applicationYear} onValueChange={handleYearChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="default" onClick={handleViewDashboard}>
              View Dashboard
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Grade: {student.grade || 'Not set'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <School className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              School: {student.school || 'Not set'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Interested in: {student.interested_majors?.join(', ') || 'Not set'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}