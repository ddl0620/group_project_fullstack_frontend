function Footer() {
    return (
        <footer className="bg-neutral-950 text-neutral-300 py-12 px-4 border-t border-neutral-800">
            <div className="max-w-screen-xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Company Information */}
                    <div className="text-left">
                        <h3 className="text-xl font-semibold mb-4 text-white">5Knights</h3>
                        <p className="text-sm mb-2">Leading event management application developer</p>
                        <p className="text-sm">Delivering exceptional event organization experiences</p>
                    </div>
                    
                    {/* Contact Information */}
                    <div className="text-left">
                        <h3 className="text-xl font-semibold mb-4 text-white">Contact</h3>
                        <p className="text-sm mb-2"><span className="font-medium">Representative:</span> John Smith</p>
                        <p className="text-sm mb-2"><span className="font-medium">Phone:</span> (084) 123 456 789</p>
                        <p className="text-sm mb-2"><span className="font-medium">Hotline:</span> 1900 1234</p>
                        <p className="text-sm"><span className="font-medium">Email:</span> contact@5knights.com</p>
                    </div>
                    
                    {/* Address */}
                    <div className="text-left">
                        <h3 className="text-xl font-semibold mb-4 text-white">Address</h3>
                        <p className="text-sm mb-2">15th Floor, Innovation Building</p>
                        <p className="text-sm mb-2">123 Nguyen Hue Street</p>
                        <p className="text-sm mb-2">District 1, Ho Chi Minh City</p>
                        <p className="text-sm">Vietnam</p>
                    </div>
                </div>
                
                {/* Copyright */}
                <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
                    <p className="text-sm md:text-base tracking-wide font-light">
                        &copy; 2025 Event Management App by 5Knights. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
