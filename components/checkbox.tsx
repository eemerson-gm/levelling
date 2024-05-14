"use client";

import React from "react";
import { DetailedHTMLProps, InputHTMLAttributes, useState } from "react";
import { Star } from "react-feather";

interface CheckboxProps {
  defaultChecked: boolean;
}

const Checkbox: React.FC<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
    CheckboxProps
> = ({ onChange, defaultChecked, checked: overrideCheck, ...props }) => {
  const [checked, setChecked] = useState<boolean>(defaultChecked);

  const checkedColor = checked ? "bg-blue-400" : "bg-blue-800";
  const hoverColor = checked ? "bg-blue-800" : "bg-blue-600";

  return (
    <div
      className={`flex items-center justify-center relative w-8 h-8 rounded-2xl ${checkedColor} hover:${hoverColor}`}
    >
      {checked && <Star className="absolute" />}
      <input
        type="checkbox"
        className="absolute w-full h-full opacity-0 m-0 cursor-pointer"
        checked={overrideCheck || checked}
        onChange={(e) => {
          if (e.target.checked) {
            setChecked(true);
            if (onChange) onChange(e);
          }
        }}
        {...props}
      />
    </div>
  );
};

export { Checkbox };
