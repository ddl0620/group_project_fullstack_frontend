function Button({ onClick, children, className }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-fit items-center justify-center gap-1 rounded-3xl px-3 py-2 text-sm font-medium transition hover:scale-105 hover:cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
