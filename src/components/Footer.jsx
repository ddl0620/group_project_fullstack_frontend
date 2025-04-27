function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 px-4 py-12 text-neutral-300">
      <div className="mx-auto max-w-screen-xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Company Information */}
          <div className="text-left">
            <h3 className="mb-4 text-xl font-semibold text-white">5Knights</h3>
            <p className="mb-2 text-sm">
              Leading event management application developer
            </p>
            <p className="text-sm">
              Delivering exceptional event organization experiences
            </p>
          </div>

          {/* Contact Information */}
          <div className="text-left">
            <h3 className="mb-4 text-xl font-semibold text-white">Contact</h3>
            <p className="mb-2 text-sm">
              <span className="font-medium">Representative:</span> Dr. Tri Dang
            </p>
            <p className="mb-2 text-sm">
              <span className="font-medium">Phone:</span> (084) 123 456 789
            </p>
            <p className="mb-2 text-sm">
              <span className="font-medium">Hotline:</span> 1900 1234
            </p>
            <p className="text-sm">
              <span className="font-medium">Email:</span> contact@5knights.com
            </p>
          </div>

          {/* Address */}
          <div className="text-left">
            <h3 className="mb-4 text-xl font-semibold text-white">Address</h3>
            <p className="mb-2 text-sm">521 Kim Ma, Handiresco Building</p>
            <p className="mb-2 text-sm">123 Nguyen Hue Street</p>
            <p className="mb-2 text-sm">Ba Dinh, Ha Noi</p>
            <p className="text-sm">Vietnam</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-neutral-800 pt-6 text-center">
          <p className="text-sm font-light tracking-wide md:text-base">
            &copy; 2025 Event Management App by 5Knights. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
