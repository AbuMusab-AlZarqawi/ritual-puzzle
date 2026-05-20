export const GRID_SIZE = 3;
export const TOTAL_TILES = GRID_SIZE * GRID_SIZE;
export const EMPTY_TILE = TOTAL_TILES - 1; // index 8 = empty

export type Tile = number; // 0-7 = tile index, 8 = empty
export type Board = Tile[];

export function createSolvedBoard(): Board {
  return Array.from({ length: TOTAL_TILES }, (_, i) => i);
}

export function isSolved(board: Board): boolean {
  return board.every((tile, i) => tile === i);
}

export function getEmptyIndex(board: Board): number {
  return board.indexOf(EMPTY_TILE);
}

export function getValidMoves(board: Board): number[] {
  const emptyIdx = getEmptyIndex(board);
  const row = Math.floor(emptyIdx / GRID_SIZE);
  const col = emptyIdx % GRID_SIZE;
  const moves: number[] = [];

  if (row > 0) moves.push(emptyIdx - GRID_SIZE); // up
  if (row < GRID_SIZE - 1) moves.push(emptyIdx + GRID_SIZE); // down
  if (col > 0) moves.push(emptyIdx - 1); // left
  if (col < GRID_SIZE - 1) moves.push(emptyIdx + 1); // right

  return moves;
}

export function moveTile(board: Board, tileIdx: number): Board | null {
  const validMoves = getValidMoves(board);
  if (!validMoves.includes(tileIdx)) return null;

  const newBoard = [...board];
  const emptyIdx = getEmptyIndex(board);
  [newBoard[emptyIdx], newBoard[tileIdx]] = [newBoard[tileIdx], newBoard[emptyIdx]];
  return newBoard;
}

// Fisher-Yates shuffle ensuring solvability
export function shuffleBoard(board: Board): Board {
  let newBoard = [...board];
  let emptyIdx = getEmptyIndex(newBoard);
  const shuffleMoves = 200;

  for (let i = 0; i < shuffleMoves; i++) {
    const validMoves = getValidMoves(newBoard);
    const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    [newBoard[emptyIdx], newBoard[randomMove]] = [newBoard[randomMove], newBoard[emptyIdx]];
    emptyIdx = randomMove;
  }

  // Prevent accidentally returning solved board
  if (isSolved(newBoard)) return shuffleBoard(board);
  return newBoard;
}

export function getTilePosition(index: number): { row: number; col: number } {
  return { row: Math.floor(index / GRID_SIZE), col: index % GRID_SIZE };
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString();
}
