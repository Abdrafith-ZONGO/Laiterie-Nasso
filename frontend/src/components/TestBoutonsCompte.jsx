import React from 'react';
// React Icons
import { FiUser } from 'react-icons/fi';
// Lucide
import { User } from 'lucide-react';
// Heroicons
import { UserIcon } from '@heroicons/react/24/outline';

function TestBoutonsCompte() {
  return (
    <div className="p-8 bg-fond-page min-h-screen">
      <h2 className="text-2xl font-bold text-texte-principal mb-8">
        🧪 TEST DES 4 BOUTONS "COMPTE"
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
        
        {/* 1️⃣ VERSION ORIGINALE (émoji) */}
        <div className="border border-bordure-moyenne rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">1️⃣ Émoji (original)</h3>
          <button className="flex items-center space-x-1 text-texte-secondaire hover:text-texte-principal">
            <span className="text-xl">👤</span>
            <span className="text-sm">Compte</span>
          </button>
          <p className="text-xs text-texte-secondaire mt-4">Code actuel</p>
        </div>

        {/* 2️⃣ REACT ICONS (Feather) */}
        <div className="border border-bordure-moyenne rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">2️⃣ React Icons</h3>
          <button className="flex items-center space-x-1 text-texte-secondaire hover:text-texte-principal">
            <FiUser className="text-xl" />
            <span className="text-sm">Compte</span>
          </button>
          <p className="text-xs text-texte-secondaire mt-4">npm install react-icons</p>
        </div>

        {/* 3️⃣ LUCIDE REACT */}
        <div className="border border-bordure-moyenne rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">3️⃣ Lucide React</h3>
          <button className="flex items-center space-x-1 text-texte-secondaire hover:text-texte-principal">
            <User className="text-xl" />
            <span className="text-sm">Compte</span>
          </button>
          <p className="text-xs text-texte-secondaire mt-4">npm install lucide-react</p>
        </div>

        {/* 4️⃣ HEROICONS */}
        <div className="border border-bordure-moyenne rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">4️⃣ Heroicons</h3>
          <button className="flex items-center space-x-1 text-texte-secondaire hover:text-texte-principal">
            <UserIcon className="text-xl" />
            <span className="text-sm">Compte</span>
          </button>
          <p className="text-xs text-texte-secondaire mt-4">npm install @heroicons/react</p>
        </div>

      </div>

      {/* SECTION COMPARAISON DIRECTE */}
      <div className="mt-12 p-6 border-2 border-texte-principal rounded-lg max-w-3xl">
        <h3 className="text-lg font-bold text-texte-principal mb-4">⚖️ COMPARAISON DIRECTE</h3>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <button className="flex flex-col items-center">
              <span className="text-xl">👤</span>
              <span className="text-xs">Émoji</span>
            </button>
          </div>
          <div>
            <button className="flex flex-col items-center">
              <FiUser className="text-xl" />
              <span className="text-xs">React</span>
            </button>
          </div>
          <div>
            <button className="flex flex-col items-center">
              <User className="text-xl" />
              <span className="text-xs">Lucide</span>
            </button>
          </div>
          <div>
            <button className="flex flex-col items-center">
              <UserIcon className="text-xl" />
              <span className="text-xs">Hero</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestBoutonsCompte;