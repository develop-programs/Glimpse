import React from "react";
import { ViewType } from "./ViewSelector";

interface AnimatedViewContainerProps {
  children: React.ReactNode;
  currentView: ViewType;
}

export default function AnimatedViewContainer({ children, currentView }: AnimatedViewContainerProps) {
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [displayedView, setDisplayedView] = React.useState(currentView);
  const [previousChildren, setPreviousChildren] = React.useState<React.ReactNode>(null);

  React.useEffect(() => {
    if (currentView !== displayedView) {
      setIsTransitioning(true);
      setPreviousChildren(children);
      
      // After a short delay, update to the new view
      const timer = setTimeout(() => {
        setDisplayedView(currentView);
        setIsTransitioning(false);
      }, 350); // Match this with the CSS transition duration
      
      return () => clearTimeout(timer);
    }
  }, [currentView, displayedView, children]);

  return (
    <div className="w-full h-full relative">
      {isTransitioning && (
        <div 
          className="absolute inset-0 transition-all duration-350 ease-in-out transform" 
          style={{ 
            opacity: 0,
            transform: 'scale(0.95)'
          }}
        >
          {previousChildren}
        </div>
      )}
      
      <div 
        className="absolute inset-0 transition-all duration-350 ease-in-out transform"
        style={{ 
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? 'scale(1.05)' : 'scale(1)'
        }}
      >
        {children}
      </div>
    </div>
  );
}
