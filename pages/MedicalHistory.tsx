
import React, { useState } from 'react';
import { MOCK_MEDICAL_HISTORY, MOCK_PRESCRIPTIONS } from '../constants';
import { FileText, Pill, Activity, Calendar, Download, User } from 'lucide-react';
import Button from '../components/Button';

const MedicalHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'records' | 'prescriptions'>('records');

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 flex flex-col md:flex-row items-center gap-6 border border-gray-100">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-3xl font-bold">
            JD
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-serif font-bold text-gray-900">John Doe</h1>
            <p className="text-gray-500">Patient ID: #883921 • DOB: Jan 15, 1985</p>
            <div className="flex gap-4 mt-4 justify-center md:justify-start">
               <div className="text-sm bg-gray-100 px-3 py-1 rounded-full">Blood Type: <strong>O+</strong></div>
               <div className="text-sm bg-gray-100 px-3 py-1 rounded-full">Allergies: <strong>None</strong></div>
            </div>
          </div>
          <div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download size={16} /> Download Report
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('records')}
            className={`pb-4 px-4 font-medium flex items-center gap-2 transition-colors ${
              activeTab === 'records' 
                ? 'border-b-2 border-primary-600 text-primary-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Activity size={18} /> Medical Records
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`pb-4 px-4 font-medium flex items-center gap-2 transition-colors ${
              activeTab === 'prescriptions' 
                ? 'border-b-2 border-primary-600 text-primary-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Pill size={18} /> Prescriptions
          </button>
        </div>

        {/* Content */}
        {activeTab === 'records' && (
          <div className="space-y-6 animate-fade-in">
            {MOCK_MEDICAL_HISTORY.map((record) => (
              <div key={record.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      record.type === 'Checkup' ? 'bg-blue-100 text-blue-600' : 
                      record.type === 'Emergency' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{record.type} - {record.diagnosis}</h3>
                      <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                        <User size={14} /> {record.doctorName}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 text-gray-500 text-sm flex items-center gap-2">
                    <Calendar size={14} /> {record.date}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                  <strong>Treatment Plan:</strong> {record.treatment}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'prescriptions' && (
          <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
            {MOCK_PRESCRIPTIONS.map((rx) => (
              <div key={rx.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${rx.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{rx.medication}</h3>
                    <p className="text-gray-500">{rx.dosage}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    rx.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {rx.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex justify-between"><span>Frequency:</span> <span className="font-medium">{rx.frequency}</span></p>
                  <p className="flex justify-between"><span>Prescriber:</span> <span className="font-medium">{rx.prescribedBy}</span></p>
                </div>
                {rx.status === 'Active' && (
                  <Button variant="outline" size="sm" className="w-full mt-6">Request Refill</Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistory;
