import React, { useState } from 'react';
import styles from './FooterComponent.module.css'; 

const FooterComponent: React.FC = () => {
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 body-font">
      <div className="container px-5 py-6 mx-auto flex flex-col sm:flex-row items-center justify-between">
        {/* Left: Copyright */}
        <p className="text-sm text-center sm:text-left">
          © {currentYear} CIS4004 —{" "}
          <a
            href="#"
            className="text-indigo-400 hover:underline ml-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            Course Project
          </a>
        </p>

        {/* Right: Social icons */}
        <div className="inline-flex mt-4 sm:mt-0">
          <a href="#" className="text-gray-400 hover:text-white mx-2" aria-label="Instagram">
            <i className="fa fa-instagram"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-white mx-2" aria-label="LinkedIn">
            <i className="fa fa-linkedin"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-white mx-2" aria-label="GitHub">
            <i className="fa fa-github"></i>
          </a>
        </div>
      </div>
    </footer>

  );
};

export default FooterComponent;
