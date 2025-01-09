import React from 'react';
    import { User, Shield, Heart, Zap } from 'lucide-react';

    const characters = [
      {
        id: 'dave',
        name: 'Dave',
        role: 'Cop',
        ability: 'Increased melee damage',
        icon: <User size={48} />,
        image: 'https://images.unsplash.com/photo-1519648023956-20128400682b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        id: 'dan',
        name: 'Dan',
        role: 'Medic',
        ability: 'Heals allies',
        icon: <Heart size={48} />,
        image: 'https://images.unsplash.com/photo-1532635124-1943d149182f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        id: 'stela',
        name: 'Stela',
        role: 'Escape Artist',
        ability: 'Increased movement speed',
        icon: <Zap size={48} />,
        image: 'https://images.unsplash.com/photo-1531384441371-49273171d8c8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        id: 'olivia',
        name: 'Olivia',
        role: 'Scooter Rider',
        ability: 'Can move faster on streets',
        icon: <Shield size={48} />,
        image: 'https://images.unsplash.com/photo-1589156284700-21481b73a58e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
    ];

    export const CharacterSelection = ({ onSelect }) => {
      return (
        <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1508423134147-add552166694?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)' }}>
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-5xl font-bold mb-10 text-center text-white drop-shadow-lg">Select Your Character</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full p-6">
              {characters.map((character) => (
                <div key={character.id} className="bg-gray-800 bg-opacity-70 shadow-md rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl">
                  <img src={character.image} alt={character.name} className="w-full h-64 object-cover" />
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <span className="mr-3">{character.icon}</span>
                      <h3 className="text-2xl font-semibold text-white">{character.name}</h3>
                    </div>
                    <p className="text-gray-300 mb-2">
                      <span className="font-medium">Role:</span> {character.role}
                    </p>
                    <p className="text-gray-300 mb-4">
                      <span className="font-medium">Ability:</span> {character.ability}
                    </p>
                    <button
                      onClick={() => onSelect(character)}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline w-full transform transition-transform hover:scale-105"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };
