import React, { useState } from 'react';
    import { CharacterSelection } from './components/CharacterSelection';
    import { GameBoard } from './components/GameBoard';

    function App() {
      const [selectedCharacter, setSelectedCharacter] = useState(null);

      const handleCharacterSelect = (character) => {
        setSelectedCharacter(character);
      };

      return (
        <div className="font-sans bg-gray-900 text-white">
          {selectedCharacter ? (
            <GameBoard selectedCharacter={selectedCharacter} />
          ) : (
            <CharacterSelection onSelect={handleCharacterSelect} />
          )}
        </div>
      );
    }

    export default App;
