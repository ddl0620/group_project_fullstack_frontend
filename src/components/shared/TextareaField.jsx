function TextareaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
}) {
  return (
    <div className="mb-0">
      <label className="mb-1 block text-sm text-neutral-600">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full rounded-xl border border-neutral-300 px-4 py-2 text-sm transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder={placeholder}
      ></textarea>
    </div>
  );
}

export default TextareaField;
