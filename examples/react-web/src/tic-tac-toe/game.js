/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

function IsVictory(cells) {
  const positions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const isRowComplete = (row) => {
    const symbols = row.map((i) => cells[i]);
    return symbols.every((i) => i !== null && i === symbols[0]);
  };

  return positions.map(isRowComplete).some((i) => i === true);
}

const TicTacToe = {
  name: 'tic-tac-toe',

  setup: () => ({
    cells: new Array(9).fill(null),
    // cards Yellow Red Blue Green White 1-(3) 2-(2) 3-(2) 4-(2) 5-(1)
    // color_cardvalue_cardnumber
    gameDeck: new Deck([
      yel_1_1,
      yel_1_2,
      yel_1_3,
      yel_2_1,
      yel_2_2,
      yel_3_1,
      yel_3_2,
      yel_4_1,
      yel_4_2,
      yel_1_5,
      bl_1_1,
      bl_1_2,
      bl_1_3,
      bl_2_1,
      bl_2_2,
      bl_3_1,
      bl_3_2,
      bl_4_1,
      bl_4_2,
      bl_1_5,
      red_1_1,
      red_1_2,
      red_1_3,
      red_2_1,
      red_2_2,
      red_3_1,
      red_3_2,
      red_4_1,
      red_4_2,
      red_1_5,
      gr_1_1,
      gr_1_2,
      gr_1_3,
      gr_2_1,
      gr_2_2,
      gr_3_1,
      gr_3_2,
      gr_4_1,
      gr_4_2,
      gr_1_5,
      wh_1_1,
      wh_1_2,
      wh_1_3,
      wh_2_1,
      wh_2_2,
      wh_3_1,
      wh_3_2,
      wh_4_1,
      wh_4_2,
      wh_1_5,
    ]),
  }),

  turn: {
    minMoves: 1,
    maxMoves: 1,
  },

  shuffle: ({ G, ctx }) => {
    const deck = [...G.gameDeck];
    deck.shuffle();
  },
  deal: ({ G, ctx }) => {
    myDeck.top(5);
  },
  draw: ({ G, ctx }) => {
    const deck = [...G.gameDeck];
    myDeck.top(1);
  },
  ai: {
    enumerate: (G) => {
      let r = [];
      for (let i = 0; i < 9; i++) {
        if (G.cells[i] === null) {
          r.push({ move: 'clickCell', args: [i] });
        }
      }
      return r;
    },
  },
};

export default TicTacToe;
