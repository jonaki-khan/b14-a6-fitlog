"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { Workout } from "@/types/workout";
import toast from "react-hot-toast";

interface FitLogContextType {
  plan: Workout[];
  saved: Workout[];
  addToPlan: (workout: Workout) => void;
  removeFromPlan: (id: number) => void;
  saveWorkout: (workout: Workout) => void;
  removeSaved: (id: number) => void;
  markAsDone: (id: number) => void;
  isInPlan: (id: number) => boolean;
  isSaved: (id: number) => boolean;
}

const FitLogContext = createContext<
  FitLogContextType | undefined
>(undefined);

export function FitLogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [plan, setPlan] = useState<Workout[]>([]);
  const [saved, setSaved] = useState<Workout[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const storedPlan = localStorage.getItem("fitlog-plan");
    const storedSaved = localStorage.getItem("fitlog-saved");

    if (storedPlan) {
      try {
        setPlan(JSON.parse(storedPlan));
      } catch {
        setPlan([]);
      }
    }

    if (storedSaved) {
      try {
        setSaved(JSON.parse(storedSaved));
      } catch {
        setSaved([]);
      }
    }

    setHydrated(true);
  }, []);

  // Save plan to localStorage
  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      "fitlog-plan",
      JSON.stringify(plan)
    );
  }, [plan, hydrated]);

  // Save saved workouts to localStorage
  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      "fitlog-saved",
      JSON.stringify(saved)
    );
  }, [saved, hydrated]);

  // Add workout to plan
  const addToPlan = (workout: Workout) => {
    if (plan.length >= 5) {
      toast.error(
        "Today's plan can contain only 5 workouts"
      );
      return;
    }

    if (plan.some((item) => item.id === workout.id)) {
      toast.error(
        "Workout is already in today's plan"
      );
      return;
    }

    setPlan((currentPlan) => [
      ...currentPlan,
      workout,
    ]);

    toast.success("Added to today's plan");
  };

  // Remove workout from plan
  const removeFromPlan = (id: number) => {
    setPlan((currentPlan) =>
      currentPlan.filter(
        (item) => item.id !== id
      )
    );

    toast.success("Workout removed from plan");
  };

  // Save workout
  const saveWorkout = (workout: Workout) => {
    if (saved.some((item) => item.id === workout.id)) {
      toast.error("Workout is already saved");
      return;
    }

    setSaved((currentSaved) => [
      ...currentSaved,
      workout,
    ]);

    toast.success("Workout saved for later");
  };

  // Remove saved workout
  const removeSaved = (id: number) => {
    setSaved((currentSaved) =>
      currentSaved.filter(
        (item) => item.id !== id
      )
    );

    toast.success("Removed from saved");
  };

  // Mark workout as done
  const markAsDone = (id: number) => {
    setPlan((currentPlan) =>
      currentPlan.filter(
        (item) => item.id !== id
      )
    );

    toast.success("Workout marked as done");
  };

  // Check if workout is in plan
  const isInPlan = (id: number) => {
    return plan.some(
      (item) => item.id === id
    );
  };

  // Check if workout is saved
  const isSaved = (id: number) => {
    return saved.some(
      (item) => item.id === id
    );
  };

  return (
    <FitLogContext.Provider
      value={{
        plan,
        saved,
        addToPlan,
        removeFromPlan,
        saveWorkout,
        removeSaved,
        markAsDone,
        isInPlan,
        isSaved,
      }}
    >
      {children}
    </FitLogContext.Provider>
  );
}

export function useFitLog() {
  const context = useContext(FitLogContext);

  if (!context) {
    throw new Error(
      "useFitLog must be used inside FitLogProvider"
    );
  }

  return context;
}