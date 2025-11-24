import React from 'react';
import { SERVICES } from '../constants';
import { ArrowRight, CheckCircle } from 'lucide-react';

const Services: React.FC = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="bg-primary-50 py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Our Medical Services</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive care delivered by specialists using the latest technology. From diagnostics to rehabilitation, we are with you every step of the way.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="space-y-20">
          {SERVICES.map((service, idx) => (
            <div key={service.id} className={`flex flex-col md:flex-row gap-12 items-center ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className="w-full md:w-1/2">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="rounded-2xl shadow-xl w-full h-[400px] object-cover hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div className="w-full md:w-1/2 space-y-6">
                <div className="inline-flex items-center gap-2 text-primary-600 font-semibold bg-primary-50 px-4 py-1.5 rounded-full text-sm">
                   {/* Placeholder for dynamic icon mapping if needed, using text for now */}
                   <span>Department of</span>
                   {service.title}
                </div>
                <h2 className="text-3xl font-bold text-gray-900">{service.title}</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {service.description} We utilize cutting-edge diagnostic tools and personalized treatment plans to ensure the best outcomes for our patients. Our team of board-certified specialists works collaboratively to address complex cases.
                </p>
                
                <ul className="space-y-3">
                  {[1, 2, 3].map((_, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <CheckCircle className="text-green-500 shrink-0" size={20} />
                      <span>Specialized treatment protocol {i + 1}</span>
                    </li>
                  ))}
                </ul>

                <button className="flex items-center gap-2 text-primary-600 font-bold hover:gap-3 transition-all mt-4">
                  View Treatments <ArrowRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
