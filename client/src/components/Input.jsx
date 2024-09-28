import React, { useId } from "react";
import PropTypes from "prop-types";
const Input = React.forwardRef(function Input(
  { label, type = "text", className = "", name, ...props },
  ref
) {
  const id = useId();
  return (
    <div className="w-full text-sm flex flex-col">
      {label && (
        <label
          htmlFor="desc"
          className="mb-2 inline-block text-sm font-medium text-gray-300"
        >
          {label} <sup className="text-red-500">*</sup>
        </label>
      )}

      <input
        type={type}
        className={`mb-4 rounded-lg bg-transparent px-3 py-2 w-full border border-gray-600 text-white placeholder-gray-400 outline-none focus:border-[#ae7aff] focus:ring-2 focus:ring-[#ae7aff] ${className}`}
        ref={ref}
        {...props}
        id={id}
        name={name}
      />
    </div>
  );
});

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string,
};

export default Input;
