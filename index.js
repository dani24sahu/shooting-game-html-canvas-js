// Creating canvas
const canvas = document.createElement("canvas");

// Appending canvas to HTML div
document.querySelector(".myGame").appendChild(canvas);

canvas.width = innerWidth;
canvas.height = innerHeight;

// Creating Canvas Context
const context = canvas.getContext("2d");
const lightWeaponDamage = 10;
const heavyWeaponDamage = 30;
let difficulty = 2;
const form = document.querySelector("form");
const scoreBoard = document.querySelector(".scoreBoard");

// Evennt listener for difficulty form
document.querySelector("input").addEventListener("click", (e) => {
  e.preventDefault();
  // Making form invisible
  form.style.display = "none";
  // Making scoreboard visible
  scoreBoard.style.display = "block";
  // etting difficulty selected by user
  const userValue = document.getElementById("difficulty").value;

  if (userValue === "Easy") {
    setInterval(spawnEnemy, 2000);
    return (difficulty = 5);
  }
  if (userValue === "Mid") {
    setInterval(spawnEnemy, 1400);
    return (difficulty = 8);
  }
  if (userValue === "Hard") {
    setInterval(spawnEnemy, 1000);
    return (difficulty = 10);
  }
  if (userValue === "Insane") {
    setInterval(spawnEnemy, 700);
    return (difficulty = 12);
  }
});

//------------------------------------------------- Creating Player, Enemy, Weapon, and other classes----------------------
// Defining Player Position in center
playerPosition = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};
// Creating Player Class
class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  // Creating an Arc and drawing it with draw()
  draw() {
    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;
    context.fill();
  }
}

//--------------------------------
// Creating Weapon Class
class Weapon {
  constructor(x, y, radius, color, velocity, damage) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.damage = damage;
  }

  // Creating an Arc and drawing it with draw()
  draw() {
    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;
    context.fill();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

//--------------------------------
// Creating Enemy Class
class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  // Creating an Arc and drawing it with draw()
  draw() {
    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;
    context.fill();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

// Creating Particle Class
const friction = 0.99;
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  // Creating an Arc and drawing it with draw()
  draw() {
    context.save();
    context.globalAlpha = this.alpha;
    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;
    context.fill();
    context.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01;
  }
}

//---------------------------------------Main Logic---------------------------------------------
// Creating Player Object, weapons array, enemiies array, and others
const dani = new Player(playerPosition.x, playerPosition.y, 15, "white");
// Weapons array
const weapons = [];
// Enemy Array
const enemies = [];
// Particle Array
const particles = [];

// -----------------Function to Spawn Enemy at Random location-------------------
const spawnEnemy = () => {
  // Generating random size for enemy
  const enemySize = Math.random() * (40 - 5) + 5; // enemySize ranges 40 to 45
  // Generating random color fro enemy
  const enemyColor = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;

  // Random enemy spawn position
  let random;
  // Making enemy postion random but only from outside screen
  if (Math.random() < 0.5) {
    // Making x eqaul to very left off of screen or very right off of screen and setting Y t anywhere vertically
    random = {
      x: Math.random() < 0.5 ? canvas.width + enemySize : 0 - enemySize,
      y: Math.random() * canvas.height,
    };
  } else {
    // Making Y equal to very up off of screen or very down off of screen and setting x to anywhere horizontally
    random = {
      x: Math.random() * canvas.width,
      y: Math.random() < 0.5 ? canvas.height + enemySize : 0 - enemySize,
    };
  }

  // finding angle with A-tan-2 method
  // angle between center (means Player position) and enemy position
  const myAngle = Math.atan2(
    canvas.height / 2 - random.y,
    canvas.width / 2 - random.x
  );
  // Making velocity or speed of enemy by multiplying chosen difficulty to radian
  const velocity = {
    x: Math.cos(myAngle) * difficulty,
    y: Math.sin(myAngle) * difficulty,
  };

  // Adding enemy to enemies array
  enemies.push(new Enemy(random.x, random.y, enemySize, enemyColor, velocity));
};

// -----------------Creating a recursive function for animation-------------
let animationId;
function animation() {
  // Making recursion
  animationId = requestAnimationFrame(animation);

  // clearing stroke in rectangle form but imagine it as a new rectangle
  // means clearing canvas on each frame
  context.fillStyle = "rgb(49,49,49, 0.2)";

  context.fillRect(0, 0, canvas.width, canvas.height);
  // Drawing player
  dani.draw();

  // Generating Particles
  particles.forEach((particle, particleIndex) => {
    if (particle.alpha <= 0) {
      particles.splice(particleIndex, 1);
    } else {
      particle.update();
    }
  });

  // Generating bullets
  weapons.forEach((weapon, weaponIndex) => {
    weapon.update();
    //Remmoving weapons if they are off screen
    if (
      weapon.x + weapon.radius < 1 ||
      weapon.y + weapon.radius < 1 ||
      weapon.x - weapon.radius > canvas.width ||
      weapon.y - weapon.radius > canvas.height
    ) {
      weapons.splice(weaponIndex, 1);
    }
  });
  // Generating enemies
  enemies.forEach((enemy, enemyIndex) => {
    enemy.update();

    //  Finding distance between Player and Enemy
    const distanceBetweenPlayerAndEnemy = Math.hypot(
      dani.x - enemy.x,
      dani.y - enemy.y
    );

    // Stopping game if Enemy hits Player
    if (distanceBetweenPlayerAndEnemy - dani.radius - enemy.radius < 1) {
      cancelAnimationFrame(animationId);
    }

    weapons.forEach((weapon, weaponIndex) => {
      //  Finding distance between Weapon and Enemy
      const distanceBetweenWeaponAndEnemy = Math.hypot(
        weapon.x - enemy.x,
        weapon.y - enemy.y
      );
      // Here adding enemy killing transitions with gsap plugin
      if (distanceBetweenWeaponAndEnemy - weapon.radius - enemy.radius < 1) {
        // Reducing size of Enemy on hit
        if (enemy.radius > weapon.damage + 5) {
          gsap.to(enemy, {
            radius: enemy.radius - weapon.damage,
          });
          setTimeout(() => {
            weapons.splice(weaponIndex, 1);
          }, 0);
        }
        // Removing Enemy on hit if they are below 18
        else {
          for (let i = 0; i < enemy.radius * 5; i++) {
            particles.push(
              new Particle(weapon.x, weapon.y, Math.random() * 2, enemy.color, {
                x: (Math.random() - 0.5) * (Math.random() * 7),
                y: (Math.random() - 0.5) * (Math.random() * 7),
              })
            );
          }
          setTimeout(() => {
            enemies.splice(enemyIndex, 1);
            weapons.splice(weaponIndex, 1);
          }, 0);
        }
      }
    });
  });
}

// ----------Adding Event Listeners----------------------------------

// Event listener for Light weapon(left click)
canvas.addEventListener("click", (e) => {
  // finding angle with A-tan-2 method
  // angle between player position(center) and click co-ordinates
  const myAngle = Math.atan2(
    e.clientY - canvas.height / 2,
    e.clientX - canvas.width / 2
  );
  // Making variable for light weapon
  const velocity = {
    x: Math.cos(myAngle) * 6,
    y: Math.sin(myAngle) * 6,
  };
  // Adding light weapon in weapons array
  weapons.push(
    new Weapon(
      canvas.width / 2,
      canvas.height / 2,
      6,
      "white",
      velocity,
      lightWeaponDamage
    )
  );
});

// Event listener for Heavy weapon(Right click)
canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  // finding angle with A-tan-2 method
  // angle between player position(center) and click co-ordinates
  const myAngle = Math.atan2(
    e.clientY - canvas.height / 2,
    e.clientX - canvas.width / 2
  );
  // Making variable for light weapon
  const velocity = {
    x: Math.cos(myAngle) * 3,
    y: Math.sin(myAngle) * 3,
  };
  // Adding light weapon in weapons array
  weapons.push(
    new Weapon(
      canvas.width / 2,
      canvas.height / 2,
      18,
      "cyan",
      velocity,
      heavyWeaponDamage
    )
  );
});

animation();
