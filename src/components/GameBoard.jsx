import React, { useRef, useEffect, useState } from 'react';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Save,
  Upload,
  RefreshCcw,
  Search,
  Axe,
  DoorOpen,
  Users,
  Flag,
  Backpack,
  Info,
  Home,
  Heart,
} from 'lucide-react';

export const GameBoard = ({ selectedCharacter }) => {
  const canvasRef = useRef(null);
  const [turn, setTurn] = useState(1);
  const [actionPoints, setActionPoints] = useState(3);
  const [zombies, setZombies] = useState([]);
  const [mission, setMission] = useState({
    description: 'Survive the zombie horde and reach the extraction point.',
    objectives: ['Reach the extraction point'],
  });
  const tileSize = 30;
  const boardWidth = 20;
  const boardHeight = 15;
  const initialCharacterPosition = { x: 2, y: 2 };
  const [characterPosition, setCharacterPosition] = useState(
    initialCharacterPosition
  );
  const [board, setBoard] = useState(generateBoard());
  const [inventory, setInventory] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const [playerHealth, setPlayerHealth] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [hitTiles, setHitTiles] = useState([]);

  const zombieSpawnPoints = [
    { x: 1, y: 1 },
    { x: 18, y: 1 },
    { x: 1, y: 13 },
    { x: 18, y: 13 },
  ];
  const extractionPoint = { x: 18, y: 7 };

  const equipmentCards = [
    {
      id: 'axe',
      name: 'Axe',
      type: 'Weapon',
      damage: 1,
      icon: <Axe size={20} />,
      description: 'A sturdy axe for melee combat.',
    },
    {
      id: 'pistol',
      name: 'Pistol',
      type: 'Weapon',
      damage: 2,
      icon: <span className="text-sm"></span>,
      description: 'A reliable pistol for ranged attacks.',
    },
    {
      id: 'medkit',
      name: 'Medkit',
      heal: 2,
      icon: <span className="text-sm"></span>,
      description: 'A medkit to heal wounds.',
    },
  ];

  function generateBoard() {
    const newBoard = [];
    for (let y = 0; y < boardHeight; y++) {
      const row = [];
      for (let x = 0; x < boardWidth; x++) {
        let tileType = 'street';
        if (
          x === 0 ||
          x === boardWidth - 1 ||
          y === 0 ||
          y === boardHeight - 1
        ) {
          tileType = 'wall';
        } else if ((x === 5 || x === 15) && y > 2 && y < 12) {
          tileType = 'wall';
        }
        row.push({ type: tileType });
      }
      newBoard.push(row);
    }
    return newBoard;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawBoard = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < boardHeight; y++) {
        for (let x = 0; x < boardWidth; x++) {
          const tileType = board[y][x].type;
          ctx.fillStyle = getTileColor(tileType);
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
          if (hitTiles.some((tile) => tile.x === x && tile.y === y)) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
          }
        }
      }
      drawCharacter(ctx, selectedCharacter, tileSize);
      drawZombies(ctx, tileSize);
      drawSpawnPoints(ctx, tileSize);
      drawExtractionPoint(ctx, tileSize);
    };

    const getTileColor = (tileType) => {
      switch (tileType) {
        case 'wall':
          return '#6b7280';
        case 'street':
          return '#9ca3af';
        default:
          return 'white';
      }
    };

    const drawCharacter = (ctx, character, tileSize) => {
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(
        characterPosition.x * tileSize + tileSize / 2,
        characterPosition.y * tileSize + tileSize / 2,
        tileSize / 2,
        0,
        2 * Math.PI
      );
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        character.name.charAt(0),
        characterPosition.x * tileSize + tileSize / 2,
        characterPosition.y * tileSize + tileSize / 2
      );
    };

    const drawZombies = (ctx, tileSize) => {
      zombies.forEach((zombie) => {
        ctx.fillStyle =
          zombie.type === 'runner'
            ? '#ea580c'
            : zombie.type === 'fatty'
            ? '#7c3aed'
            : '#dc2626';
        ctx.beginPath();
        ctx.arc(
          zombie.x * tileSize + tileSize / 2,
          zombie.y * tileSize + tileSize / 2,
          tileSize / 2,
          0,
          2 * Math.PI
        );
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          zombie.type === 'runner' ? 'R' : zombie.type === 'fatty' ? 'F' : 'Z',
          zombie.x * tileSize + tileSize / 2,
          zombie.y * tileSize + tileSize / 2
        );
        ctx.fillStyle = 'white';
        ctx.font = '8px sans-serif';
        ctx.fillText(
          zombie.health,
          zombie.x * tileSize + tileSize / 2,
          zombie.y * tileSize + tileSize / 2 + 10
        );
      });
    };

    const drawSpawnPoints = (ctx, tileSize) => {
      zombieSpawnPoints.forEach((point) => {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.fillRect(
          point.x * tileSize,
          point.y * tileSize,
          tileSize,
          tileSize
        );
      });
    };

    const drawExtractionPoint = (ctx, tileSize) => {
      ctx.fillStyle = 'green';
      ctx.beginPath();
      ctx.arc(
        extractionPoint.x * tileSize + tileSize / 2,
        extractionPoint.y * tileSize + tileSize / 2,
        tileSize / 2,
        0,
        2 * Math.PI
      );
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        <Home size={16} />,
        extractionPoint.x * tileSize + tileSize / 2,
        extractionPoint.y * tileSize + tileSize / 2
      );
    };

    drawBoard();
  }, [
    selectedCharacter,
    characterPosition,
    zombies,
    board,
    gameWon,
    gameOver,
    hitTiles,
  ]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (gameOver || gameWon) return;
      switch (event.key) {
        case 'ArrowUp':
          handleMove('up');
          break;
        case 'ArrowDown':
          handleMove('down');
          break;
        case 'ArrowLeft':
          handleMove('left');
          break;
        case 'ArrowRight':
          handleMove('right');
          break;
        case 's':
          handleSearch();
          break;
        case 'a':
          handleAttack();
          break;
        case ' ':
          handleEndTurn();
          break;
        case 'm':
          handleUseMedkit();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    gameOver,
    gameWon,
    actionPoints,
    characterPosition,
    zombies,
    playerHealth,
    equipment,
  ]);

  const handleMove = (direction) => {
    if (actionPoints <= 0 || gameWon || gameOver) return;
    let newX = characterPosition.x;
    let newY = characterPosition.y;

    switch (direction) {
      case 'up':
        newY = Math.max(0, characterPosition.y - 1);
        break;
      case 'down':
        newY = Math.min(boardHeight - 1, characterPosition.y + 1);
        break;
      case 'left':
        newX = Math.max(0, characterPosition.x - 1);
        break;
      case 'right':
        newX = Math.min(boardWidth - 1, characterPosition.x + 1);
        break;
      default:
        break;
    }

    if (board[newY][newX].type !== 'wall') {
      setCharacterPosition({ x: newX, y: newY });
      setActionPoints(actionPoints - 1);
    }
  };

  const handleSearch = () => {
    if (actionPoints <= 0 || gameWon || gameOver) return;
    const randomCard =
      equipmentCards[Math.floor(Math.random() * equipmentCards.length)];
    setEquipment([...equipment, randomCard]);
    alert(`Found ${randomCard.name}!`);
    setActionPoints(actionPoints - 1);
  };

  const handleAttack = () => {
    if (actionPoints <= 0 || gameWon || gameOver) return;
    const equippedWeapon = equipment.find((item) => item.type === 'Weapon') || {
      damage: 0,
    };

    const damage = equippedWeapon.damage;
    console.log('damage: ', damage);
    const tiles = [];

    setZombies((prevZombies) => {
      return prevZombies
        .map((zombie) => {
          const dx = characterPosition.x - zombie.x;
          const dy = characterPosition.y - zombie.y;
          if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
            tiles.push({ x: zombie.x, y: zombie.y });
            const newHealth = zombie.health - damage;
            return { ...zombie, health: newHealth };
          }
          return zombie;
        })
        .filter((zombie) => zombie.health > 0);
    });

    setHitTiles(tiles);
    setTimeout(() => setHitTiles([]), 200);
    setActionPoints(actionPoints - 1);
  };

  const handleOpenDoor = () => {
    if (actionPoints <= 0 || gameWon || gameOver) return;
    alert('Opening door...');
    setActionPoints(actionPoints - 1);
  };

  const handleTrade = () => {
    if (actionPoints <= 0 || gameWon || gameOver) return;
    alert('Trading equipment...');
    setActionPoints(actionPoints - 1);
  };

  const handleTakeObjective = () => {
    if (actionPoints <= 0 || gameWon || gameOver) return;
    alert('Taking objective token...');
    setActionPoints(actionPoints - 1);
  };

  const handleEndTurn = () => {
    if (gameWon || gameOver) return;
    setTurn(turn + 1);
    setActionPoints(3);
    moveZombies();
    spawnZombies();
    checkWinCondition();
  };

  const moveZombies = () => {
    setZombies((prevZombies) => {
      let newPlayerHealth = playerHealth;
      const updatedZombies = prevZombies.map((zombie) => {
        const dx = characterPosition.x - zombie.x;
        const dy = characterPosition.y - zombie.y;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        let newX = zombie.x;
        let newY = zombie.y;

        if (zombie.type === 'runner') {
          if (absDx > absDy) {
            newX = zombie.x + (dx > 0 ? 1 : -2);
          } else if (absDy > 0) {
            newY = zombie.y + (dy > 0 ? 1 : -2);
          }
        } else {
          if (absDx > absDy) {
            newX = zombie.x + (dx > 0 ? 1 : -1);
          } else if (absDy > 0) {
            newY = zombie.y + (dy > 0 ? 1 : -1);
          }
        }

        if (
          board[newY] &&
          board[newY][newX] &&
          board[newY][newX].type !== 'wall'
        ) {
          if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
            newPlayerHealth -= 1;
          }
          return { ...zombie, x: newX, y: newY };
        }
        return zombie;
      });
      setPlayerHealth(newPlayerHealth);
      if (newPlayerHealth <= 0) {
        setGameOver(true);
        alert('Game Over! You were overwhelmed by zombies.');
      }
      return updatedZombies;
    });
  };

  const spawnZombies = () => {
    const numZombiesToSpawn = Math.floor(Math.random() * 4);
    const newZombies = [];
    for (let i = 0; i < numZombiesToSpawn; i++) {
      const spawnPoint =
        zombieSpawnPoints[Math.floor(Math.random() * zombieSpawnPoints.length)];
      const zombieTypes = ['walker', 'runner', 'fatty'];
      const randomType =
        zombieTypes[Math.floor(Math.random() * zombieTypes.length)];
      newZombies.push({
        x: spawnPoint.x,
        y: spawnPoint.y,
        type: randomType,
        health: randomType === 'fatty' ? 3 : 1,
      });
    }
    setZombies((prevZombies) => [...prevZombies, ...newZombies]);
  };

  const checkWinCondition = () => {
    if (
      characterPosition.x === extractionPoint.x &&
      characterPosition.y === extractionPoint.y
    ) {
      setGameWon(true);
      alert('You reached the extraction point! You win!');
    }
  };

  const handleUseMedkit = () => {
    if (gameOver || gameWon) return;
    const medkitIndex = equipment.findIndex((item) => item.id === 'medkit');
    if (medkitIndex !== -1) {
      setPlayerHealth(Math.min(playerHealth + 2, 3));
      const newEquipment = [...equipment];
      newEquipment.splice(medkitIndex, 1);
      setEquipment(newEquipment);
      alert('Used medkit to heal!');
    }
  };

  const handleSaveGame = () => {
    const gameState = {
      turn,
      actionPoints,
      characterPosition,
      zombies,
      mission,
      board,
      inventory,
      equipment,
      gameWon,
      playerHealth,
      gameOver,
    };
    localStorage.setItem('zombicideSave', JSON.stringify(gameState));
    alert('Game saved!');
  };

  const handleLoadGame = () => {
    const savedGame = localStorage.getItem('zombicideSave');
    if (savedGame) {
      const gameState = JSON.parse(savedGame);
      setTurn(gameState.turn);
      setActionPoints(gameState.actionPoints);
      setCharacterPosition(gameState.characterPosition);
      setZombies(gameState.zombies);
      setMission(gameState.mission);
      setBoard(gameState.board);
      setInventory(gameState.inventory);
      setEquipment(gameState.equipment);
      setGameWon(gameState.gameWon);
      setPlayerHealth(gameState.playerHealth);
      setGameOver(gameState.gameOver);
      alert('Game loaded!');
    } else {
      alert('No saved game found.');
    }
  };

  const handleResetGame = () => {
    setTurn(1);
    setActionPoints(3);
    setCharacterPosition(initialCharacterPosition);
    setZombies(generateZombies());
    setBoard(generateBoard());
    setInventory([]);
    setEquipment([]);
    setGameWon(false);
    setPlayerHealth(3);
    setGameOver(false);
    alert('Game reset!');
  };

  const generateZombies = () => {
    const zombieTypes = ['walker', 'runner', 'fatty'];
    const newZombies = [];
    for (let i = 0; i < 5; i++) {
      const randomX = Math.floor(Math.random() * boardWidth);
      const randomY = Math.floor(Math.random() * boardHeight);
      const randomType =
        zombieTypes[Math.floor(Math.random() * zombieTypes.length)];
      newZombies.push({
        x: randomX,
        y: randomY,
        type: randomType,
        health: randomType === 'fatty' ? 3 : 1,
      });
    }
    return newZombies;
  };

  useEffect(() => {
    setZombies(generateZombies());
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h2 className="text-4xl font-bold mb-4 text-center">Game Board</h2>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={handleSaveGame}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          <Save size={20} className="inline-block mr-2" />
          Save
        </button>
        <button
          onClick={handleLoadGame}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          <Upload size={20} className="inline-block mr-2" />
          Load
        </button>
        <button
          onClick={handleResetGame}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          <RefreshCcw size={20} className="inline-block mr-2" />
          Reset
        </button>
      </div>
      <div className="mb-4 text-center">
        <p>
          Turn: <span className="font-bold">{turn}</span>
        </p>
        <p>
          Action Points: <span className="font-bold">{actionPoints}</span>
        </p>
        <p>
          Player Health:{' '}
          <span className="font-bold">
            {playerHealth} <Heart size={16} className="inline-block" />
          </span>
        </p>
      </div>
      <div className="mb-4 max-w-2xl w-full text-center">
        <p className="font-bold text-xl">Mission:</p>
        <p className="mb-2">{mission.description}</p>
        <ul className="list-disc list-inside">
          {mission.objectives.map((objective, index) => (
            <li key={index}>{objective}</li>
          ))}
        </ul>
      </div>
      <div className="mb-4 max-w-2xl w-full">
        <p className="font-bold text-xl">Equipment:</p>
        <ul className="list-disc list-inside">
          {equipment.map((card, index) => (
            <li key={index} className="flex items-center">
              {card.icon} {card.name}
              <span
                className="ml-2 text-gray-500 cursor-pointer"
                title={card.description}
              >
                <Info size={16} />
              </span>
            </li>
          ))}
        </ul>
      </div>
      {gameWon && (
        <div className="text-center text-4xl font-bold text-green-500 mb-4">
          You Win!
        </div>
      )}
      {gameOver && (
        <div className="text-center text-4xl font-bold text-red-500 mb-4">
          Game Over!
        </div>
      )}
      <canvas
        ref={canvasRef}
        width="600"
        height="450"
        className="border border-gray-700 rounded-md shadow-lg"
      ></canvas>
      <div className="flex space-x-2 mt-4">
        <button
          onClick={() => handleMove('up')}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          title="Move Up"
        >
          <ArrowUp size={20} />
        </button>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => handleMove('left')}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          title="Move Left"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={() => handleMove('right')}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          title="Move Right"
        >
          <ArrowRight size={20} />
        </button>
      </div>
      <div className="flex space-x-2 mt-4">
        <button
          onClick={() => handleMove('down')}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          title="Move Down"
        >
          <ArrowDown size={20} />
        </button>
      </div>
      <div className="flex space-x-4 mt-4">
        <button
          onClick={handleSearch}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          title="Search for items"
        >
          <Search size={20} className="inline-block mr-2" />
          Search
        </button>
        <button
          onClick={handleAttack}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          title="Attack zombies"
        >
          <Axe size={20} className="inline-block mr-2" />
          Attack
        </button>
      </div>
      <button
        onClick={handleEndTurn}
        className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        End Turn
      </button>
    </div>
  );
};
