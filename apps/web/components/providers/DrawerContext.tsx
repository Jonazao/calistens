'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface DrawerContextProps {
  isOpen: boolean;
  toggleDrawer: () => void;
  setContent: (content: ReactNode) => void;
  content: ReactNode;
}

const DrawerContext = createContext<DrawerContextProps | undefined>(undefined);

export const DrawerProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);

  const toggleDrawer = () => setIsOpen((prev) => !prev);

  return (
    <DrawerContext.Provider
      value={{ isOpen, toggleDrawer, setContent, content }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
};
