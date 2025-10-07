const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <img
                  src="/Main_Logo.png"
                  alt="Otaku World Logo"
                  className="w-12 h-12 object-contain mr-3"
                />
                <div>
                  <h3 className="text-2xl font-bold text-white">Otaku_World</h3>
                  <p className="text-sm text-gray-400">
                    Anime Discovery Portal
                  </p>
                </div>
              </div>
              <p className="text-gray-400 text-center lg:text-left leading-relaxed max-w-md mx-auto lg:mx-0">
                🎌 Your ultimate destination for anime discovery and tracking.
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-center lg:text-left">
              <h4 className="text-lg font-semibold text-white mb-6">
                Quick Links
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 py-1"
                >
                  About Us
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 py-1"
                >
                  Contact
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 py-1"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 py-1"
                >
                  Terms of Service
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="text-center lg:text-left">
              <h4 className="text-lg font-semibold text-white mb-6">
                Follow Us
              </h4>
              <div className="flex justify-center lg:justify-start space-x-6">
                <a
                  href="https://github.com/bhashitm2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-all duration-300 transform hover:scale-110"
                  aria-label="GitHub"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-col items-center space-y-2">
            <p className="text-gray-400 text-sm">
              © {currentYear} Otaku_World. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              Created with ❤️ by Bhashit Maheshwari
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
