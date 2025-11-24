import React from 'react';

const About: React.FC = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">About City General</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            For over 50 years, we have been a beacon of hope and healing in our community. 
            Our mission is to provide compassionate, accessible, and high-quality healthcare to all.
          </p>
        </div>

        {/* Content Block 1 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
           <div className="order-2 md:order-1">
             <img 
               src="https://picsum.photos/id/1047/800/600" 
               alt="Hospital Building" 
               className="rounded-2xl shadow-xl w-full"
             />
           </div>
           <div className="order-1 md:order-2 space-y-6">
             <h2 className="text-3xl font-bold text-gray-900">Our History</h2>
             <p className="text-gray-600 leading-relaxed">
               Founded in 1970, City General Hospital started as a small community clinic. Through decades of dedication and community support, we have grown into a 500-bed multi-specialty tertiary care center.
             </p>
             <p className="text-gray-600 leading-relaxed">
               We have pioneered numerous medical procedures in the region and continue to invest in the latest technology to ensure our patients receive world-class treatment closer to home.
             </p>
           </div>
        </div>

        {/* Values */}
        <div className="bg-gray-50 rounded-3xl p-12 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Integrity', text: 'We adhere to the highest ethical standards in everything we do.' },
              { title: 'Compassion', text: 'We treat every patient with kindness, empathy, and respect.' },
              { title: 'Excellence', text: 'We strive for the highest quality in clinical care and service.' }
            ].map((val, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <h3 className="text-xl font-bold mb-3 text-primary-700">{val.title}</h3>
                <p className="text-gray-600">{val.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Snippet */}
        <div className="text-center">
           <h2 className="text-3xl font-bold text-gray-900 mb-12">Leadership Team</h2>
           <div className="grid md:grid-cols-3 gap-8">
             {[1, 2, 3].map((i) => (
               <div key={i} className="flex flex-col items-center">
                 <img 
                   src={`https://picsum.photos/id/${100 + i}/300/300`} 
                   alt="Leader" 
                   className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-primary-100"
                 />
                 <h3 className="text-lg font-bold">John Doe {i}</h3>
                 <p className="text-primary-600">Chief Medical Officer</p>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default About;
