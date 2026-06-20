import React, { useEffect, useRef, useState } from 'react';

const Raycaster: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed internal resolution for that retro feel
    const width = 320;
    const height = 200;
    
    // Create an image data buffer
    let imageData = ctx.createImageData(width, height);

    // Map definition
    const mapWidth = 8;
    const mapHeight = 8;
    const worldMap = [
      [1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,1],
      [1,0,1,0,0,2,0,1],
      [1,0,1,0,0,0,0,1],
      [1,0,1,1,0,2,0,1],
      [1,0,0,0,0,2,0,1],
      [1,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1],
    ];

    // Player state
    let posX = 3.5, posY = 3.5;  // x and y start position
    let dirX = -1, dirY = 0; // initial direction vector
    let planeX = 0, planeY = 0.66; // the 2d raycaster version of camera plane

    let lastTime = performance.now();
    let animationFrameId: number;

    const keys: { [key: string]: boolean } = {
      ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false,
      w: false, a: false, s: false, d: false
    };

    const handleKeyDown = (e: KeyboardEvent) => { keys[e.key] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keys[e.key] = false; };

    // Need to focus canvas to get key events. Or add window listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const drawLine = (x: number, drawStart: number, drawEnd: number, color: [number, number, number]) => {
      for (let y = drawStart; y < drawEnd; y++) {
        const index = (y * width + x) * 4;
        imageData.data[index] = color[0];
        imageData.data[index + 1] = color[1];
        imageData.data[index + 2] = color[2];
        imageData.data[index + 3] = 255;
      }
    };

    const render = () => {
      const currentTime = performance.now();
      const frameTime = (currentTime - lastTime) / 1000.0;
      lastTime = currentTime;

      // Clear screen
      for (let i = 0; i < width * height * 4; i += 4) {
        let isFloor = Math.floor((i / 4) / width) >= height / 2;
        imageData.data[i] = isFloor ? 30 : 10;
        imageData.data[i+1] = isFloor ? 30 : 10;
        imageData.data[i+2] = isFloor ? 30 : 10;
        imageData.data[i+3] = 255;
      }

      for (let x = 0; x < width; x++) {
        // calculate ray position and direction
        let cameraX = 2 * x / width - 1; // x-coordinate in camera space
        let rayDirX = dirX + planeX * cameraX;
        let rayDirY = dirY + planeY * cameraX;

        // which box of the map we're in
        let mapX = Math.floor(posX);
        let mapY = Math.floor(posY);

        // length of ray from current position to next x or y-side
        let sideDistX;
        let sideDistY;

        // length of ray from one x or y-side to next x or y-side
        let deltaDistX = (rayDirX === 0) ? 1e30 : Math.abs(1 / rayDirX);
        let deltaDistY = (rayDirY === 0) ? 1e30 : Math.abs(1 / rayDirY);
        let perpWallDist;

        // what direction to step in x or y-direction (either +1 or -1)
        let stepX;
        let stepY;

        let hit = 0; // was there a wall hit?
        let side = 0; // was a NS or a EW wall hit?

        if (rayDirX < 0) {
          stepX = -1;
          sideDistX = (posX - mapX) * deltaDistX;
        } else {
          stepX = 1;
          sideDistX = (mapX + 1.0 - posX) * deltaDistX;
        }
        if (rayDirY < 0) {
          stepY = -1;
          sideDistY = (posY - mapY) * deltaDistY;
        } else {
          stepY = 1;
          sideDistY = (mapY + 1.0 - posY) * deltaDistY;
        }

        // perform DDA
        while (hit === 0) {
          if (sideDistX < sideDistY) {
            sideDistX += deltaDistX;
            mapX += stepX;
            side = 0;
          } else {
            sideDistY += deltaDistY;
            mapY += stepY;
            side = 1;
          }
          if (worldMap[mapX][mapY] > 0) hit = 1;
        }

        if (side === 0) perpWallDist = (sideDistX - deltaDistX);
        else perpWallDist = (sideDistY - deltaDistY);

        let lineHeight = Math.floor(height / perpWallDist);

        let drawStart = -lineHeight / 2 + height / 2;
        if (drawStart < 0) drawStart = 0;
        let drawEnd = lineHeight / 2 + height / 2;
        if (drawEnd >= height) drawEnd = height - 1;

        let colorVal = worldMap[mapX][mapY];
        let color: [number, number, number];
        
        switch (colorVal) {
          case 1: color = [255, 0, 0]; break;
          case 2: color = [255, 255, 255]; break;
          default: color = [0, 255, 0]; break;
        }

        if (side === 1) {
          color = [color[0] / 2, color[1] / 2, color[2] / 2];
        }

        drawLine(x, Math.floor(drawStart), Math.floor(drawEnd), color);
      }

      ctx.putImageData(imageData, 0, 0);

      // speed modifiers
      let moveSpeed = frameTime * 3.0;
      let rotSpeed = frameTime * 2.0;

      // move forward
      if (keys['w'] || keys['ArrowUp']) {
        if(worldMap[Math.floor(posX + dirX * moveSpeed)][Math.floor(posY)] == 0) posX += dirX * moveSpeed;
        if(worldMap[Math.floor(posX)][Math.floor(posY + dirY * moveSpeed)] == 0) posY += dirY * moveSpeed;
      }
      // move backwards
      if (keys['s'] || keys['ArrowDown']) {
        if(worldMap[Math.floor(posX - dirX * moveSpeed)][Math.floor(posY)] == 0) posX -= dirX * moveSpeed;
        if(worldMap[Math.floor(posX)][Math.floor(posY - dirY * moveSpeed)] == 0) posY -= dirY * moveSpeed;
      }
      // rotate right
      if (keys['d'] || keys['ArrowRight']) {
        let oldDirX = dirX;
        dirX = dirX * Math.cos(-rotSpeed) - dirY * Math.sin(-rotSpeed);
        dirY = oldDirX * Math.sin(-rotSpeed) + dirY * Math.cos(-rotSpeed);
        let oldPlaneX = planeX;
        planeX = planeX * Math.cos(-rotSpeed) - planeY * Math.sin(-rotSpeed);
        planeY = oldPlaneX * Math.sin(-rotSpeed) + planeY * Math.cos(-rotSpeed);
      }
      // rotate left
      if (keys['a'] || keys['ArrowLeft']) {
        let oldDirX = dirX;
        dirX = dirX * Math.cos(rotSpeed) - dirY * Math.sin(rotSpeed);
        dirY = oldDirX * Math.sin(rotSpeed) + dirY * Math.cos(rotSpeed);
        let oldPlaneX = planeX;
        planeX = planeX * Math.cos(rotSpeed) - planeY * Math.sin(rotSpeed);
        planeY = oldPlaneX * Math.sin(rotSpeed) + planeY * Math.cos(rotSpeed);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying]);

  return (
    <div className="w-full h-full relative group cursor-pointer flex flex-col items-center overflow-hidden" onClick={() => setIsPlaying(true)}>
      {isPlaying ? (
        <canvas 
          ref={canvasRef} 
          width={320} 
          height={200} 
          className="w-full h-full object-cover rendering-pixelated outline-none" 
          tabIndex={0}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black hover:bg-white/5 transition duration-300">
           <h2 className="text-xl md:text-3xl font-mono uppercase tracking-[0.3em] font-bold text-white group-hover:text-red-500 transition-colors">
              CLICK_TO_RUN
           </h2>
        </div>
      )}
      <div className="absolute top-0 left-0 right-0 p-2 border-b border-white/20 flex justify-between font-mono text-[10px] text-gray-500 z-10 bg-black/80">
        <span>FPS_RAYCASTER_ENGINE</span>
        <span>WASD_TO_MOVE</span>
      </div>
    </div>
  );
};

export default Raycaster;
