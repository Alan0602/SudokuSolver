

document.addEventListener("DOMContentLoaded", function() {
    const sudokuContainer = document.querySelector('.sudoku-container');
    const solveBtn = document.querySelector('.solve-btn');
    const resetBtn = document.querySelector('.reset-btn');
    const loader = document.querySelector('.loader');
    const numbersInput = document.getElementById('numbers');

    function createSudokuBoard() {
        sudokuContainer.innerHTML = '';
        const size = 9;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cell = document.createElement('input');
                cell.type = 'text';
                cell.maxLength = 1;
                cell.dataset.row = i;
                cell.dataset.col = j;
                sudokuContainer.appendChild(cell);
            }
        }
    }

    function isValidMove(grid, row, col, num) {
        // Check if the number is not present in the current row, column, and box
        for (let i = 0; i < 9; i++) {
            if (grid[row][i] === num || grid[i][col] === num || grid[row - row % 3 + Math.floor(i / 3)][col - col % 3 + i % 3] === num) {
                return false;
            }
        }
        return true;
    }

    function solveSudoku(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValidMove(grid, row, col, num)) {
                            grid[row][col] = num;
                            if (solveSudoku(grid)) {
                                return true;
                            }
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    function resetSudoku() {
        const cells = document.querySelectorAll('.sudoku-container input');
        cells.forEach(cell => cell.value = '');
    }

    function handleSolveClick() {
        loader.style.display = 'block';
        const grid = getGridFromInput();
        if (grid) {
            if (solveSudoku(grid)) {
                renderGrid(grid);
            } else {
                alert('No solution exists for the given Sudoku.');
            }
        } else {
            alert('Invalid Sudoku input. Please check your numbers.');
        }
        loader.style.display = 'none';
    }

    function getGridFromInput() {
        const cells = document.querySelectorAll('.sudoku-container input');
        const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
        for (const cell of cells) {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            const value = parseInt(cell.value);
            if (!isNaN(value) && value >= 1 && value <= 9) {
                grid[row][col] = value;
            } else if (cell.value !== '') {
                // Invalid input
                return null;
            }
        }
        return grid;
    }

    function renderGrid(grid) {
        const cells = document.querySelectorAll('.sudoku-container input');
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            cell.value = grid[row][col];
        });
    }

    numbersInput.addEventListener('change', createSudokuBoard);
    solveBtn.addEventListener('click', handleSolveClick);
    resetBtn.addEventListener('click', resetSudoku);
});
