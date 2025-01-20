import React, { PropsWithChildren } from 'react';

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-gradient-to-r from-slate-300 to-indigo-200 h-screen flex items-center justify-center">
      {children}
    </div>
  );
};

export default AuthLayout;
