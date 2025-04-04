function AuthLink({ message, linkText, linkHref }) {
    return (
        <p className="mt-6 text-center text-sm text-neutral-500">
            {message}{' '}
            <a
                href={linkHref}
                className="text-blue-500 hover:underline"
            >
                {linkText}
            </a>
        </p>
    );
}

export default AuthLink;