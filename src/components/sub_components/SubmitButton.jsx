function Button({ onClick, children, className }) {
    return (
        <button
            onClick={onClick}
            className={`w-full rounded-2xl py-2 text-sm font-medium transition hover:cursor-pointer ${className}`}
        >
            {children}
        </button>
    );
}

export default Button;