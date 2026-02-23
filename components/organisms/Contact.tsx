import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { contactData, resumeLink } from '@/data/ContactV4';

const Contact = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (label: string, value: string) => {
    if (label === 'EMAIL') {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <section id="contact" className="relative py-20 px-6 lg:px-20 border-t border-neutral-800">
      
      <div className="max-w-4xl mx-auto text-center">
        
        <div className="mb-12">
          <div className="text-xs font-mono text-neutral-500 mb-2">[ GET_IN_TOUCH ]</div>
          <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase mb-6">LET'S TALK</h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Currently available for freelance projects and full-time opportunities. 
            Let's build something exceptional together.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid md:grid-cols-3 gap-px bg-neutral-800 border border-neutral-800 mb-12">
          {contactData.map((contact, idx) => (
            <a 
              key={idx} 
              href={contact.link}
              target={contact.label === 'EMAIL' ? undefined : '_blank'}
              onClick={() => handleCopyEmail(contact.label, contact.value)}
              rel="noopener noreferrer"
              className="block bg-[#0a0a0a] p-8 hover:bg-neutral-900 transition-colors group relative"
            >
              <div className="text-neutral-500 group-hover:text-white transition-colors mb-4 flex justify-center">
                {contact.icon}
              </div>
              <div className="text-xs font-mono text-neutral-600 mb-2">
                {contact.label} 
                {contact.label === 'EMAIL' && copied && <span className="text-green-500 ml-2 animate-pulse">(COPIED!)</span>}
              </div>
              <div className="font-mono text-white group-hover:text-red-500 transition-colors">{contact.value}</div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <a 
            href="mailto:daffaaditya.me@gmail.com"
            onClick={() => handleCopyEmail('EMAIL', 'daffaaditya.me@gmail.com')}
            className="group h-14 lg:h-16 px-8 lg:px-12 bg-white text-black font-bold tracking-tight hover:bg-neutral-200 transition-all flex items-center gap-3 text-base lg:text-lg w-full md:w-auto justify-center"
          >
            START A PROJECT <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
          </a>
          
          <a 
            href={resumeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group h-14 lg:h-16 px-8 lg:px-12 bg-transparent border border-neutral-700 text-white font-bold tracking-tight hover:bg-neutral-800 transition-all flex items-center gap-3 text-base lg:text-lg w-full md:w-auto justify-center"
          >
            RESUME <ArrowRight className="group-hover:-rotate-45 transition-transform duration-300" size={24} />
          </a>
        </div>

      </div>

    </section>
  );
};

export default Contact;
