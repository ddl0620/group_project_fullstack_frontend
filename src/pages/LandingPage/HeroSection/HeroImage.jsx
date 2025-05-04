const HeroImage = ({ imageSrc, altText }) => {
  return (
    <div className="relative">
      {/* Apple-style floating effect */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#0071e3]/20 to-[#6c56f5]/20 opacity-70 blur"></div>
      <div className="relative overflow-hidden rounded-2xl bg-white/80 p-2 shadow-xl backdrop-blur-sm">
        <img src={imageSrc || "/placeholder.svg"} alt={altText} className="h-auto w-full rounded-xl object-cover" />
      </div>
    </div>
  )
}

export default HeroImage
