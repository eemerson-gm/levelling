import React from "react";

const Menu: React.FC<{ title?: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div className="border-solid border-4 rounded-md border-blue-400 bg-black">
      <div className="m-4">
        <h1 className="text-2xl">{title}</h1>
      </div>
      <div className="m-4">
        <div>{children}</div>
      </div>
    </div>
  );
};

export { Menu };
