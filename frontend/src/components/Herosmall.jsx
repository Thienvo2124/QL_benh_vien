import React from 'react';

const HeroSmall = ({ title, subtitle }) => (
  <section className="bg-gradient-to-r from-[#004e92] to-[#1565c0] py-14 px-4">
    <div className="container mx-auto">
      <h1 className="text-4xl font-extrabold text-white uppercase tracking-wide mb-2">{title}</h1>
      {subtitle && <p className="text-blue-100 text-lg">{subtitle}</p>}
    </div>
  </section>
);

export default HeroSmall;