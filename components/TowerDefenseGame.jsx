'use client';

import { useEffect, useRef, useState } from 'react';

export default function TowerDefenseGame() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const gameStateRef = useRef({
    player: { x: 0, y: 0, width: 60, height: 15 },
    bullets: [],
    enemies: [],
    lastEnemySpawn: 0,
    keys: {},
    animationId: null,
    score: 0,
    lives: 3,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const gameState = gameStateRef.current;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Initialize player
    gameState.player.x = canvas.width / 2 - 30;
    gameState.player.y = canvas.height - 40;

    // Keyboard controls
    const handleKeyDown = (e) => {
      gameState.keys[e.key] = true;
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        shootBullet();
      }
    };

    const handleKeyUp = (e) => {
      gameState.keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Shoot bullet
    const shootBullet = () => {
      gameState.bullets.push({
        x: gameState.player.x + gameState.player.width / 2 - 2,
        y: gameState.player.y,
        width: 4,
        height: 10,
        speed: 7,
      });
    };

    // Spawn enemy
    const spawnEnemy = () => {
      const size = 30 + Math.random() * 20;
      gameState.enemies.push({
        x: Math.random() * (canvas.width - size),
        y: -size,
        width: size,
        height: size,
        speed: 1 + Math.random() * 2,
        type: Math.random() > 0.5 ? 'book' : 'thief',
      });
    };

    // Game loop
    const gameLoop = (timestamp) => {
      if (gameState.lives <= 0) {
        setGameOver(true);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Move player
      if (gameState.keys['ArrowLeft'] && gameState.player.x > 0) {
        gameState.player.x -= 5;
      }
      if (gameState.keys['ArrowRight'] && gameState.player.x < canvas.width - gameState.player.width) {
        gameState.player.x += 5;
      }

      // Draw player (library tower)
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(gameState.player.x, gameState.player.y, gameState.player.width, gameState.player.height);
      ctx.fillStyle = '#60a5fa';
      ctx.fillRect(gameState.player.x + 5, gameState.player.y - 10, gameState.player.width - 10, 10);
      
      // Draw player emoji
      ctx.font = '30px Arial';
      ctx.fillText('📚', gameState.player.x + 15, gameState.player.y - 15);

      // Spawn enemies
      if (timestamp - gameState.lastEnemySpawn > 1500) {
        spawnEnemy();
        gameState.lastEnemySpawn = timestamp;
      }

      // Update and draw bullets
      gameState.bullets = gameState.bullets.filter(bullet => {
        bullet.y -= bullet.speed;
        
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        
        return bullet.y > 0;
      });

      // Update and draw enemies
      gameState.enemies = gameState.enemies.filter(enemy => {
        enemy.y += enemy.speed;

        // Draw enemy
        ctx.fillStyle = enemy.type === 'book' ? '#ef4444' : '#8b5cf6';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        // Draw emoji
        ctx.font = `${enemy.width * 0.7}px Arial`;
        ctx.fillText(enemy.type === 'book' ? '📖' : '🦹', enemy.x + 5, enemy.y + enemy.height - 5);

        // Check collision with bullets
        for (let i = gameState.bullets.length - 1; i >= 0; i--) {
          const bullet = gameState.bullets[i];
          if (
            bullet.x < enemy.x + enemy.width &&
            bullet.x + bullet.width > enemy.x &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y + bullet.height > enemy.y
          ) {
            gameState.bullets.splice(i, 1);
            gameState.score += 10;
            setScore(gameState.score);
            return false; // Remove enemy
          }
        }

        // Check if enemy reached bottom
        if (enemy.y > canvas.height) {
          gameState.lives--;
          setLives(gameState.lives);
          return false;
        }

        return true;
      });

      gameState.animationId = requestAnimationFrame(gameLoop);
    };

    gameState.animationId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (gameState.animationId) {
        cancelAnimationFrame(gameState.animationId);
      }
    };
  }, []);

  const resetGame = () => {
    const gameState = gameStateRef.current;
    gameState.score = 0;
    gameState.lives = 3;
    gameState.bullets = [];
    gameState.enemies = [];
    setScore(0);
    setLives(3);
    setGameOver(false);
    
    // Restart game loop
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    gameState.animationId = requestAnimationFrame(function loop(timestamp) {
      if (gameState.lives <= 0) {
        setGameOver(true);
        return;
      }
      // Game loop logic here (same as above)
      gameState.animationId = requestAnimationFrame(loop);
    });
  };

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-gray-900"
        style={{ display: 'block' }}
      />
      
      {/* HUD Overlay */}
      <div className="absolute top-4 left-4 text-white font-mono text-sm pointer-events-none">
        SCORE: {score.toString().padStart(4, '0')}
      </div>
      <div className="absolute top-4 right-4 text-white font-mono text-sm pointer-events-none">
        LIVES: {Array(lives).fill('♥').join(' ')}
      </div>

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-white mb-4">Game Over!</h3>
            <p className="text-2xl text-gray-300 mb-8">Final Score: {score}</p>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-white text-gray-900 font-bold hover:bg-gray-200 transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
