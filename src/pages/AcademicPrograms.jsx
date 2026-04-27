import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AcademicProgramsSection from '../components/AcademicProgramsSection';

const AcademicPrograms = () => {
  return (
    <div className="programs-page-wrapper">
      <Header />
      <div style={{ paddingTop: '80px' }}>
        <AcademicProgramsSection />
      </div>
      <Footer />
    </div>
  );
};

export default AcademicPrograms;
