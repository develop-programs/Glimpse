import React from "react";

export type ViewType = "grid" | "spotlight" | "sidebar";

interface ViewSelectorProps {
  currentView: ViewType;
  onChange: (view: ViewType) => void;
}

export default function ViewSelector({ currentView, onChange }: ViewSelectorProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-75 rounded-lg p-1.5 z-10 backdrop-blur-sm transition-all duration-300 shadow-lg hover:bg-opacity-90 flex items-center">
      <div className="flex space-x-1">
        <button
          onClick={() => onChange("grid")}
          className={`px-3 py-1.5 rounded flex items-center gap-2 transition-colors duration-200 ${
            currentView === "grid" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          }`}
          title="Grid View"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span className="hidden sm:inline">Grid</span>
        </button>
        <button
          onClick={() => onChange("spotlight")}
          className={`px-3 py-1.5 rounded flex items-center gap-2 transition-colors duration-200 ${
            currentView === "spotlight" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          }`}
          title="Spotlight View"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span className="hidden sm:inline">Spotlight</span>
        </button>
        <button
          onClick={() => onChange("sidebar")}
          className={`px-3 py-1.5 rounded flex items-center gap-2 transition-colors duration-200 ${
            currentView === "sidebar" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          }`}
          title="Sidebar View"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="3" x2="12" y2="21"></line>
            <path d="M3 3h18v18H3z"></path>
          </svg>
          <span className="hidden sm:inline">Sidebar</span>
        </button>
        <div className="w-px h-6 bg-gray-600 mx-1 self-center"></div>
        <button
          onClick={toggleFullscreen}
          className="px-3 py-1.5 rounded bg-gray-700 text-gray-200 hover:bg-gray-600 flex items-center gap-2 transition-colors duration-200"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 14 10 14 10 20"></polyline>
              <polyline points="20 10 14 10 14 4"></polyline>
              <line x1="14" y1="10" x2="21" y2="3"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          )}
          <span className="hidden sm:inline">{isFullscreen ? "Exit" : "Fullscreen"}</span>
        </button>
      </div>
    </div>
  );
}
