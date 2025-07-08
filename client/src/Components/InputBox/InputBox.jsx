import React from "react";

export default function InputBox({
  label,
  name,
  type,
  placeholder,
  value,
  onChange = () => {},
  disabled = false,
  className = "",
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label
        htmlFor={name}
        className={`font-[500] text-xl text-purple-600 dark:text-white`}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        className={`bg-transparent rounded-md text-lg font-inter px-3 py-2 border border-gray-300 text-gray-600 dark:text-slate-50 focus:border-[#c65dff]  dark:focus:border-[#c65dff]`}
        onChange={onChange}
        value={value || ""}
        disabled={disabled}
      />
    </div>
  );
}
