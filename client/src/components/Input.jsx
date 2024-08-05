import React, { useId } from "react";
import { PropTypes } from "prop-types";
const Input = React.forwardRef(function Input(
  { label, type = "text", className = "", name, ...props },
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
