let rangeStart = 1;
let rangeEnd = 50;
let correct;
let level5Lives = 3;
let level5Score = 0;
let level5Time = 30;
let level5TimerInterval;

document.addEventListener("DOMContentLoaded", () => {
let soundOn = true;
let vibrationOn = true;




  const settingsBtn = document.getElementById('settingsBtn');
  const toggleSound = document.getElementById('toggleSound');
  const toggleVibration = document.getElementById('toggleVibration');
  const settingsPanel = document.getElementById('settingsPanel');

    settingsBtn.addEventListener("click", () => {
    console.log("⚙️ settingsBtn clicked!"); 
    settingsPanel.classList.toggle("hidden");
  });



  toggleSound.addEventListener('click', () => {
    soundOn = !soundOn;
    toggleSound.textContent = soundOn ? '🔊' : '🔇';
  });

  toggleVibration.addEventListener('click', () => {
    vibrationOn = !vibrationOn;
    toggleVibration.textContent = vibrationOn ? '📳' : '❌';
  });
});



const startSound = new Audio('sounds/startgame.mp3');
const clickSound = new Audio('sounds/click-234708.mp3');
const failSound = new Audio('sounds/spin-fail-295088.mp3');

const levelSounds = {
  1: new Audio('sounds/level1.mp3'),
  2: new Audio('sounds/level2.mp3'),
  3: new Audio('sounds/level3.mp3'),
  4: new Audio('sounds/level4.mp3')
};
    function startGame() {
      if (soundOn) clickSound.play();


  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameContainer").style.display = "block";

  updateBackground(level); 
  loadProgress();
  startTimer();
  updateLivesDisplay();
}

    let level = 1;
    let maxNumber = 20;
    let randomNumber = Math.floor(Math.random() * maxNumber) + 1;
    let attempts = 0;
    let lives = 5;
    let score = 0;
    let timer;
    let timeLeft = 50;

function getLevelData(level) {
  switch (level) {
    case 1:
      return { max: 20, lives: 5, title: "Level 1: The Beginning 🌱" };
    case 2:
      return { max: 30, lives: 5, title: "Level 2: Dark Forest 🌲" };
    case 3:
      return { max: 50, lives: 5, title: "Level 3: Dragon's Den 🔥" };
    case 4:
      return { max: 70, lives: 5, title: "Level 4: Crystal Gate 🗻" };
    default:
      return { max: 100, lives: 5, title: "Level 5: Follow the Intuition" };
  }
}


    function updateLivesDisplay() {
      const heart = "❤️";
      document.getElementById("lives").innerText = heart.repeat(lives);
    }

function updateBackground(level) {
  document.body.className = `level-${level}`;

  
  Object.values(levelSounds).forEach(sound => {
    sound.pause();
    sound.currentTime = 0;
  });

  
  if (levelSounds[level]) {
    levelSounds[level].loop = true;
    levelSounds[level].play().catch((err) => {
      console.warn("🔇 Level sound autoplay was blocked:", err);
    });
  }


  
  if (soundOn && levelSounds[level]) {
    levelSounds[level].loop = true;
    levelSounds[level].play();
  }
  
}

    function startTimer() {
      clearInterval(timer);
      document.getElementById("timer").innerText = `⏱️ Time left: ${timeLeft}s`;
      timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = `⏱️ Time left: ${timeLeft}s`;
        if (timeLeft <= 0) {
          clearInterval(timer);
          lives--;
          updateLivesDisplay();
          const message = document.getElementById("message");
          if (lives <= 0) {
            clearInterval(timer);
            message.innerHTML = `👻 Game Over! You lost all lives.<br>✅ The correct number was: ${randomNumber}`;
            message.style.color = "black";
            document.getElementById("gameButton").disabled = true;
            return;
          } else {
            message.innerHTML = "⏰ Time's up! You lost 1 life.";
            message.style.color = "orange";
            startTimer();
          }
        }
      }, 1000);
    }

    function saveProgress() {
      localStorage.setItem("highScore", score);
      localStorage.setItem("lastLevel", level);
      localStorage.setItem("completedLevel", level - 1);
    }

  function loadProgress() {
  const savedScore = localStorage.getItem("highScore");
  const completedLevel = localStorage.getItem("completedLevel");

  if (savedScore) {
    score = parseInt(savedScore);
    document.getElementById("score").innerText = `🏆 High Score: ${score}`;
  }

  if (completedLevel) {
    level = parseInt(completedLevel) + 1;
    const data = getLevelData(level);
    maxNumber = data.max;
    randomNumber = Math.floor(Math.random() * maxNumber) + 1;
    document.getElementById("levelTitle").innerText = data.title;
    document.getElementById("levelStory").innerText = data.story;
    document.getElementById("guessInput").setAttribute("max", maxNumber);
  }

  updateBackground(level); 
}
    function checkGuess() {
      const userGuess = Number(document.getElementById("guessInput").value);
      const message = document.getElementById("message");

      if (!userGuess) {
        message.innerHTML = "⛔ Please enter a number!";
        return;
      }

      attempts++;

      if (userGuess === randomNumber) {
        clearInterval(timer);
        score += Math.max(10 - attempts + 1, 1);
        saveProgress();
        document.getElementById("score").innerText = `🏆 High Score: ${score}`;
        message.innerHTML = `🎉 You guessed it in ${attempts} attempts! Moving to next level...`;
        message.style.color = "green";

      if (level === 4) {
    setTimeout(() => {
      level = 5;
      document.getElementById("gameContainer").style.display = "none";
      renderLevel5Stage();
    }, 2000);
  } else {
    setTimeout(() => {
      level++;
      const next = getLevelData(level);
      maxNumber = next.max;
      randomNumber = Math.floor(Math.random() * maxNumber) + 1;
      attempts = 0;
      updateBackground(level);
      timeLeft = level === 2 ? 60 : level === 3 ? 70 : 60 + level * 5;
      lives = next.lives || 5;
      document.getElementById("levelTitle").innerText = next.title;
      document.getElementById("levelStory").innerText = `Guess a number between 1 and ${maxNumber}`;
      message.innerHTML = "";
      document.getElementById("guessInput").value = "";
      document.getElementById("guessInput").setAttribute("max", maxNumber);
            startTimer();
      updateLivesDisplay();
    }, 2000);
  }

 } else {
        lives--;
        updateLivesDisplay();

        if (lives <= 0) {
          clearInterval(timer);
           Object.values(levelSounds).forEach(sound => {
    sound.pause();
    sound.currentTime = 0;
  });

  
  if (soundOn) failSound.play();



          message.innerHTML = `👻 Game Over! You lost all lives.<br> ☑️ The correct number was: ${randomNumber}`;
          message.style.color = "black";
          document.getElementById("gameButton").disabled = true;
          return;
        }

        if (userGuess > randomNumber) {
          message.innerHTML = "📉 Too high! Try again.";
          message.style.color = "red";
        } else {
          message.innerHTML = "📈 Too low! Try again.";
          message.style.color = "red";
        }
      }
    }

    function resetProgress() {
      localStorage.clear();
      location.reload();
    }
function jumpToLevel(n) {
  level = n;
  localStorage.setItem("completedLevel", n - 1);

  if (level === 5) {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("gameContainer").style.display = "none";
    renderLevel5Stage(); 
    return;
  }
  if (level === 6) {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("gameContainer").style.display = "none";
    document.getElementById("level5Container").style.display = "none";
    renderLevel6Stage(); 
    return;
  }
  
  const next = getLevelData(level);
  maxNumber = next.max;
  randomNumber = Math.floor(Math.random() * maxNumber) + 1;
  attempts = 0;
  lives = next.lives || 5;
  timeLeft = 60 + level * 5;
  
  document.body.className = `level-${level}`;
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameContainer").style.display = "block";
  document.getElementById("levelTitle").innerText = next.title;
  document.getElementById("levelStory").innerText = `Guess a number between 1 and ${maxNumber}`;
  document.getElementById("guessInput").setAttribute("max", maxNumber);
  document.getElementById("guessInput").value = "";
  document.getElementById("message").innerHTML = "";
  
  updateBackground(level);
  updateLivesDisplay();
  startTimer();
}

 

      if (level === 5) {
    renderLevel5Stage();
  }


    function closeModal() {
      document.getElementById("victoryModal").style.display = "none";
    }

    // Initialize
    loadProgress();
    startTimer();
    updateLivesDisplay();
function renderLevel5Stage() {
  document.getElementById("gameContainer").style.display = "none";
  document.getElementById("level5Container").style.display = "block";
  document.body.className = `level-5`;

  const numberOptions = document.getElementById("numberOptions");
  const level5Message = document.getElementById("level5Message");

  function updateLevel5Score(points) {
    level5Score += points;
    document.getElementById("level5ScoreValue").innerText = level5Score;
  }

  function renderOptions(start, end) {
    numberOptions.innerHTML = '';
    const options = new Set();

    correct = Math.floor(Math.random() * (end - start + 1)) + start;
    options.add(correct);

    while (options.size < 3) {
      options.add(Math.floor(Math.random() * (end - start + 1)) + start);
    }

    const shuffled = Array.from(options).sort(() => 0.5 - Math.random());

    shuffled.forEach(num => {
      const btn = document.createElement("button");
      btn.textContent = num;
      btn.classList.add("option-btn");
      btn.disabled = false;
      btn.addEventListener("click", () => handleChoice(num));
      numberOptions.appendChild(btn);
    });
  }

  function startLevel5Timer() {
    clearInterval(level5TimerInterval);
    level5Time = 30;
    document.getElementById("level5Time").innerText = level5Time;

    level5TimerInterval = setInterval(() => {
      level5Time--;
      document.getElementById("level5Time").innerText = level5Time;

      if (level5Time <= 0) {
        clearInterval(level5TimerInterval);
        level5Lives--;
        document.getElementById("level5Lives").textContent = "❤️".repeat(level5Lives);
        level5Message.textContent = "⏰ Time’s up! You lost 1 life.";
        if (level5Lives <= 0) {
          numberOptions.innerHTML = "";
          level5Message.textContent = "💀 Game Over!";
        } else {
          setTimeout(() => {
            renderOptions(rangeStart, rangeEnd);
            startLevel5Timer();
          }, 1500);
        }
      }
    }, 1000);
  }

  function handleChoice(choice) {
    clearInterval(level5TimerInterval);

    const buttons = document.querySelectorAll("#numberOptions button");
    buttons.forEach(btn => btn.disabled = true);

    if (choice === correct) {
      level5Message.textContent = `✅ Correct! The number was ${correct}`;
      updateLevel5Score(10);

      setTimeout(() => {
        if (rangeStart === 1) {
          rangeStart = 51;
          rangeEnd = 100;
        } else if (rangeStart === 51) {
          rangeStart = 101;
          rangeEnd = 200;
        } else {
          level5Message.textContent = "🏆 You passed Level 5!";
          setTimeout(() => {
            document.getElementById("level5Container").style.display = "none";
            document.getElementById("victoryModal").style.display = "block";
          }, 1500);
          return;
        }

        renderOptions(rangeStart, rangeEnd);
        startLevel5Timer();
      }, 2000);
    } else {
      level5Lives--;
      document.getElementById("level5Lives").textContent = "❤️".repeat(level5Lives);
      level5Message.textContent = `❌ Wrong! Correct was: ${correct}`;

      if (level5Lives <= 0) {
        numberOptions.innerHTML = "";
        level5Message.textContent = `💀 Game Over! The correct number was: ${correct}`;
      } else {
        setTimeout(() => {
          renderOptions(rangeStart, rangeEnd);
          startLevel5Timer();
        }, 2000);
      }
    }
  }

  const startBtn = document.getElementById("startBtn");
  startBtn.style.display = "block";
  startBtn.onclick = () => {
    startBtn.style.display = "none";
    renderOptions(rangeStart, rangeEnd);
    startLevel5Timer();
  };
}
let sequence = [];
let sequenceLength = 3;
let sequenceIndex = 0;

function renderLevel6Stage() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameContainer").style.display = "none";
  document.getElementById("level5Container").style.display = "none";
  document.getElementById("level6Container").style.display = "block";

  document.body.className = "level-6";

  const startBtn = document.getElementById("level6StartBtn");
  startBtn.style.display = "inline-block";

  document.getElementById("sequenceDisplay").textContent = "";
  document.getElementById("sequenceButtons").innerHTML = "";
  document.getElementById("level6Message").textContent = "";
}

document.getElementById("level6StartBtn").onclick = () => {
  document.getElementById("level6StartBtn").style.display = "none";
  sequenceLength = 3;
  generateSequence();
  showSequence();
};

function generateSequence() {
  sequence = [];
  for (let i = 0; i < sequenceLength; i++) {
    sequence.push(Math.floor(Math.random() * 9) + 1);
  }
  console.log("Generated sequence:", sequence);
}

function showSequence() {
  const display = document.getElementById("sequenceDisplay");
  display.textContent = sequence.join(" ");
  setTimeout(() => {
    display.textContent = "";
    renderSequenceButtons();
  }, 2000);
}

function renderSequenceButtons() {
  const container = document.getElementById("sequenceButtons");
  container.innerHTML = "";

  const shuffled = [...sequence].sort(() => 0.5 - Math.random());

  shuffled.forEach(num => {
    const btn = document.createElement("button");
    btn.textContent = num;
    btn.style.fontSize = "20px"; 
    btn.onclick = () => handleSequenceClick(num);
    container.appendChild(btn);
  });

  sequenceIndex = 0;
}

function handleSequenceClick(num) {
  console.log("Clicked:", num, "Expected:", sequence[sequenceIndex]);
  const message = document.getElementById("level6Message");
  if (num === sequence[sequenceIndex]) {
    sequenceIndex++;
    if (sequenceIndex === sequence.length) {
      message.textContent = "✅ Correct Sequence!";
      sequenceLength++;
      setTimeout(() => {
        message.textContent = "";
        generateSequence();
        showSequence();
      }, 1500);
    }
  } else {
    message.textContent = `❌ Wrong! Correct sequence was: ${sequence.join(" ")}`;
  }
}


