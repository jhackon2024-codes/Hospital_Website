
import React, { useState } from 'react';
import Button from '../components/Button';
import { Calendar, Clock, User, Phone, Mail, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { DOCTORS } from '../constants';

const Appointment: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  
  // Form State
  const [department, setDepartment] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [dateError, setDateError] = useState('');

  // Derived State
  const availableDoctors = department 
    ? DOCTORS.filter(d => d.specialty === department)
    : DOCTORS;

  const selectedDoctor = DOCTORS.find(d => d.id === selectedDoctorId);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value;
    setSelectedDate(dateStr);
    setDateError('');

    if (selectedDoctor && dateStr) {
      const date = new Date(dateStr);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      // Basic check: Is the doctor available on this day?
      if (!selectedDoctor.availability.includes(dayName)) {
        setDateError(`Dr. ${selectedDoctor.name.split(' ')[1]} is only available on: ${selectedDoctor.availability.join(', ')}.`);
      }
    }
  };

  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDoctorId(e.target.value);
    // Reset date validation when doctor changes
    if (selectedDate) {
      // Re-trigger validation logic if needed, but for simplicity just clear error to force user to re-check or just let them pick
      setDateError(''); 
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dateError) {
      alert("Please select a valid date based on the doctor's availability.");
      return;
    }
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gray-50">
        <div className="bg-white p-12 rounded-2xl shadow-xl text-center max-w-md mx-4 animate-fade-in-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Request Sent!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for booking with City General. 
            {selectedDoctor && <span className="block font-medium mt-2">Appointment with {selectedDoctor.name} on {selectedDate}</span>}
          </p>
          <Button onClick={() => { setSubmitted(false); setDepartment(''); setSelectedDoctorId(''); setSelectedDate(''); }}>
            Book Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
          
          {/* Form Side */}
          <div className="flex-1 bg-white p-8 md:p-10 rounded-2xl shadow-lg">
            <h1 className="text-3xl font-serif font-bold mb-2">Book an Appointment</h1>
            <p className="text-gray-500 mb-8">Please fill out the form below to schedule your visit.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input required type="text" className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="John" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input required type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="Doe" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input required type="email" className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="john@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input required type="tel" className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="(555) 000-0000" />
                  </div>
                </div>
              </div>

              {/* Dynamic Selection Area */}
              <div className="p-4 bg-blue-50 rounded-xl space-y-4 border border-blue-100">
                <h3 className="font-semibold text-blue-900">Medical Details</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select 
                      value={department}
                      onChange={(e) => { setDepartment(e.target.value); setSelectedDoctorId(''); }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white"
                    >
                      <option value="">Select Department</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Orthopedics">Orthopedics</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
                    <select 
                      required
                      value={selectedDoctorId}
                      onChange={handleDoctorChange}
                      disabled={!department && availableDoctors.length === DOCTORS.length} 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <option value="">{department ? 'Select Doctor' : 'Select Dept First (Optional)'}</option>
                      {availableDoctors.map(doc => (
                        <option key={doc.id} value={doc.id}>{doc.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedDoctor && (
                  <div className="text-sm text-blue-700 bg-blue-100 p-2 rounded flex items-center gap-2">
                    <Clock size={16} />
                    <span>Availability: <strong>{selectedDoctor.availability.join(', ')}</strong></span>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                      required 
                      type="date" 
                      value={selectedDate}
                      onChange={handleDateChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 ${dateError ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} 
                    />
                  </div>
                  {dateError && (
                    <div className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {dateError}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                    <select className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white">
                      <option>Morning (9AM - 12PM)</option>
                      <option>Afternoon (12PM - 4PM)</option>
                      <option>Evening (4PM - 8PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                  <textarea rows={3} className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="Briefly describe your symptoms..." />
                </div>
              </div>

              <Button type="submit" className="w-full py-4 text-lg">Confirm Booking</Button>
            </form>
          </div>

          {/* Info Side */}
          <div className="lg:w-80 space-y-8">
            <div className="bg-primary-900 text-white p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-4">Opening Hours</h3>
              <ul className="space-y-4 text-primary-100 text-sm">
                <li className="flex justify-between">
                  <span>Mon - Fri</span>
                  <span>8:00 AM - 9:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span>
                  <span>9:00 AM - 7:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-primary-700">
                <p className="font-bold mb-1">Emergency Service</p>
                <p className="text-2xl font-bold text-white">24/7 Open</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
               <h3 className="text-xl font-bold mb-2">Need Help?</h3>
               <p className="text-gray-500 text-sm mb-4">Call our appointment line for immediate assistance.</p>
               <div className="text-2xl font-bold text-primary-600 flex items-center gap-2">
                 <Phone size={24} />
                 (555) 123-4567
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
