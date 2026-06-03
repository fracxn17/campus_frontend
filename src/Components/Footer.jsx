import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-8 h-8 text-blue-400" />
              <span className="text-xl">CampusLegacy</span>
            </div>
            <p className="text-gray-400 mb-4">
              Connecting alumni, building futures, and creating lasting impact.
            </p>
            <div className="flex gap-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
            </div>
          </div>
          
          <div className="flex flex-col md:items-center">
            <div>
              <h4 className="text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white">About Us</Link></li>
                <li><Link to="/directory" className="hover:text-white">Alumni Directory</Link></li>
                <li><Link to="/events" className="hover:text-white">Events</Link></li>
              </ul>
            </div>
          </div>
          
          
          <div>
            <h4 className="text-lg mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                alumni@campuslegacy.edu
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                123 University Ave
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 CampusLegacy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
