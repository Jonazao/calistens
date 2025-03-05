'use client';
import { useDrawer } from '../providers/DrawerContext';

const RightAsideDrawer = () => {
  const { isOpen, toggleDrawer, content } = useDrawer();

  return (
    <div
      className={`fixed right-0 top-0 w-80 bg-gray-800 h-full transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <button onClick={toggleDrawer} className="p-4 text-white">
        Close
      </button>
      <div className="p-4 text-white">{content}</div>
    </div>
  );
};

export default RightAsideDrawer;
