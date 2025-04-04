function Button({ onClick, children, className }) {
    return (
        <button
            onClick={onClick}
            className={`w-full rounded-xl py-2 text-sm font-medium transition ${className}`}
        >
            {children}
        </button>
    );
}

export default Button;