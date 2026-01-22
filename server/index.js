const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

/**
 * Scoring schema:
 * - Project 1: itemA = 10, itemB = 11
 * - Project 2: itemC = 5, itemD = 8
 * - Project 3: itemE = 20
 * - Foul: 5 points, added to opponent total
 */
const itemPoints = {
  itemA: 10,
  itemB: 11,
  itemC: 5,
  itemD: 8,
  itemE: 20,
  foul: 5
};

// Two alliances: red, blue
let score = {
  red: {
    project1: { itemA: 0, itemB: 0 },
    project2: { itemC: 0, itemD: 0 },
    project3: { itemE: 0 },
    foul: 0
  },
  blue: {
    project1: { itemA: 0, itemB: 0 },
    project2: { itemC: 0, itemD: 0 },
    project3: { itemE: 0 },
    foul: 0
  }
};

let gameStarted = false;
let gameEnded = false;
let timeLeft = 300; // 5 minutes in seconds
let timer = null;

let paused = false;
let pauseUsed = { red: false, blue: false };
let pauseRemaining = 0; // auto 30s pause countdown
let pauseTimer = null;

function calculateProjectTotal(projectScore) {
  return Object.entries(projectScore).reduce(
    (sum, [item, count]) => sum + count * itemPoints[item],
    0
  );
}

function calculateTeamTotals(teamKey) {
  const teamScore = score[teamKey];
  const p1 = calculateProjectTotal(teamScore.project1);
  const p2 = calculateProjectTotal(teamScore.project2);
  const p3 = calculateProjectTotal(teamScore.project3);
  const opponentKey = teamKey === 'red' ? 'blue' : 'red';
  const foulToThisTeam = score[opponentKey].foul * itemPoints.foul;
  const total = p1 + p2 + p3 + foulToThisTeam;
  return { p1, p2, p3, total };
}

function buildPayload() {
  const redTotals = calculateTeamTotals('red');
  const blueTotals = calculateTeamTotals('blue');

  return {
    red: {
      ...score.red,
      projectTotals: { project1: redTotals.p1, project2: redTotals.p2, project3: redTotals.p3 },
      total: redTotals.total
    },
    blue: {
      ...score.blue,
      projectTotals: { project1: blueTotals.p1, project2: blueTotals.p2, project3: blueTotals.p3 },
      total: blueTotals.total
    },
    gameStarted,
    gameEnded,
    timeLeft,
    paused,
    pauseUsed,
    pauseRemaining
  };
}

function broadcastState() {
  io.emit('scoreUpdate', buildPayload());
}

function startTimer() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    if (!paused && !gameEnded) {
      timeLeft--;
      if (timeLeft <= 0) {
        gameEnded = true;
        timeLeft = 0;
        clearInterval(timer);
      }
      broadcastState();
    }
  }, 1000);
}

io.on('connection', (socket) => {
  // Send initial state
  broadcastState();

  // Start game: enable scoring and start 5-minute timer
  socket.on('startGame', () => {
    if (!gameStarted) {
      gameStarted = true;
      gameEnded = false;
      timeLeft = 300;
      paused = false;
      pauseRemaining = 0;
      if (pauseTimer) { clearInterval(pauseTimer); pauseTimer = null; }
      startTimer();
      broadcastState();
    }
  });

  /**
   * Modify score
   * payload: { alliance: 'red'|'blue', project: 'project1'|'project2'|'project3'|null, item: 'itemA'|'itemB'|'itemC'|'itemD'|'itemE'|'foul', delta: +1|-1 }
   * Rules:
   * - Cannot modify when not started, ended, or paused
   * - Non-foul counts cannot go below 0
   * - Foul counts cannot go below 0
   * - Foul is stored on committing alliance, but contributes to opponent total
   */
  socket.on('modifyScore', ({ alliance, project, item, delta }) => {
    if (!gameStarted || gameEnded) {
      socket.emit('errorMessage', '比赛未开始或已结束，不能修改分数');
      return;
    }
    if (paused) {
      socket.emit('errorMessage', '比赛暂停中，不能修改分数');
      return;
    }

    if (item === 'foul') {
      score[alliance].foul = Math.max(0, score[alliance].foul + delta);
      broadcastState();
      return;
    }

    // Validate project and item paths
    if (!project || !score[alliance][project] || !(item in score[alliance][project])) {
      socket.emit('errorMessage', '非法的项目或得分项');
      return;
    }

    const next = score[alliance][project][item] + delta;
    if (next < 0) {
      socket.emit('errorMessage', `${alliance} 的 ${item} 数量不能小于 0`);
      return;
    }
    score[alliance][project][item] = next;
    broadcastState();
  });

  /**
   * Auto 30s pause, only once per alliance; while paused, other alliance cannot pause.
   */
  socket.on('pause30s', (alliance) => {
    if (!gameStarted || gameEnded) return;
    if (paused) {
      socket.emit('errorMessage', '比赛已暂停，不能再次暂停');
      return;
    }
    if (pauseUsed[alliance]) {
      socket.emit('errorMessage', `${alliance} 已经用过暂停`);
      return;
    }

    pauseUsed[alliance] = true;
    paused = true;
    pauseRemaining = 30;
    broadcastState();

    if (pauseTimer) clearInterval(pauseTimer);
    pauseTimer = setInterval(() => {
      pauseRemaining--;
      if (pauseRemaining <= 0) {
        paused = false;
        pauseRemaining = 0;
        clearInterval(pauseTimer);
        pauseTimer = null;
      }
      broadcastState();
    }, 1000);
  });

  /**
   * Manual pause toggle (no countdown shown)
   */
  socket.on('manualPause', () => {
    if (gameStarted && !gameEnded) {
      // If toggling to paused, ensure any auto countdown is cleared
      paused = !paused;
      if (paused) {
        pauseRemaining = 0;
        if (pauseTimer) { clearInterval(pauseTimer); pauseTimer = null; }
      }
      broadcastState();
    }
  });

  /**
   * End game immediately
   */
  socket.on('endGame', () => {
    gameEnded = true;
    if (timer) { clearInterval(timer); timer = null; }
    if (pauseTimer) { clearInterval(pauseTimer); pauseTimer = null; }
    broadcastState();
  });

  /**
   * Reset for next match
   */
  socket.on('resetScore', () => {
    score = {
      red: {
        project1: { itemA: 0, itemB: 0 },
        project2: { itemC: 0, itemD: 0 },
        project3: { itemE: 0 },
        foul: 0
      },
      blue: {
        project1: { itemA: 0, itemB: 0 },
        project2: { itemC: 0, itemD: 0 },
        project3: { itemE: 0 },
        foul: 0
      }
    };
    gameStarted = false;
    gameEnded = false;
    timeLeft = 300;
    paused = false;
    pauseUsed = { red: false, blue: false };
    pauseRemaining = 0;

    if (timer) { clearInterval(timer); timer = null; }
    if (pauseTimer) { clearInterval(pauseTimer); pauseTimer = null; }

    broadcastState();
  });
});

server.listen(3001, () => {
  console.log('后端运行在 http://localhost:3001');
});
