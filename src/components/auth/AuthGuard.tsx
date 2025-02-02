import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { profile } = useProfile();

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}