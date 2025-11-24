import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, ShieldCheck, UserCheck, Activity } from 'lucide-react';
import Button from '../components/Button';
import { SERVICES, DOCTORS } from '../constants';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center pt-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/id/338/1920/1080" 
            alt="Hospital Hallway" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-800/70"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-6 animate-fade-in-up">
            <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 mb-2">
              🏆 #1 Ranked Hospital in the City
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
              Advanced Healthcare, <br />
              <span className="text-sky-300">Compassionate</span> Care.
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-xl leading-relaxed">
              We combine state-of-the-art technology with world-class medical expertise to provide you with the best healthcare experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/appointment">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Book an Appointment
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="white" size="lg" className="w-full sm:w-auto">
                  Our Services
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-6 pt-12 border-t border-white/10 mt-12">
              <div>
                <p className="text-3xl font-bold">50+</p>
                <p className="text-sm text-gray-300">Doctors</p>
              </div>
              <div>
                <p className="text-3xl font-bold">15k+</p>
                <p className="text-sm text-gray-300">Patients/Year</p>
              </div>
              <div>
                <p className="text-3xl font-bold">24/7</p>
                <p className="text-sm text-gray-300">Emergency</p>
              </div>
            </div>
          </div>
          
          {/* Hero Form / Card (Hidden on mobile for cleaner look or adjust) */}
          <div className="hidden lg:block bg-white p-8 rounded-2xl shadow-2xl max-w-md ml-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Find a Doctor</h3>
            <p className="text-gray-500 mb-6">Search by name or specialty to find the right care.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
                  <option>Select Specialty</option>
                  <option>Cardiology</option>
                  <option>Neurology</option>
                  <option>Pediatrics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                <input type="text" placeholder="e.g. Dr. Smith" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
              </div>
              <Button className="w-full mt-2">Search</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Cards */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-8 -mt-32 relative z-20">
            {[
              { icon: Clock, title: '24/7 Emergency', text: 'Immediate care for critical conditions with expert trauma teams.' },
              { icon: UserCheck, title: 'Expert Doctors', text: 'Highly qualified professionals from top medical institutions.' },
              { icon: ShieldCheck, title: 'Modern Tech', text: 'Advanced diagnostic equipment and robotic surgery facilities.' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-b-4 border-primary-500">
                <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-6">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.text}</p>
                <Link to="/services" className="inline-flex items-center gap-1 text-primary-600 font-medium mt-4 hover:gap-2 transition-all">
                  Learn more <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Highlight */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <span className="text-primary-600 font-semibold tracking-wider uppercase text-sm">Departments</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2 mb-12 text-gray-900">Our Medical Services</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.slice(0, 6).map((service) => (
              <div key={service.id} className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all h-64">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-end text-left">
                  <h3 className="text-xl font-bold text-white mb-1">{service.title}</h3>
                  <p className="text-gray-200 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">
                    {service.description}
                  </p>
                  <Link to="/services" className="text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm w-fit inline-flex items-center gap-2">
                    View Details <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link to="/services">
              <Button variant="outline">View All Departments</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Strip */}
      <section className="py-20 bg-primary-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
           </svg>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 grid md:grid-cols-2 gap-12 items-center">
           <div>
             <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Why Choose City General?</h2>
             <p className="text-primary-100 mb-6 text-lg">
               We understand that healthcare is about more than just treating an illness—it's about caring for the whole person. Our patient-centered approach ensures you receive the attention and respect you deserve.
             </p>
             <ul className="space-y-4">
               {['JCI Accredited Facility', 'Award-winning Nursing Staff', 'Private Patient Rooms', 'Advanced Research Center'].map((item, idx) => (
                 <li key={idx} className="flex items-center gap-3">
                   <div className="w-6 h-6 rounded-full bg-green-400/20 text-green-400 flex items-center justify-center">
                     <ShieldCheck size={14} />
                   </div>
                   {item}
                 </li>
               ))}
             </ul>
           </div>
           <div className="relative">
             <img 
               src="https://picsum.photos/id/1025/600/400" 
               alt="Doctor with patient" 
               className="rounded-2xl shadow-2xl border-4 border-white/10"
             />
             <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-6 rounded-xl shadow-xl max-w-xs hidden lg:block">
               <div className="flex items-center gap-4 mb-3">
                 <div className="bg-primary-100 p-3 rounded-full text-primary-600">
                   <Activity size={24} />
                 </div>
                 <div>
                   <p className="font-bold text-lg">98%</p>
                   <p className="text-sm text-gray-500">Patient Satisfaction</p>
                 </div>
               </div>
               <p className="text-xs text-gray-400">Based on internal surveys from 2024.</p>
             </div>
           </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-medical-light">
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl font-bold mb-4 text-gray-900">Need Immediate Assistance?</h2>
           <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
             Our support team is available 24/7 to answer your queries. You can also use our AI assistant for quick help.
           </p>
           <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Link to="/contact">
               <Button>Contact Us</Button>
             </Link>
             <Link to="/appointment">
               <Button variant="outline" className="bg-white">Book Appointment</Button>
             </Link>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
