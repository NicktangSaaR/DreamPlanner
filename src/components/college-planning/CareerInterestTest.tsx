import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Book, ChartBar, Info } from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { ChartContainer, ChartLegend, ChartTooltip } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

const HOLLAND_QUESTIONS = [
  {
    category: "R",
    question: "I like to work with tools and machines",
  },
  {
    category: "I",
    question: "I enjoy solving complex problems",
  },
  {
    category: "A",
    question: "I like to be creative and express myself",
  },
  {
    category: "S",
    question: "I enjoy helping and teaching others",
  },
  {
    category: "E",
    question: "I like to lead and persuade others",
  },
  {
    category: "C",
    question: "I prefer following clear procedures and rules",
  },
];

const CATEGORIES = {
  R: "Realistic",
  I: "Investigative",
  A: "Artistic",
  S: "Social",
  E: "Enterprising",
  C: "Conventional",
};

export default function CareerInterestTest() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (Object.keys(answers).length < HOLLAND_QUESTIONS.length) {
      toast.error("Please answer all questions");
      return;
    }

    setIsSubmitting(true);
    try {
      const results = {
        completedAt: new Date().toISOString(),
        scores: answers,
        primaryType: Object.entries(answers)
          .sort(([, a], [, b]) => b - a)[0][0],
      };

      await updateProfile.mutateAsync({
        career_interest_test: results,
      });

      toast.success("Career Interest Test completed!");
      navigate("/student-profile");
    } catch (error) {
      console.error("Error saving test results:", error);
      toast.error("Failed to save test results");
    } finally {
      setIsSubmitting(false);
    }
  };

  const chartData = Object.entries(profile?.career_interest_test?.scores || {}).map(
    ([category, score]) => ({
      category: CATEGORIES[category as keyof typeof CATEGORIES],
      score,
      fill: "#4F46E5",
    })
  );

  if (profile?.career_interest_test) {
    const { completedAt, scores, primaryType } = profile.career_interest_test;
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Career Interest Test Results
          </CardTitle>
          <Button
            variant="outline"
            onClick={() => updateProfile.mutateAsync({ career_interest_test: null })}
          >
            Retake Test
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Completed on {new Date(completedAt).toLocaleDateString()}
            </span>
          </div>
          <div className="space-y-4">
            <Label>Your Primary Type: {CATEGORIES[primaryType as keyof typeof CATEGORIES]}</Label>
            <div className="h-[300px] w-full">
              <ChartContainer
                className="w-full"
                config={{
                  score: {
                    theme: {
                      light: "#4F46E5",
                      dark: "#818CF8",
                    },
                  },
                }}
              >
                <BarChart data={chartData}>
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 5]} />
                  <Bar dataKey="score" />
                  <ChartTooltip />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="h-5 w-5" />
          Holland Career Interest Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Rate how much you agree with each statement on a scale of 1-5
        </p>
        {HOLLAND_QUESTIONS.map((q, index) => (
          <div key={index} className="space-y-2">
            <Label>{q.question}</Label>
            <RadioGroup
              onValueChange={(value) =>
                setAnswers((prev) => ({ ...prev, [q.category]: parseInt(value) }))
              }
              value={answers[q.category]?.toString()}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={value.toString()} id={`q${index}-${value}`} />
                  <Label htmlFor={`q${index}-${value}`}>{value}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Complete Test"}
        </Button>
      </CardContent>
    </Card>
  );
}