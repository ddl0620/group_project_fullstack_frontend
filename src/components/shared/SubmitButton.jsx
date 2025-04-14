function Button({ onClick, children, className }) {
    return (
        <button
            onClick={onClick}
            className={`hover:scale-105 flex items-center px-3 gap-1 justify-center w-fit rounded-3xl py-2 text-sm font-medium transition hover:cursor-pointer ${className}`}
        >
            {children}
        </button>
    );
}

export default Button;