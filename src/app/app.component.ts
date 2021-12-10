import { Component } from '@angular/core';

enum Player {
  X = 'X',
  O = 'O',
}

type Winner = Player | 'None';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  boardWidth: number;
  board: string[][];
  firstPlayer: Player;
  secondPlayer: Player;
  nextPlayer: Player;
  winner: Winner;
  errorMessage: string;

  constructor() {
    this.initOrResetGame(3);
    this.errorMessage = '';
  }

  initOrResetGame(boardWidth?: number): void {
    if (boardWidth !== undefined) this.boardWidth = boardWidth;

    this.board = [];

    for (let i = 0; i < this.boardWidth; i++) {
      this.board[i] = [];
    }

    this.firstPlayer = Player.X;
    this.secondPlayer = Player.O;
    this.nextPlayer = this.firstPlayer;
    this.winner = 'None';
  }

  handleClickCell(rowIndex: number, colIndex: number): void {
    if (!!this.getCellValue(rowIndex, colIndex)) return;

    this.board[rowIndex][colIndex] = this.nextPlayer;

    this.winner = this.getWinner();

    this.nextPlayer =
      this.nextPlayer === this.firstPlayer
        ? this.secondPlayer
        : this.firstPlayer;
  }

  getCellValue(rowIndex: number, colIndex: number): Player {
    return this.board[rowIndex][colIndex] as Player;
  }

  getWinner(): Winner {
    let winner: Winner;

    if (this.isAnyRowOrColumnCompleted() || this.isAnyDiagonalCompleted()) {
      winner = this.nextPlayer as Winner;
    } else {
      winner = 'None';
    }

    return winner;
  }

  isAnyRowOrColumnCompleted(): boolean {
    for (let x = 0; x < this.boardWidth; x++) {
      const { rowCells, columnCells } =
        this.getCellsValuesForRowAndColumnByIndex(x);

      const isRowCompleted = this.isCompleted(rowCells);

      if (isRowCompleted) return isRowCompleted;

      const isColumnCompleted = this.isCompleted(columnCells);

      if (isColumnCompleted) return isColumnCompleted;
    }

    return false;
  }

  isAnyDiagonalCompleted(): boolean {
    const { firstDiagonalCells, secondDiagonalCells } =
      this.getCellsValuesForDiagonals();

    const isFirstDiagonalCompleted = this.isCompleted(firstDiagonalCells);

    if (isFirstDiagonalCompleted) return isFirstDiagonalCompleted;

    const isSecondDiagonalCompleted = this.isCompleted(secondDiagonalCells);

    return isSecondDiagonalCompleted;
  }

  concatCells(cells: string[]): string {
    return cells.reduce((acc, current) => {
      acc = acc + current;
      return acc;
    });
  }

  getCellsValuesForRowAndColumnByIndex(index: number): {
    rowCells: Player[];
    columnCells: Player[];
  } {
    const rowCells: Player[] = [];
    const columnCells: Player[] = [];

    for (let y = 0; y < this.boardWidth; y++) {
      rowCells.push(this.board[index][y] as Player);
      columnCells.push(this.board[y][index] as Player);
    }

    return {
      rowCells,
      columnCells,
    };
  }

  getCellsValuesForDiagonals(): {
    firstDiagonalCells: Player[];
    secondDiagonalCells: Player[];
  } {
    const firstDiagonalCells: Player[] = [];
    const secondDiagonalCells: Player[] = [];

    for (let x = 0, y = this.boardWidth - 1; x < this.boardWidth; x++, y--) {
      firstDiagonalCells.push(this.board[x][x] as Player);
      secondDiagonalCells.push(this.board[x][y] as Player);
    }

    return {
      firstDiagonalCells,
      secondDiagonalCells,
    };
  }

  isCompleted(cells: string[]): boolean {
    const CellsConcatenation = this.concatCells(cells);

    const completeEntryForFirstPlayer = this.firstPlayer.repeat(
      this.boardWidth
    );
    const completeEntryForSecondPlayer = this.secondPlayer.repeat(
      this.boardWidth
    );

    return (
      CellsConcatenation === completeEntryForFirstPlayer ||
      CellsConcatenation === completeEntryForSecondPlayer
    );
  }

  handleSetBoardWidth(boardWidthValue: string) {
    const boardWidth = +boardWidthValue;

    if (boardWidth < 3) {
      this.errorMessage = 'Board size must be greater than or equal 3';
      return;
    }

    this.errorMessage = '';
    this.boardWidth = boardWidth;
    this.initOrResetGame();
  }
}
