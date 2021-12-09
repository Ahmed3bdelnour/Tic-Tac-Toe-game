//@ts-nocheck
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  boardWidth;
  board;
  firstPlayer;
  secondPlayer;
  nextPlayer;
  winner;

  ngOnInit() {
    this.resetGame();
  }

  resetGame() {
    this.boardWidth = 3;

    this.board = [];

    for (let i = 0; i < this.boardWidth; i++) {
      this.board[i] = [];
    }

    this.firstPlayer = 'X';
    this.secondPlayer = 'O';
    this.nextPlayer = this.firstPlayer;
    this.winner = 'None';
  }

  handleClickCell(rowIndex, colIndex) {
    if (!!this.board[rowIndex][colIndex]) return;

    this.board[rowIndex][colIndex] = this.nextPlayer;
    this.setWinner();
    this.nextPlayer =
      this.nextPlayer === this.firstPlayer
        ? this.secondPlayer
        : this.firstPlayer;
  }

  setWinner() {
    if (this.checkRowsAndColumns() || this.checkDiagonals()) {
      this.winner = this.nextPlayer;
    } else {
      this.winner = 'None';
    }
  }

  checkRowsAndColumns() {
    for (let x = 0; x < this.boardWidth; x++) {
      const rowPoints = [];
      const columnPoints = [];

      for (let y = 0; y < this.boardWidth; y++) {
        rowPoints.push(this.board[x][y]);
        columnPoints.push(this.board[y][x]);
      }

      const completeEntryForFirstPlayer = this.firstPlayer.repeat(
        this.boardWidth
      );
      const completeEntryForSecondPlayer = this.secondPlayer.repeat(
        this.boardWidth
      );

      const rowConcatenation = this.concatPoints(rowPoints);

      const rowMatches =
        rowConcatenation === completeEntryForFirstPlayer ||
        rowConcatenation === completeEntryForSecondPlayer;

      if (rowMatches) return rowMatches;

      const columnConcatenation = this.concatPoints(columnPoints);

      const columnMatches =
        columnConcatenation === completeEntryForFirstPlayer ||
        columnConcatenation === completeEntryForSecondPlayer;

      if (columnMatches) return columnMatches;
    }

    return false;
  }

  checkDiagonals() {
    const firstDiagonalPoints = [];
    const secondDiagonalPoints = [];

    for (let x = 0, y = this.boardWidth - 1; x < this.boardWidth; x++, y--) {
      firstDiagonalPoints.push(this.board[x][x]);
      secondDiagonalPoints.push(this.board[x][y]);
    }

    const completeEntryForFirstPlayer = this.firstPlayer.repeat(
      this.boardWidth
    );
    const completeEntryForSecondPlayer = this.secondPlayer.repeat(
      this.boardWidth
    );

    const firstDiagonalConcatenation = this.concatPoints(firstDiagonalPoints);

    const firstDiagonalMatches =
      firstDiagonalConcatenation === completeEntryForFirstPlayer ||
      firstDiagonalConcatenation === completeEntryForSecondPlayer;

    if (firstDiagonalMatches) return firstDiagonalMatches;

    const secondDiagonalConcatenation = this.concatPoints(secondDiagonalPoints);

    return (
      secondDiagonalConcatenation === completeEntryForFirstPlayer ||
      secondDiagonalConcatenation === completeEntryForSecondPlayer
    );
  }

  concatPoints(points) {
    return points.reduce((acc, cur) => {
      acc = acc + cur;
      return acc;
    });
  }
}
