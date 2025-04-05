function TextareaField({ label, name, value, onChange, placeholder, rows = 4 }) {
    return (
      <div className="mb-0">
        <label className="block text-sm text-neutral-600 mb-1">{label}</label>
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          className="w-full rounded-xl border border-neutral-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder={placeholder}
        ></textarea>
      </div>
    );
  }
  
  export default TextareaField;