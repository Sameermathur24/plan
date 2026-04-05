class Shape {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.baseX = this.x;
    this.baseY = this.y;
    this.size = Math.random() * 20 + 20;
    this.density = (Math.random() * 30) + 1;
    this.type = Math.floor(Math.random() * 3); // 0: circle, 1: square, 2: crane
    this.color = ['#FFD700', '#FF4500', '#1E90FF', '#32CD32', '#FF69B4'][Math.floor(Math.random() * 5)];
    this.angle = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.02;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    
    this.ctx.save();
    this.ctx.translate(this.x, this.y);
    this.ctx.rotate(this.angle);

    if (this.type === 0) {
      // Circle
      this.ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
    } else if (this.type === 1) {
      // Square
      this.ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
    } else {
      // Simple Paper Crane Silhouette
      this.ctx.moveTo(0, -this.size / 2);
      this.ctx.lineTo(this.size / 2, 0);
      this.ctx.lineTo(0, this.size / 4);
      this.ctx.lineTo(-this.size / 2, 0);
      this.ctx.closePath();
      
      // Wings
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(this.size * 0.6, -this.size * 0.3);
      this.ctx.lineTo(this.size * 0.2, 0);
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(-this.size * 0.6, -this.size * 0.3);
      this.ctx.lineTo(-this.size * 0.2, 0);
    }

    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.restore();
  }

  update(mouse) {
    // Floating movement
    this.angle += this.spin;
    this.baseY += Math.sin(Date.now() * 0.001 + this.baseX) * 0.2;
    this.baseX += Math.cos(Date.now() * 0.001 + this.baseY) * 0.2;

    // Interaction
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;

    if (distance < mouse.radius) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 10;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 10;
      }
    }
  }
}

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let shapes = [];
const mouse = {
  x: null,
  y: null,
  radius: 150
}

window.addEventListener('mousemove', (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

function init() {
  shapes = [];
  const numberOfShapes = (canvas.width * canvas.height) / 15000;
  for (let i = 0; i < numberOfShapes; i++) {
    shapes.push(new Shape(canvas, ctx));
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < shapes.length; i++) {
    shapes[i].update(mouse);
    shapes[i].draw();
  }
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

init();
animate();
