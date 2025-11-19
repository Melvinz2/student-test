import React, { useState } from 'react';
import { Student, Project } from '../types';
import { MOCK_PROJECTS } from '../constants';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';

interface DashboardProps {
  student: Student;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ student, onLogout }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text font-sans">
      {/* Navbar */}
      <nav className="border-b border-terminal-border bg-terminal-header sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
                <span className="text-terminal-green font-mono text-xl font-bold">./CodeVault</span>
                <span className="hidden md:inline text-gray-600 text-sm">| Student Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">{student.name}</p>
                <p className="text-xs text-gray-500 font-mono">ID: {student.id}</p>
              </div>
              <button 
                onClick={onLogout}
                className="text-sm text-red-400 hover:text-red-300 font-mono border border-red-900 bg-red-900/20 px-3 py-1 rounded transition-colors"
              >
                LOGOUT
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Available Projects</h2>
            <p className="text-gray-400">Select a project to view details, access CLI commands, or get AI study assistance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PROJECTS.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onSelect={setSelectedProject} 
            />
          ))}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-terminal-border mt-12 py-8">
          <div className="text-center text-gray-600 text-sm font-mono">
              &copy; 2024 CodeVault Education System. All rights reserved.
          </div>
      </footer>

      {/* Detail Modal */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          student={student}
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </div>
  );
};
