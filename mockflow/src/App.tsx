import React from 'react';
import { useStore } from './store';
import { TutorialEngine } from './engine/TutorialEngine';
import { LearningMap } from './components/LearningMap';
import { Workbench } from './components/Workbench';
import { AppWorkspace } from './components/AppWorkspace';

export default function App() {
  const { currentView } = useStore();

  return (
    <div className="h-screen overflow-hidden">
      {currentView === 'learning-map' && <LearningMap />}
      {currentView === 'workbench' && <Workbench />}
      {currentView === 'workspace' && <AppWorkspace />}
      <TutorialEngine />
    </div>
  );
}
