function Button({ onClick, children, className }) {
    return (
        <button
            onClick={onClick}
            className={`w-full lg:w-auto md:w-auto p-3 rounded-2xl py-2 text-sm font-medium transition hover:cursor-pointer ${className}`}
        >
            {children}
        </button>
    );
}




export default Button;