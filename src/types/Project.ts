export interface Project {
  id?: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface ProjectsState {
  projects: Project[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
