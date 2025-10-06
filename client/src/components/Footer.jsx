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
                  href="#"
                  className="group p-3 bg-gray-800 rounded-full hover:bg-cyan-600 transition-all duration-300 transform hover:scale-110"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="#"
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
                <a
                  href="#"
                  className="group p-3 bg-gray-800 rounded-full hover:bg-indigo-600 transition-all duration-300 transform hover:scale-110"
                  aria-label="Discord"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z" />
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
