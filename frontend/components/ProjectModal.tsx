import React, { useState, useEffect } from 'react';
import { Project, Student } from '../types';
import { generateStudyGuide, explainCommand } from '../services/geminiService';
import Markdown from 'react-markdown';

interface ProjectModalProps {
  project: Project;
  student: Student;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, student, onClose }) => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'ai'>('terminal');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [aiContent, setAiContent] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [commandExplanation, setCommandExplanation] = useState<string>('');

  // Generate dynamic URL based on current website location
  // Assuming files are in public/downloads/ folder
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://codevault.edu';
  const downloadUrl = `${baseUrl}/downloads/${project.zipFileName}`;
  
  // Construct the CURL command
  // Simplified: Removed the fake ?key= parameter as requested since it's a public folder
  const generatedCommand = `curl -L -o ${project.zipFileName} "${downloadUrl}"`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCommand);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  useEffect(() => {
    // Explain the command when modal opens (lightweight AI call)
    const fetchExplanation = async () => {
        const explanation = await explainCommand(generatedCommand);
        setCommandExplanation(explanation);
    };
    fetchExplanation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStudyGuide = async () => {
    if (aiContent) return; // Don't refetch if already loaded
    setIsLoadingAi(true);
    const guide = await generateStudyGuide(project);
    setAiContent(guide);
    setIsLoadingAi(false);
  };

  // Fetch study guide when switching to AI tab
  useEffect(() => {
    if (activeTab === 'ai') {
      fetchStudyGuide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-terminal-bg w-full max-w-4xl max-h-[90vh] rounded-xl border border-terminal-border shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-terminal-border bg-terminal-header">
          <h3 className="text-xl font-bold text-white font-mono">
            {project.title} <span className="text-gray-500 text-sm ml-2">[{project.language}]</span>
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-terminal-border bg-terminal-header/50">
          <button 
            onClick={() => setActiveTab('terminal')}
            className={`px-6 py-3 text-sm font-medium font-mono transition-colors ${activeTab === 'terminal' ? 'text-terminal-green border-b-2 border-terminal-green bg-terminal-bg' : 'text-gray-400 hover:text-gray-200'}`}
          >
            &gt;_ TERMINAL
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`px-6 py-3 text-sm font-medium font-mono transition-colors flex items-center gap-2 ${activeTab === 'ai' ? 'text-terminal-blue border-b-2 border-terminal-blue bg-terminal-bg' : 'text-gray-400 hover:text-gray-200'}`}
          >
             <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6a1 1 0 0 0-1 1v3.5a.5.5 0 0 1-.5.5H7a1 1 0 0 0 0 2h3.5a.5.5 0 0 1 .5.5V17a1 1 0 0 0 2 0v-3.5a.5.5 0 0 1 .5-.5H17a1 1 0 0 0 0-2h-3.5a.5.5 0 0 1-.5-.5V7a1 1 0 0 0-1-1z"/></svg>
             AI TUTOR
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          
          {/* TERMINAL TAB */}
          {activeTab === 'terminal' && (
            <div className="space-y-6">
              <div>
                <p className="text-gray-300 mb-4 text-sm">
                  Use the command below to download the source code directly to your machine via terminal.
                </p>
                <div className="bg-black rounded-lg border border-terminal-border p-4 font-mono text-sm relative group">
                   <div className="flex items-start gap-2 text-gray-300 break-all">
                      <span className="text-terminal-green select-none">$</span>
                      <span className="flex-1">{generatedCommand}</span>
                   </div>
                   
                   <button 
                    onClick={handleCopy}
                    className="absolute top-2 right-2 bg-terminal-border hover:bg-gray-700 text-xs text-white px-2 py-1 rounded transition-colors"
                   >
                     {copyFeedback ? 'COPIED!' : 'COPY'}
                   </button>
                </div>
                {commandExplanation && (
                    <p className="mt-2 text-xs text-gray-500 font-mono">
                        * {commandExplanation}
                    </p>
                )}
              </div>

              <div className="bg-terminal-header p-4 rounded border border-terminal-border">
                <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Or Download Manually</h4>
                <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Direct zip file download</span>
                    <a 
                        href={downloadUrl}
                        download
                        className="bg-terminal-green/10 hover:bg-terminal-green/20 text-terminal-green border border-terminal-green/50 px-4 py-2 rounded text-sm font-mono transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        {project.zipFileName}
                    </a>
                </div>
              </div>

              <div className="border-t border-terminal-border pt-4">
                <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">File Structure Preview</h4>
                <pre className="text-xs text-gray-400 font-mono bg-terminal-header/50 p-4 rounded overflow-x-auto">
                  {project.fileStructure}
                </pre>
              </div>
            </div>
          )}

          {/* AI TAB */}
          {activeTab === 'ai' && (
            <div className="min-h-[300px]">
              {isLoadingAi ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4 text-terminal-blue">
                  <div className="w-8 h-8 border-2 border-terminal-blue border-t-transparent rounded-full animate-spin"></div>
                  <p className="font-mono text-sm animate-pulse">Analysing source code structure...</p>
                </div>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none font-sans">
                   <div className="bg-terminal-blue/10 border-l-4 border-terminal-blue p-4 mb-6">
                     <p className="text-terminal-blue text-sm font-bold m-0">
                        AI Generated Study Guide
                     </p>
                     <p className="text-gray-400 text-xs mt-1 m-0">
                        Generated based on file structure and project metadata.
                     </p>
                   </div>
                   <Markdown
                     components={{
                       code(props) {
                         const {children, className, node, ...rest} = props
                         return (
                           <code {...rest} className={`${className} bg-gray-800 px-1 py-0.5 rounded text-terminal-green font-mono`}>
                             {children}
                           </code>
                         )
                       },
                       h1: ({node, ...props}) => <h1 className="text-xl font-bold text-white mt-6 mb-4 border-b border-gray-700 pb-2" {...props} />,
                       h2: ({node, ...props}) => <h2 className="text-lg font-bold text-white mt-5 mb-3" {...props} />,
                       h3: ({node, ...props}) => <h3 className="text-base font-bold text-terminal-blue mt-4 mb-2" {...props} />,
                       p: ({node, ...props}) => <p className="text-gray-300 leading-relaxed mb-4" {...props} />,
                       ul: ({node, ...props}) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1" {...props} />,
                       li: ({node, ...props}) => <li className="ml-4" {...props} />,
                     }}
                   >
                     {aiContent}
                   </Markdown>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};