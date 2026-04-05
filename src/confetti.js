export function triggerConfetti() {
  const count = 30;
  const colors = ['#FFD700', '#FF4500', '#1E90FF', '#32CD32', '#FF69B4'];
  const container = document.body;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 10 + 5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.position = 'fixed';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.border = '1px solid #000';
    particle.style.zIndex = '100';
    particle.style.pointerEvents = 'none';
    
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 10 + 5;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    container.appendChild(particle);
    
    let x = startX;
    let y = startY;
    let opacity = 1;
    
    function animate() {
      x += vx;
      y += vy + 0.5; // gravity
      opacity -= 0.02;
      
      particle.style.transform = `translate(${x - startX}px, ${y - startY}px) rotate(${x}deg)`;
      particle.style.opacity = opacity;
      
      if (opacity > 0) {
        requestAnimationFrame(animate);
      } else {
        particle.remove();
      }
    }
    
    animate();
  }
}
