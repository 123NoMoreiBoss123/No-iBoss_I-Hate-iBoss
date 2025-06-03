// 6dcube.js
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.getElementById("cube-container").appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const points = [];

// Generate all 64 points of a 6D hypercube (2^6)
for (let i = 0; i < 64; i++) {
  const coords = [];
  for (let j = 0; j < 6; j++) {
    coords.push((i >> j) & 1 ? 1 : -1);
  }
  points.push(coords);
}

// Rotation matrix helpers
function rotate(point, dim1, dim2, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const temp1 = point[dim1] * c - point[dim2] * s;
  const temp2 = point[dim1] * s + point[dim2] * c;
  point[dim1] = temp1;
  point[dim2] = temp2;
}

// Project 6D point to 2D
function project(point) {
  // Copy the point so original isn't modified
  const p = [...point];

  // Apply rotations in several planes
  rotate(p, 0, 1, time * 0.3);
  rotate(p, 2, 3, time * 0.2);
  rotate(p, 4, 5, time * 0.4);
  rotate(p, 0, 2, time * 0.1);
  rotate(p, 1, 5, time * 0.15);

  // Project 6D → 3D
  let scale3d = 300 / (4 + p[5]); // Perspective
  let x3d = p[0] * scale3d;
  let y3d = p[1] * scale3d;
  let z3d = p[2] * scale3d;

  // Project 3D → 2D
  let scale2d = 300 / (4 + z3d);
  return {
    x: canvas.width / 2 + x3d * scale2d,
    y: canvas.height / 2 + y3d * scale2d
  };
}

let time = 0;
function draw() {
  time += 0.01;
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const projected = points.map(project);

  ctx.fillStyle = "white";
  for (let i = 0; i < projected.length; i++) {
    const p = projected[i];
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

draw();

