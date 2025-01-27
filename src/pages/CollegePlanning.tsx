import { useState } from "react";
import DashboardHeader from "@/components/college-planning/DashboardHeader";
import StatisticsCards from "@/components/college-planning/StatisticsCards";
import DashboardTabs from "@/components/college-planning/DashboardTabs";
import CounselorView from "@/components/college-planning/CounselorView";
import { useTodos } from "@/hooks/useTodos";
import { useProfile } from "@/hooks/useProfile";

interface Course {
  id: string;
  name: string;
  grade: string;
  semester: string;
}

interface ActivityType {
  id: string;
  name: string;
  role: string;
  description: string;
  timeCommitment: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

export default function CollegePlanning() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const { todos } = useTodos();
  const { profile } = useProfile();

  const getTodoStats = () => {
    const completed = todos.filter(todo => todo.completed).length;
    const starred = todos.filter(todo => todo.starred).length;
    const total = todos.length;
    return { completed, starred, total };
  };

  if (profile?.user_type === 'counselor') {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <DashboardHeader />
        <CounselorView />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <DashboardHeader />
      <StatisticsCards 
        courses={courses}
        activities={activities}
        notes={notes}
        todoStats={getTodoStats()}
      />
      <DashboardTabs
        courses={courses}
        onCoursesChange={setCourses}
        onActivitiesChange={setActivities}
        onNotesChange={setNotes}
      />
    </div>
  );
}