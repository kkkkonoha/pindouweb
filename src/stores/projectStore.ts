import { create } from 'zustand';
import type { Project, PixelData, WizardStep, InputType } from '../types';

interface ProjectState {
  project: Project | null;
  wizardStep: WizardStep;
  inputType: InputType | null;
  history: PixelData[][][];
  historyIndex: number;

  setProject: (project: Project) => void;
  updatePixels: (pixels: PixelData[][]) => void;
  setWizardStep: (step: WizardStep) => void;
  setInputType: (type: InputType | null) => void;
  undo: () => void;
  redo: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: null,
  wizardStep: 'input',
  inputType: null,
  history: [],
  historyIndex: -1,

  setProject: (project) => set({ project, history: [project.pixels], historyIndex: 0 }),

  updatePixels: (pixels) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(pixels);

    set((state) => ({
      project: state.project ? { ...state.project, pixels, updatedAt: new Date() } : null,
      history: newHistory,
      historyIndex: newHistory.length - 1
    }));
  },

  setWizardStep: (step) => set({ wizardStep: step }),

  setInputType: (type) => set({ inputType: type }),

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set((state) => ({
        project: state.project ? { ...state.project, pixels: history[newIndex] } : null,
        historyIndex: newIndex
      }));
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set((state) => ({
        project: state.project ? { ...state.project, pixels: history[newIndex] } : null,
        historyIndex: newIndex
      }));
    }
  }
}));
