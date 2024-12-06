import React, { useState } from 'react';
import './App.css';

const Cell = ({ row, col, isStart, isEnd, isWall, isPath, onClick }) => {
  const getClassName = () => {
    if (isStart) return 'cell start';
    if (isEnd) return 'cell end';
    if (isWall) return 'cell wall';
    if (isPath) return 'cell path';
    return 'cell';
  };

  return (
    <div
      className={getClassName()}
      onClick={() => onClick(row, col)} 
    ></div>
  );
};

function App() {
  const gridSize = 10;
  const [grid, setGrid] = useState(createEmptyGrid(gridSize));
  const [start, setStart] = useState([0, 0]);
  const [end, setEnd] = useState([gridSize - 1, gridSize - 1]);
  const [isWall, setIsWall] = useState(false);
  const [message, setMessage] = useState('');
  

  function createEmptyGrid(size) {
    return Array(size)
      .fill()
      .map(() => Array(size).fill({ isWall: false, isPath: false }));
  }


  const handleCellClick = (row, col) => {
    if (start[0] === row && start[1] === col) {
      return;  
    }
    if (end[0] === row && end[1] === col) {
      return;  
    }

    const newGrid = grid.map((r, rIdx) =>
      rIdx === row
        ? r.map((cell, cIdx) => (cIdx === col ? { ...cell, isWall: !cell.isWall } : cell))
        : r
    );

    setGrid(newGrid); 
  };

  const bfs = (grid, start, end) => {
    const directions = [
      [0, 1], [1, 0], [0, -1], [-1, 0],
    ];

    const queue = [start];
    const visited = new Set();
    const previous = {};

    visited.add(start.toString());

    while (queue.length > 0) {
      const [row, col] = queue.shift();

      if (row === end[0] && col === end[1]) {
        let path = [];
        let current = end;
        while (current) {
          path.unshift(current);
          current = previous[current.toString()];
        }
        return path;
      }

      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (
          newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length &&
          !visited.has([newRow, newCol].toString()) && !grid[newRow][newCol].isWall
        ) {
          visited.add([newRow, newCol].toString());
          queue.push([newRow, newCol]);
          previous[[newRow, newCol].toString()] = [row, col];
        }
      }
    }

    return [];
  };

  
  const handleFindPath = () => {
    const path = bfs(grid, start, end);
    if (path.length > 0) {
      const newGrid = [...grid];
      path.forEach(([row, col]) => {
        newGrid[row][col].isPath = true;
      });
      setGrid(newGrid);
      setMessage('Yay! Path Found!');
    } else {
      setMessage('Oops! No Path Found!');
    }
  };


  const resetGame = () => {
    setGrid(createEmptyGrid(gridSize));
    setMessage('');
    setStart([0, 0]);
    setEnd([gridSize - 1, gridSize - 1]);
  };

  return (
    <div className="App">
      <h1>Maze Game / Pathfinding Visualization</h1>
      <div className="controls">
        <button onClick={() => setIsWall(!isWall)}>
          {isWall ? 'Set Start/End' : 'Set Walls'}
        </button>
        <button onClick={handleFindPath}>Find Path</button>
        <button onClick={resetGame}>Reset Game</button>
      </div>
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((cell, colIndex) => (
              <Cell
                key={colIndex}
                row={rowIndex}
                col={colIndex}
                isStart={start[0] === rowIndex && start[1] === colIndex}
                isEnd={end[0] === rowIndex && end[1] === colIndex}
                isWall={cell.isWall}
                isPath={cell.isPath}
                onClick={handleCellClick}
              />
            ))}
          </div>
        ))}
      </div>
      {message && <div className="success-message">{message}</div>}
    </div>
  );
}

export default App;
