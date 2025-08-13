import { Facebook, Twitter, Linkedin, Instagram, Mail } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    company: [
      { label: "About Us", href: "#about" },
      { label: "How it Works", href: "#how-it-works" },
      { label: "Careers", href: "#careers" },
      { label: "Press", href: "#press" }
    ],
    services: [
      { label: "Financial Planning", href: "#planning" },
      { label: "Investment Advice", href: "#investments" },
      { label: "Debt Management", href: "#debt" },
      { label: "Retirement Planning", href: "#retirement" }
    ],
    support: [
      { label: "Help Center", href: "#help" },
      { label: "Contact Us", href: "#contact" },
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: "#facebook", label: "Facebook" },
    { icon: Twitter, href: "#twitter", label: "Twitter" },
    { icon: Linkedin, href: "#linkedin", label: "LinkedIn" },
    { icon: Instagram, href: "#instagram", label: "Instagram" }
  ];

  return (
    <footer className="bg-advisor-gray text-white">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 advisor-gradient rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-xl font-heading font-bold">FinanceAdvisor</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Your AI-powered personal financial advisor, helping you understand, plan, 
                and achieve your financial goals with expert guidance and intelligent insights.
              </p>
              
              {/* Newsletter Signup */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-advisor-green"
                  />
                </div>
                <button className="advisor-gradient px-6 py-3 rounded-lg font-medium hover:advisor-shadow-hover transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-advisor-green transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-advisor-green transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-advisor-green transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-300 text-sm">
              © 2024 AI FinanceAdvisor. All rights reserved.
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-300 hover:text-advisor-green hover:bg-white/20 transition-all duration-200"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;