// ====================================================
// 1. 棋盘模块 (Module Pattern / IIFE)
// 职责：单例模式，封装 3x3 棋盘数据与数组修改接口
// ====================================================
const gameBoard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  // 在指定索引落子，成功返回 true，被占用或越界返回 false
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
// 职责：生成玩家实例（包含姓名与棋子符号）
// ====================================================
const createPlayer = (name, mark) => {
  return { name, mark };
};

// ====================================================
// 3. 游戏控制模块 (Module Pattern / IIFE)
// 职责：回合切换、胜负与平局判定、控制台状态输出
// ====================================================
const gameController = (function () {
  const player1 = createPlayer("玩家 1", "X");
  const player2 = createPlayer("玩家 2", "O");

  let activePlayer = player1;
  let isGameOver = false;

  // 8 种获胜组合索引
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横行
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // 竖列
    [0, 4, 8], [2, 4, 6]             // 对角线
  ];

  const switchTurn = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };

  // 检查胜负：返回 'X'/'O'（胜利者）、'tie'（平局）或 null（继续）
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

  // 在控制台中以 3x3 字符网格形式可视化打印棋盘
  const printBoard = () => {
    const b = gameBoard.getBoard();
    console.log(`
 ${b[0] || "0"} | ${b[1] || "1"} | ${b[2] || "2"} 
---+---+---
 ${b[3] || "3"} | ${b[4] || "4"} | ${b[5] || "5"} 
---+---+---
 ${b[6] || "6"} | ${b[7] || "7"} | ${b[8] || "8"} 
    `);
  };

  // 进行一轮落子
  const playRound = (index) => {
    if (isGameOver) {
      console.log("⚠️️ 游戏已结束，请输入 gameController.restartGame() 重新开始！");
      return;
    }

    const success = gameBoard.setCell(index, activePlayer.mark);
    if (!success) {
      console.log(`❌ 位置 ${index} 无效或已被占用，请输入 0~8 之间的可用位置！`);
      return;
    }

    console.log(`🎯 ${activePlayer.name} (${activePlayer.mark}) 在位置 ${index} 落子：`);
    printBoard();

    const winner = checkWinner();
    if (winner) {
      isGameOver = true;
      if (winner === "tie") {
        console.log("🤝 棋逢对手，本局平局！");
      } else {
        console.log(`🎉 恭喜！${activePlayer.name} (${activePlayer.mark}) 获得最终胜利！`);
      }
      return;
    }

    switchTurn();
    console.log(`👉 轮到 ${activePlayer.name} (${activePlayer.mark})，请调用 gameController.playRound(位置)`);
  };

  // 重新开始游戏
  const restartGame = () => {
    gameBoard.resetBoard();
    activePlayer = player1;
    isGameOver = false;
    console.log("🔄 游戏已重置！");
    printBoard();
    console.log(`👉 请 ${activePlayer.name} (${activePlayer.mark}) 先手，输入 gameController.playRound(位置)`);
  };

  // 初始化首次提示
  console.log("🎮 井字棋控制台版准备就绪！");
  printBoard();
  console.log(`👉 请 ${activePlayer.name} (${activePlayer.mark}) 先手，输入 gameController.playRound(0~8)`);

  return { playRound, restartGame };
})();