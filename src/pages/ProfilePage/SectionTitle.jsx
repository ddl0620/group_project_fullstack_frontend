function SectionTitle({ title, subtitle }) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-sm text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    );
  }
  
  export default SectionTitle;