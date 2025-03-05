'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutContextProps {
  isOpen: boolean;
  toggleDrawer: () => void;
  setContent: (content: ReactNode) => void;
  content: ReactNode;
}

const LayoutContext = createContext<LayoutContextProps | undefined>(undefined);

export const DrawerProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);

  const toggleDrawer = () => setIsOpen((prev) => !prev);

  return (
    <LayoutContext.Provider
      value={{ isOpen, toggleDrawer, setContent, content }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useDrawer = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
};
