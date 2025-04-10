import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ProjectsState, Project } from "../../types/Project";
import config from "@/config/config";

const initialState: ProjectsState = {
  projects: [],
  status: "idle",
  error: null,
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async () => {
    const response = await axios.get(`${config.API_URL}/projects`);
    return response.data;
  }
);

export const addProject = createAsyncThunk(
  "projects/addProject",
  async (newProject: Project) => {
    const response = await axios.post(`${config.API_URL}/projects`, newProject);
    return response.data;
  }
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async (updatedProject: Project) => {
    const response = await axios.put(
      `${config.API_URL}/projects/${updatedProject.id}`,
      updatedProject
    );
    return response.data;
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (projectId: string) => {
    await axios.delete(`${config.API_URL}/projects/${projectId}`);
    return projectId;
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(
          (project) => project.id === action.payload.id
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(
          (project) => project.id !== action.payload
        );
      });
  },
});

export default projectsSlice.reducer;
