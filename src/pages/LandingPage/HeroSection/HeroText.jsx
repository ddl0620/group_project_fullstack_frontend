// import { Link } from 'react-router-dom' // Commented out as requested

const HeroText = ({ title, subtitle, primaryLink, secondaryLink }) => {
  return (
    <div className="w-full text-center md:w-1/2 md:text-left">
      <h1 className="mb-2 text-5xl font-semibold tracking-tight text-gray-900 md:text-6xl lg:text-7xl">{title}</h1>
      <h2 className="mb-6 text-6xl font-semibold tracking-tight text-[#0071e3] md:text-7xl lg:text-8xl">EventApp</h2>
      <p className="mb-8 text-lg leading-relaxed text-gray-600 md:pr-8">{subtitle}</p>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        {/* Using regular <a> tags instead of Link for now */}
        <a
          href={primaryLink.to}
          className="rounded-full bg-[#0071e3] px-8 py-3 text-center text-sm font-medium text-white shadow-lg transition-all hover:bg-[#0077ed] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:ring-offset-2"
          // Replace with Link when ready
          // <Link to={primaryLink.to} className="...">
        >
          {primaryLink.text}
        </a>
        <a
          href={secondaryLink.to}
          className="rounded-full border border-gray-300 bg-white px-8 py-3 text-center text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          // Replace with Link when ready
          // <Link to={secondaryLink.to} className="...">
        >
          {secondaryLink.text}
        </a>
      </div>
    </div>
  )
}

export default HeroText
