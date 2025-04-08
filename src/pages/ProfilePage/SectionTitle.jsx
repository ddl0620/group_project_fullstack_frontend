function SectionTitle({ title, subtitle }) {
    return (
        <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
                <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-600">
                    {subtitle}
                </p>
            )}
        </div>
    );
}

export default SectionTitle;
