import React from 'react';
import { ArrowRight } from 'lucide-react';
import { contactData } from '@/data/ContactV4';

const Contact = () => {
  return (
    <section id="contact" className="relative py-20 px-6 lg:px-20 border-t border-neutral-800">
      
      <div className="max-w-4xl mx-auto text-center">
        
        <div className="mb-12">
          <div className="text-xs font-mono text-neutral-500 mb-2">[ GET_IN_TOUCH ]</div>
          <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase mb-6">LET'S TALK</h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            I'm currently available for freelance projects and full-time opportunities. 
            Let's build something great together.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid md:grid-cols-3 gap-[1px] bg-neutral-800 border border-neutral-800 mb-12">
          {contactData.map((contact, idx) => (
            <div key={idx} className="bg-[#0a0a0a] p-8 hover:bg-neutral-900 transition-colors group">
              <div className="text-neutral-500 group-hover:text-white transition-colors mb-4 flex justify-center">
                {contact.icon}
              </div>
              <div className="text-xs font-mono text-neutral-600 mb-2">{contact.label}</div>
              <div className="font-mono text-white group-hover:text-red-500 transition-colors">{contact.value}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button className="h-16 px-12 bg-white text-black font-bold tracking-tight hover:bg-neutral-200 transition-colors flex items-center gap-3 mx-auto text-lg">
          START A PROJECT <ArrowRight size={24} />
        </button>

      </div>

    </section>
  );
};

export default Contact;
