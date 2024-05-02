"use client";

import { useState } from "react";
import { Check } from "react-feather";

const Checkbox: React.FC<any> = ({ ...props }) => {
  const [checked, setChecked] = useState<boolean>(false);

  const checkedColor = checked ? "bg-blue-400" : "bg-blue-800";
  const hoverColor = checked ? "bg-blue-800" : "bg-blue-600";

  return (
    <div
      className={`flex items-center justify-center relative w-8 h-8 rounded-2xl ${checkedColor} hover:${hoverColor}`}
    >
      {checked && <Check className="absolute" />}
      <input
        type="checkbox"
        className="absolute w-full h-full opacity-0 m-0 cursor-pointer"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        {...props}
      />
    </div>
  );
};

export { Checkbox };
