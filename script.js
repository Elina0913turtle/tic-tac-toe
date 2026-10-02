// ====================================================
// 1. 棋盘模块 (Module Pattern / IIFE)
// ====================================================
const gameBoard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const setCell = (index, mark) => {
    if (index < 0 || index > 8 || board[index] !== "") {
      return false;
    }
    board[index] = mark;
    return true;
  };

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, setCell, resetBoard };
})();

// ====================================================
// 2. 玩家工厂函数 (Factory Function)
// ====================================================
const createPlayer = (name, mark) => {
  return { name, mark };
};

// ====================================================
// 3. 游戏控制模块 (Module Pattern / IIFE)
// ====================================================
const gameController = (function () {
  const player1 = createPlayer("玩家 1", "X");
  const player2 = createPlayer("玩家 2", "O");

  let activePlayer = player1;
  let isGameOver = false;

  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const switchTurn = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };

  const checkWinner = () => {
    const board = gameBoard.getBoard();

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (board.every((cell) => cell !== "")) {
      return "tie";
    }

    return null;
  };

  const playRound = (index) => {
    if (isGameOver) return;

    const success = gameBoard.setCell(index, activePlayer.mark);
    if (!success) return;

    const winner = checkWinner();
    if (winner) {
      isGameOver = true;
      return;
    }

    switchTurn();
  };

  const restartGame = () => {
    gameBoard.resetBoard();
    activePlayer = player1;
    isGameOver = false;
  };

  const getActivePlayer = () => activePlayer;
  const getIsGameOver = () => isGameOver;
  const getWinner = () => checkWinner();

  return { playRound, restartGame, getActivePlayer, getIsGameOver, getWinner };
})();

// ====================================================
// 4. UI 渲染与事件控制模块 (Module Pattern / IIFE)
// ====================================================
const displayController = (function () {
  const boardElement = document.getElementById("gameboard");
  const statusElement = document.getElementById("status-message");
  const restartBtn = document.getElementById("restart-btn");

  // 更新 DOM 棋盘与提示文字
  const updateDisplay = () => {
    boardElement.innerHTML = "";
    const board = gameBoard.getBoard();
    const activePlayer = gameController.getActivePlayer();
    const isGameOver = gameController.getIsGameOver();
    const winner = gameController.getWinner();

    // 动态生成 9 个 DOM 格子
    board.forEach((cellValue, index) => {
      const cellElement = document.createElement("div");
      cellElement.classList.add("cell");
      cellElement.dataset.index = index;
      cellElement.textContent = cellValue;

      // 绑定格子点击事件
      cellElement.addEventListener("click", () => {
        if (!isGameOver && cellValue === "") {
          gameController.playRound(index);
          updateDisplay();
        }
      });

      boardElement.appendChild(cellElement);
    });

    // 动态更新状态信息
    if (isGameOver) {
      if (winner === "tie") {
        statusElement.textContent = "🤝 棋逢对手，本局平局！";
      } else {
        statusElement.textContent = `🎉 恭喜！${activePlayer.name} (${activePlayer.mark}) 赢得胜利！`;
      }
    } else {
      statusElement.textContent = `👉 轮到 ${activePlayer.name} (${activePlayer.mark}) 落子`;
    }
  };

  // 绑定重置按钮事件
  restartBtn.addEventListener("click", () => {
    gameController.restartGame();
    updateDisplay();
  });

  // 首次渲染
  updateDisplay();
})();