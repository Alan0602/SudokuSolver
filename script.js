

// document.addEventListener("DOMContentLoaded", function() {
//     const sudokuContainer = document.querySelector('.sudoku-container');
//     const solveBtn = document.querySelector('.solve-btn');
//     const resetBtn = document.querySelector('.reset-btn');
//     const loader = document.querySelector('.loader');
//     const numbersInput = document.getElementById('numbers');

//     function createSudokuBoard() {
//         sudokuContainer.innerHTML = '';
//         const size = 9;
//         for (let i = 0; i < size; i++) {
//             for (let j = 0; j < size; j++) {
//                 const cell = document.createElement('input');
//                 cell.type = 'text';
//                 cell.maxLength = 1;
//                 cell.dataset.row = i;
//                 cell.dataset.col = j;
//                 sudokuContainer.appendChild(cell);
//             }
//         }
//     }

//     function isValidMove(grid, row, col, num) {
//         // Check if the number is not present in the current row, column, and box
//         for (let i = 0; i < 9; i++) {
//             if (grid[row][i] === num || grid[i][col] === num || grid[row - row % 3 + Math.floor(i / 3)][col - col % 3 + i % 3] === num) {
//                 return false;
//             }
//         }
//         return true;
//     }

//     function solveSudoku(grid) {
//         for (let row = 0; row < 9; row++) {
//             for (let col = 0; col < 9; col++) {
//                 if (grid[row][col] === 0) {
//                     for (let num = 1; num <= 9; num++) {
//                         if (isValidMove(grid, row, col, num)) {
//                             grid[row][col] = num;
//                             if (solveSudoku(grid)) {
//                                 return true;
//                             }
//                             grid[row][col] = 0;
//                         }
//                     }
//                     return false;
//                 }
//             }
//         }
//         return true;
//     }

//     function resetSudoku() {
//         const cells = document.querySelectorAll('.sudoku-container input');
//         cells.forEach(cell => cell.value = '');
//     }

//     function handleSolveClick() {
//         loader.style.display = 'block';
//         const grid = getGridFromInput();
//         if (grid) {
//             if (solveSudoku(grid)) {
//                 renderGrid(grid);
//             } else {
//                 alert('No solution exists for the given Sudoku.');
//             }
//         } else {
//             alert('Invalid Sudoku input. Please check your numbers.');
//         }
//         loader.style.display = 'none';
//     }

//     function getGridFromInput() {
//         const cells = document.querySelectorAll('.sudoku-container input');
//         const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
//         for (const cell of cells) {
//             const row = parseInt(cell.dataset.row);
//             const col = parseInt(cell.dataset.col);
//             const value = parseInt(cell.value);
//             if (!isNaN(value) && value >= 1 && value <= 9) {
//                 grid[row][col] = value;
//             } else if (cell.value !== '') {
//                 // Invalid input
//                 return null;
//             }
//         }
//         return grid;
//     }

//     function renderGrid(grid) {
//         const cells = document.querySelectorAll('.sudoku-container input');
//         cells.forEach(cell => {
//             const row = parseInt(cell.dataset.row);
//             const col = parseInt(cell.dataset.col);
//             cell.value = grid[row][col];
//         });
//     }

//     numbersInput.addEventListener('change', createSudokuBoard);
//     solveBtn.addEventListener('click', handleSolveClick);
//     resetBtn.addEventListener('click', resetSudoku);
// });

"use strict";

// ═══════════════════════════════════════
//  SUDOKU SOLVER — script.js
// ═══════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {

  const board       = document.getElementById("sudokuBoard");
  const solveBtn    = document.getElementById("solveBtn");
  const resetBtn    = document.getElementById("resetBtn");
  const numbersInput= document.getElementById("numbers");
  const statusDot   = document.getElementById("statusDot");
  const statusText  = document.getElementById("statusText");
  const loader      = document.getElementById("loader");

  // ── BUILD BOARD ──────────────────────────────────────
  function buildBoard() {
    board.innerHTML = "";

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = document.createElement("input");
        cell.type       = "text";
        cell.maxLength  = 1;
        cell.inputMode  = "numeric";
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.className  = "cell";

        // Alternating 3×3 box tint (checkerboard of boxes)
        const boxRow = Math.floor(r / 3);
        const boxCol = Math.floor(c / 3);
        if ((boxRow + boxCol) % 2 === 0) cell.classList.add("box-tinted");

        // Only allow digits 1-9
        cell.addEventListener("input", (e) => {
          const v = e.target.value.replace(/[^1-9]/g, "");
          e.target.value = v ? v.slice(-1) : "";
          cell.classList.remove("conflict", "solved");
          cell.classList.remove("given");
        });

        // Keyboard navigation
        cell.addEventListener("keydown", (e) => handleArrow(e, r, c));

        board.appendChild(cell);
      }
    }
    setStatus("idle", "Ready — enter your puzzle below");
  }

  // ── ARROW KEY NAV ────────────────────────────────────
  function handleArrow(e, r, c) {
    const moves = {
      ArrowUp:    [-1, 0],
      ArrowDown:  [ 1, 0],
      ArrowLeft:  [ 0,-1],
      ArrowRight: [ 0, 1],
    };
    if (!moves[e.key]) return;
    e.preventDefault();
    const [dr, dc] = moves[e.key];
    const nr = r + dr, nc = c + dc;
    if (nr >= 0 && nr < 9 && nc >= 0 && nc < 9) {
      const next = board.querySelector(`input[data-row="${nr}"][data-col="${nc}"]`);
      if (next) next.focus();
    }
  }

  // ── GET GRID FROM DOM ─────────────────────────────────
  function getGrid() {
    const cells = board.querySelectorAll("input.cell");
    const grid  = Array.from({ length: 9 }, () => Array(9).fill(0));
    let invalid = false;

    cells.forEach(cell => {
      const r = +cell.dataset.row;
      const c = +cell.dataset.col;
      const v = cell.value.trim();
      if (v === "") return;
      const n = parseInt(v, 10);
      if (isNaN(n) || n < 1 || n > 9) { invalid = true; return; }
      grid[r][c] = n;
    });

    return invalid ? null : grid;
  }

  // ── SNAPSHOT WHICH CELLS WERE PRE-FILLED ─────────────
  function getGivenPositions(grid) {
    const given = new Set();
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++)
        if (grid[r][c] !== 0) given.add(`${r},${c}`);
    return given;
  }

  // ── RENDER SOLVED GRID ────────────────────────────────
  function renderGrid(grid, givenSet) {
    board.querySelectorAll("input.cell").forEach(cell => {
      const r = +cell.dataset.row;
      const c = +cell.dataset.col;
      const key = `${r},${c}`;
      cell.value = grid[r][c];
      cell.classList.remove("conflict", "solved", "given");

      if (givenSet.has(key)) {
        cell.classList.add("given");
        cell.readOnly = true;
      } else {
        cell.classList.add("solved");
        cell.readOnly = true;
      }
    });
  }

  // ── CONFLICT HIGHLIGHT ────────────────────────────────
  function highlightConflicts(grid) {
    // Find conflicting positions
    const conflicts = new Set();
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const v = grid[r][c];
        if (v === 0) continue;
        // check row
        for (let cc = 0; cc < 9; cc++) {
          if (cc !== c && grid[r][cc] === v) {
            conflicts.add(`${r},${c}`);
            conflicts.add(`${r},${cc}`);
          }
        }
        // check col
        for (let rr = 0; rr < 9; rr++) {
          if (rr !== r && grid[rr][c] === v) {
            conflicts.add(`${r},${c}`);
            conflicts.add(`${rr},${c}`);
          }
        }
        // check box
        const br = r - r%3, bc = c - c%3;
        for (let dr = 0; dr < 3; dr++) for (let dc = 0; dc < 3; dc++) {
          const rr = br+dr, cc = bc+dc;
          if ((rr !== r || cc !== c) && grid[rr][cc] === v) {
            conflicts.add(`${r},${c}`);
            conflicts.add(`${rr},${cc}`);
          }
        }
      }
    }
    return conflicts;
  }

  // ── VALIDATE ─────────────────────────────────────────
  function isValidMove(grid, row, col, num) {
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num) return false;
      if (grid[i][col] === num) return false;
      const br = row - row%3, bc = col - col%3;
      if (grid[br + Math.floor(i/3)][bc + i%3] === num) return false;
    }
    return true;
  }

  // ── BACKTRACKING SOLVER ───────────────────────────────
  function solveSudoku(grid) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === 0) {
          for (let n = 1; n <= 9; n++) {
            if (isValidMove(grid, r, c, n)) {
              grid[r][c] = n;
              if (solveSudoku(grid)) return true;
              grid[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  // ── STATUS HELPERS ────────────────────────────────────
  function setStatus(state, text) {
    statusDot.className  = `status-dot ${state}`;
    statusText.textContent = text;
  }

  function showLoader(show) {
    loader.style.display = show ? "block" : "none";
  }

  function toast(msg, duration = 3000) {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove("show"), duration);
  }

  // ── SOLVE HANDLER ─────────────────────────────────────
  function handleSolve() {
    const grid = getGrid();
    if (!grid) {
      setStatus("error", "Invalid input — only digits 1–9 allowed");
      toast("⚠ Invalid input. Only digits 1–9 are accepted.");
      return;
    }

    // Check for conflicts in the input
    const conflicts = highlightConflicts(grid);
    if (conflicts.size > 0) {
      board.querySelectorAll("input.cell").forEach(cell => {
        const key = `${cell.dataset.row},${cell.dataset.col}`;
        if (conflicts.has(key)) cell.classList.add("conflict");
      });
      setStatus("error", `${conflicts.size} conflicting cells found`);
      toast("⚠ Puzzle has conflicting digits — please fix the highlighted cells.");
      return;
    }

    // Snapshot given cells before solving
    const givenSet = getGivenPositions(grid);

    setStatus("solving", "Solving your puzzle…");
    showLoader(true);
    solveBtn.disabled = true;

    // Defer to allow UI to repaint
    setTimeout(() => {
      const success = solveSudoku(grid);
      showLoader(false);
      solveBtn.disabled = false;

      if (success) {
        renderGrid(grid, givenSet);
        setStatus("success", `Solved! ${81 - givenSet.size} cells filled in`);
        toast("✓ Puzzle solved successfully!");
      } else {
        setStatus("error", "No solution exists for this puzzle");
        toast("✗ No solution exists — check your clues.");
      }
    }, 30);
  }

  // ── RESET HANDLER ─────────────────────────────────────
  function handleReset() {
    board.querySelectorAll("input.cell").forEach(cell => {
      cell.value    = "";
      cell.readOnly = false;
      cell.classList.remove("given", "solved", "conflict");
    });
    setStatus("idle", "Board cleared — enter a new puzzle");
    toast("Board reset.");
  }

  // ── GENERATE FROM COUNT ───────────────────────────────
  function handleNumberChange() {
    const n = parseInt(numbersInput.value, 10);
    if (!n) return;
    if (n < 17 || n > 81) {
      toast("Please enter a number between 17 and 81.");
      return;
    }
    buildBoard();
    setStatus("idle", `Board ready for ${n} given digits`);
    toast(`Enter ${n} digits to define your puzzle.`);
  }

  // ── EVENT LISTENERS ───────────────────────────────────
  solveBtn.addEventListener("click", handleSolve);
  resetBtn.addEventListener("click", handleReset);
  numbersInput.addEventListener("change", handleNumberChange);

  // ── INIT ──────────────────────────────────────────────
  buildBoard();
});
