/* eslint-disable react/prop-types */
import React, { useId } from "react";

const Input = React.forwardRef(function Input(
  { label, type = "text", className = "", ...props },
  ref
) {
  const id = useId();
  return (
    <div className="w-full text-textColor text-sm flex flex-col">
      {label && (
        <label className="mb-1 inline-block text-gray-300" htmlFor={id}>
          {label}
        </label>
      )}

      <input
        type={type}
        className={`mb-4 rounded-lg border bg-transparent px-3 py-2 ${className}`}
        ref={ref}
        {...props}
        id={id}
      />
    </div>
  );
});

export default Input;
