import React, { useState } from 'react';
import { DOCTORS } from '../constants';
import Button from '../components/Button';
import { Search, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Doctors: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const specialties = ['All', ...Array.from(new Set(DOCTORS.map(d => d.specialty)))];

  const filteredDoctors = DOCTORS.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Meet Our Specialists</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our team of expert physicians is dedicated to providing the highest standard of medical care.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search doctor by name..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            {specialties.map(spec => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedSpecialty === spec 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredDoctors.map(doctor => (
            <div key={doctor.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
              <div className="relative h-64 overflow-hidden bg-gray-200">
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold text-orange-500">
                  <Star size={12} fill="currentColor" /> 4.9
                </div>
              </div>
              <div className="p-6">
                <div className="text-primary-600 text-sm font-semibold mb-1 uppercase tracking-wider">{doctor.specialty}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{doctor.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{doctor.education} • {doctor.experience} years exp.</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {doctor.availability.slice(0,3).map(day => (
                    <span key={day} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      {day}
                    </span>
                  ))}
                </div>

                <Link to="/appointment" className="block">
                  <Button variant="outline" className="w-full hover:bg-primary-600 hover:text-white hover:border-primary-600">
                    Book Appointment
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No doctors found matching your criteria.</p>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedSpecialty('All');}}
              className="text-primary-600 font-medium mt-2 hover:underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
