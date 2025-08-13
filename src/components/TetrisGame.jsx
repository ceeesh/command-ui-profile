import { useState, useRef, useEffect, useCallback } from "react";

const TetrisGame = ({ onExit }) => {
  const BOARD_WIDTH = 10;
  const BOARD_HEIGHT = 15;
  
  const SHAPES = [
    { shape: [[1, 1, 1, 1]], color: '#00FFFF' }, // I - Cyan
    { shape: [[1, 1], [1, 1]], color: '#FFFF00' }, // O - Yellow
    { shape: [[0, 1, 0], [1, 1, 1]], color: '#800080' }, // T - Purple
    { shape: [[0, 1, 1], [1, 1, 0]], color: '#00FF00' }, // S - Green
    { shape: [[1, 1, 0], [0, 1, 1]], color: '#FF0000' }, // Z - Red
    { shape: [[1, 0, 0], [1, 1, 1]], color: '#0000FF' }, // J - Blue
    { shape: [[0, 0, 1], [1, 1, 1]], color: '#FFA500' }  // L - Orange
  ];

  const [board, setBoard] = useState(() => 
    Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill({ filled: false, color: null }))
  );
  const [currentPiece, setCurrentPiece] = useState(null);
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [dropTime, setDropTime] = useState(1000);
  const gameLoopRef = useRef();

  const createNewPiece = useCallback(() => {
    const pieceData = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    return {
      shape: pieceData.shape,
      color: pieceData.color
    };
  }, []);

  const isValidMove = useCallback((piece, pos, testBoard = board) => {
    if (!piece) return false;
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          
          if (newX < 0 || newX >= BOARD_WIDTH || 
              newY >= BOARD_HEIGHT ||
              (newY >= 0 && testBoard[newY] && testBoard[newY][newX] && testBoard[newY][newX].filled)) {
            return false;
          }
        }
      }
    }
    return true;
  }, [board]);

  const clearLines = useCallback((newBoard) => {
    let linesCleared = 0;
    const clearedBoard = [];
    
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      if (newBoard[y].every(cell => cell.filled)) {
        linesCleared++;
      } else {
        clearedBoard.push(newBoard[y]);
      }
    }
    
    // Add empty lines at the top
    while (clearedBoard.length < BOARD_HEIGHT) {
      clearedBoard.unshift(Array(BOARD_WIDTH).fill({ filled: false, color: null }));
    }
    
    if (linesCleared > 0) {
      setLines(prev => prev + linesCleared);
      setScore(prev => prev + linesCleared * 100 * (linesCleared > 1 ? linesCleared : 1));
      // Increase speed every 10 lines
      setDropTime(prev => Math.max(100, prev - linesCleared * 10));
    }
    
    return clearedBoard;
  }, []);

  const placePiece = useCallback(() => {
    if (!currentPiece) return;
    
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const boardY = currentPosition.y + y;
          const boardX = currentPosition.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = { filled: true, color: currentPiece.color };
          }
        }
      }
    }
    
    const clearedBoard = clearLines(newBoard);
    setBoard(clearedBoard);
    
    // Create new piece
    const newPiece = createNewPiece();
    const startPos = { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 };
    
    if (!isValidMove(newPiece, startPos, clearedBoard)) {
      setGameOver(true);
      return;
    }
    
    setCurrentPiece(newPiece);
    setCurrentPosition(startPos);
  }, [board, currentPiece, currentPosition, createNewPiece, isValidMove, clearLines]);

  const movePiece = useCallback((direction) => {
    if (!currentPiece || gameOver) return false;
    
    let newPos = { ...currentPosition };
    
    if (direction === 'down') {
      newPos.y += 1;
    } else if (direction === 'left') {
      newPos.x -= 1;
    } else if (direction === 'right') {
      newPos.x += 1;
    }
    
    if (isValidMove(currentPiece, newPos)) {
      setCurrentPosition(newPos);
      return true;
    } else if (direction === 'down') {
      placePiece();
      return false;
    }
    return false;
  }, [currentPiece, currentPosition, gameOver, isValidMove, placePiece]);

  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameOver) return;
    
    const rotated = currentPiece.shape[0].map((_, index) =>
      currentPiece.shape.map(row => row[index]).reverse()
    );
    
    const rotatedPiece = { ...currentPiece, shape: rotated };
    
    if (isValidMove(rotatedPiece, currentPosition)) {
      setCurrentPiece(rotatedPiece);
    }
  }, [currentPiece, currentPosition, gameOver, isValidMove]);

  const hardDrop = useCallback(() => {
    if (!currentPiece || gameOver) return;
    
    let newPos = { ...currentPosition };
    while (isValidMove(currentPiece, { ...newPos, y: newPos.y + 1 })) {
      newPos.y += 1;
    }
    setCurrentPosition(newPos);
    placePiece();
  }, [currentPiece, currentPosition, gameOver, isValidMove, placePiece]);

  const resetGame = useCallback(() => {
    setBoard(Array(BOARD_HEIGHT).fill().map(() => 
      Array(BOARD_WIDTH).fill({ filled: false, color: null })
    ));
    setScore(0);
    setLines(0);
    setGameOver(false);
    setDropTime(1000);
    const newPiece = createNewPiece();
    setCurrentPiece(newPiece);
    setCurrentPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
  }, [createNewPiece]);

  // Initialize first piece
  useEffect(() => {
    if (!currentPiece && !gameOver) {
      const newPiece = createNewPiece();
      setCurrentPiece(newPiece);
      setCurrentPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
    }
  }, [currentPiece, gameOver, createNewPiece]);

  // Game loop
  useEffect(() => {
    if (!gameOver) {
      gameLoopRef.current = setInterval(() => {
        movePiece('down');
      }, dropTime);
      
      return () => clearInterval(gameLoopRef.current);
    }
  }, [movePiece, dropTime, gameOver]);

  // Controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Prevent default behavior for arrow keys to avoid scrolling
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      
      if (gameOver) {
        if (e.key === 'r' || e.key === 'R') {
          resetGame();
        } else if (e.key === 'Escape') {
          onExit();
        }
        return;
      }
      
      switch (e.key) {
        case 'ArrowDown':
          movePiece('down');
          break;
        case 'ArrowLeft':
          movePiece('left');
          break;
        case 'ArrowRight':
          movePiece('right');
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
        case ' ':
          hardDrop();
          break;
        case 'Escape':
          onExit();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver, movePiece, rotatePiece, hardDrop, resetGame, onExit]);

  // Render board with current piece
  const renderBoard = () => {
    const displayBoard = board.map(row => row.map(cell => ({ ...cell })));
    
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPosition.y + y;
            const boardX = currentPosition.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = { filled: true, color: currentPiece.color };
            }
          }
        }
      }
    }
    
    return displayBoard;
  };

  return (
    <div className="text-center">
      <div className="text-cyan-400 mb-2 text-2xl">🧱 TETRIS 🧱</div>
      
      <div className="flex justify-center gap-8 mb-4">
        <div className="text-green-400">Score: {score}</div>
        <div className="text-yellow-400">Lines: {lines}</div>
        <div className="text-purple-400">Level: {Math.floor(lines / 10) + 1}</div>
      </div>
      
      <div 
        className="mx-auto border-2 border-gray-600 bg-gray-900 p-1"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, 18px)`,
          gap: '1px',
          width: 'fit-content'
        }}
      >
        {renderBoard().flat().map((cell, index) => (
          <div
            key={index}
            className="w-4 h-4 border border-gray-700"
            style={{
              backgroundColor: cell.filled ? cell.color : '#1f2937'
            }}
          />
        ))}
      </div>
      
      {gameOver && (
        <div className="mt-4 text-red-400">
          <div className="text-xl">GAME OVER!</div>
          <div className="text-lg mt-1">Final Score: {score}</div>
          <div className="text-lg">Lines Cleared: {lines}</div>
          <div className="text-sm mt-2">Press R to restart or ESC to exit</div>
        </div>
      )}
      
      {!gameOver && (
        <div className="text-sm text-gray-400 mt-4">
          ← → ↓ to move • ↑ to rotate • SPACE for hard drop • ESC to exit
        </div>
      )}
    </div>
  );
};

export default TetrisGame;