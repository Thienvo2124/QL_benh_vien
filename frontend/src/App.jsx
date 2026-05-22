import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import News from './components/News';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Services />
        <News />
      </main>
      <Footer />
    </div>
  );
}

export default App;
