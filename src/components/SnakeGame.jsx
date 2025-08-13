import { useState, useRef, useEffect, useCallback } from "react";

const SnakeGame = ({ onExit }) => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const gameLoopRef = useRef();

  const BOARD_SIZE = 20;
  const CELL_SIZE = 12; // px (smaller than before)

  const generateFood = useCallback((snakePositions) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
    } while (
      snakePositions.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
    );
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    const startSnake = [{ x: 10, y: 10 }];
    setSnake(startSnake);
    setFood(generateFood(startSnake));
    setDirection({ x: 0, y: 0 });
    setGameOver(false);
    setScore(0);
    setGameStarted(false);
  }, [generateFood]);

  const moveSnake = useCallback(() => {
    if (gameOver || !gameStarted) return;

    setSnake((currentSnake) => {
      if (direction.x === 0 && direction.y === 0) return currentSnake;

      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };

      head.x += direction.x;
      head.y += direction.y;

      // Wall collision
      if (
        head.x < 0 ||
        head.x >= BOARD_SIZE ||
        head.y < 0 ||
        head.y >= BOARD_SIZE
      ) {
        setGameOver(true);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Self collision
      if (
        newSnake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        return currentSnake;
      }

      // Food collision
      if (head.x === food.x && head.y === food.y) {
        setScore((prev) => prev + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, gameStarted, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Prevent scroll when using arrow keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver) {
        if (e.key.toLowerCase() === "r") {
          resetGame();
        } else if (e.key === "Escape") {
          onExit();
        }
        return;
      }

      if (!gameStarted && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        setGameStarted(true);
      }

      switch (e.key) {
        case "ArrowUp":
          setDirection((prevDir) => (prevDir.y === 1 ? prevDir : { x: 0, y: -1 }));
          break;
        case "ArrowDown":
          setDirection((prevDir) => (prevDir.y === -1 ? prevDir : { x: 0, y: 1 }));
          break;
        case "ArrowLeft":
          setDirection((prevDir) => (prevDir.x === 1 ? prevDir : { x: -1, y: 0 }));
          break;
        case "ArrowRight":
          setDirection((prevDir) => (prevDir.x === -1 ? prevDir : { x: 1, y: 0 }));
          break;
        case "Escape":
          onExit();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction, gameOver, gameStarted, onExit, resetGame]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, 200);
      return () => clearInterval(gameLoopRef.current);
    }
  }, [moveSnake, gameStarted, gameOver]);

  return (
    <div className="text-center">
      <div className="text-yellow-400 mb-2 text-xl">🐍 SNAKE GAME 🐍</div>
      <div className="text-green-400 mb-4 text-base">Score: {score}</div>

      <div
        className="mx-auto border-2 border-gray-600 bg-gray-900 p-1"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${BOARD_SIZE}, ${CELL_SIZE}px)`,
          gap: "1px",
          width: "fit-content",
        }}
      >
        {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => {
          const x = index % BOARD_SIZE;
          const y = Math.floor(index / BOARD_SIZE);
          const isSnakeHead =
            snake.length > 0 && snake[0].x === x && snake[0].y === y;
          const isSnakeBody = snake
            .slice(1)
            .some((segment) => segment.x === x && segment.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={index}
              className={`w-3 h-3 ${
                isSnakeHead
                  ? "bg-green-300"
                  : isSnakeBody
                  ? "bg-green-500"
                  : isFood
                  ? "bg-red-500"
                  : "bg-gray-800"
              }`}
            />
          );
        })}
      </div>

      {!gameStarted && !gameOver && (
        <div className="mt-3 text-cyan-400 text-sm">
          <div>Press any arrow key to start!</div>
          <div className="text-xs text-gray-400 mt-1">ESC to exit</div>
        </div>
      )}

      {gameOver && (
        <div className="mt-3 text-red-400 text-sm">
          <div className="text-lg">GAME OVER!</div>
          <div className="mt-1">Final Score: {score}</div>
          <div className="mt-1 text-xs">Press R to restart or ESC to exit</div>
        </div>
      )}

      {gameStarted && !gameOver && (
        <div className="text-xs text-gray-400 mt-3">
          Use arrow keys to move • ESC to exit
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
