function TextInputField({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  icon,
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-neutral-700"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {icon}
          </div>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`block w-full ${icon ? 'pl-10' : 'pl-3'} rounded-lg border border-neutral-300 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500`}
          required
        />
      </div>
    </div>
  );
}

export default TextInputField;
