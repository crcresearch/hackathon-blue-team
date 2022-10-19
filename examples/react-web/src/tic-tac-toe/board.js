/*
 * Copyright 2017 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import './board.css';

const cardColors = {
  blue: '#59A1E4',
  yellow: '#E4BD59',
  red: '#EB5E5E',
  green: '#59DE44',
  white: 'white',
  purple: '#9F59E4',
  none: 'none',
};

const Card = ({ width, color, id, letter, isEmpty, isHighlighted }) => {
  const height = width * 1.6;

  return (
    <div style={{ width, height, padding: 5 }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: cardColors[color] ?? cardColors['purple'],
          borderRadius: 5,
          position: 'relative',
          border: isEmpty
            ? 'dotted black 2px'
            : isHighlighted
            ? 'solid orange 4px'
            : undefined,
          boxSizing: 'border-box',
          padding: 2,
        }}
      >
        <div style={{ fontSize: 16 }}>{letter}</div>
        <div style={{ position: 'absolute', bottom: 0 }}>{id}</div>
      </div>
    </div>
  );
};

const Hand = ({ cards, width, hidden }) => {
  const cardWidth = width / cards.length;
  const newCards = hidden ? cards.map((card) => ({ id: card.id })) : cards;

  return (
    <div style={{ display: 'flex', width }}>
      {newCards.map((card) => (
        <Card width={cardWidth} {...card} />
      ))}
    </div>
  );
};

const ActionButton = ({ text, onClick, disabled }) => {
  return (
    <button
      style={{
        // backgroundColor: 'violet',
        width: 80,
        height: 30,
        border: 'none',
        opacity: disabled ? 0.7 : 1,
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

const ClueButton = ({ color, text, onClick, isActive, isHighlighted }) => {
  const size = 40;

  return (
    <button
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: cardColors[color] ?? cardColors['purple'],
        border: isHighlighted ? 'solid 4px orange' : 'none',
        opacity: isActive ? 1 : 0.3,
        boxSizing: 'border-box',
      }}
      onClick={onClick}
      disabled={!isActive}
    >
      {text}
    </button>
  );
};

const ClueModal = ({ playerHand, closeModal, setSelectedCards, isOpen }) => {
  const [selectedButton, setSelectedButton] = useState(undefined);
  const colorGroups = _.groupBy(playerHand, (card) => card.color);
  const letterGroups = _.groupBy(playerHand, (card) => card.letter);
  const activeColors = Object.keys(colorGroups);
  const activeLetters = Object.keys(letterGroups);
  const allColors = ['red', 'yellow', 'green', 'blue', 'white'];
  const allLetters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(1, 1, 1, 0.5)',
        display: isOpen ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
      }}
      onClick={() => {
        closeModal();
        setSelectedButton(undefined);
        setSelectedCards([]);
      }}
    >
      <div
        style={{
          width: '80%',
          height: '70%',
          backgroundColor: 'silver',
          borderRadius: 15,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Give a clue</h2>
        <div
          style={{
            display: 'flex',
            gap: 5,
            justifyContent: 'center',
            margin: 10,
          }}
        >
          {allColors.map((color) => (
            <ClueButton
              color={color}
              onClick={() => {
                setSelectedButton(color);
                setSelectedCards(colorGroups[color].map((card) => card.id));
              }}
              isActive={activeColors.includes(color)}
              isHighlighted={selectedButton === color}
            />
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            gap: 5,
            justifyContent: 'center',
            margin: 10,
          }}
        >
          {allLetters.map((letter) => (
            <ClueButton
              onClick={() => {
                setSelectedButton(letter);
                setSelectedCards(letterGroups[letter].map((card) => card.id));
              }}
              isActive={activeLetters.includes(letter)}
              text={letter}
              isHighlighted={selectedButton === letter}
            />
          ))}
        </div>
        <br />
        <ActionButton
          text="Send clue"
          onClick={() => {}}
          disabled={!selectedButton}
        />
      </div>
    </div>
  );
};

const Screen = ({ playerID, playerTurn }) => {
  const [clueModalOpen, setClueModalOpen] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  console.log({ selectedCards });

  const width = 300;
  const height = 600;

  const p0Cards = [
    { color: 'yellow', id: 1, letter: 'A' },
    { color: 'blue', id: 2, letter: 'B' },
    { color: 'blue', id: 3, letter: 'C' },
    { color: 'white', id: 4, letter: 'D' },
    { color: 'green', id: 5, letter: 'E' },
  ];

  const p1Cards = [
    { color: 'red', id: 6, letter: 'D' },
    { color: 'blue', id: 7, letter: 'D' },
    { color: 'green', id: 8, letter: 'A' },
    { color: 'yellow', id: 9, letter: 'E' },
    { color: 'white', id: 10, letter: 'C' },
  ];

  const currentPlayerCards = playerID === '0' ? p0Cards : p1Cards;
  const otherPlayerCards = (playerID === '0' ? p1Cards : p0Cards).map(
    (card) => {
      return selectedCards.includes(card.id)
        ? { isHighlighted: true, ...card }
        : card;
    }
  );

  const boardCards = [
    { color: 'green', letter: 'A' },
    { color: 'white', letter: 'B' },
    { color: 'yellow', letter: 'C' },
    { color: 'red', letter: 'D' },
    { letter: 'Blue', isEmpty: true, color: 'none' },
  ];

  return (
    <div
      style={{
        width,
        height,
        border: '3px solid black',
        borderRadius: 15,
        backgroundColor: 'silver',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div>
        <Hand width={width} cards={otherPlayerCards} />
      </div>
      <div style={{ flex: '1 0 auto', display: 'flex', position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: '1 0 auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              flex: '1 0 auto',
            }}
          >
            {playerID === playerTurn && (
              <div style={{ display: 'flex', gap: 10, margin: 10 }}>
                <ActionButton
                  text="Give clue"
                  onClick={() => setClueModalOpen(true)}
                />
                <ActionButton text="Play card" onClick={() => {}} />
                <ActionButton text="Discard" onClick={() => {}} />
              </div>
            )}
            <Hand width={width * 0.8} cards={boardCards} />
          </div>
          <div>
            <Hand width={width} cards={currentPlayerCards} hidden />
          </div>
        </div>
        <ClueModal
          playerHand={otherPlayerCards}
          closeModal={() => setClueModalOpen(false)}
          setSelectedCards={setSelectedCards}
          isOpen={clueModalOpen}
        />
      </div>
    </div>
  );
};

class Board extends React.Component {
  static propTypes = {
    G: PropTypes.any.isRequired,
    ctx: PropTypes.any.isRequired,
    moves: PropTypes.any.isRequired,
    playerID: PropTypes.string,
    isActive: PropTypes.bool,
    isMultiplayer: PropTypes.bool,
    isConnected: PropTypes.bool,
    isPreview: PropTypes.bool,
  };

  onClick = (id) => {
    if (this.isActive(id)) {
      this.props.moves.clickCell(id);
    }
  };

  isActive(id) {
    return this.props.isActive && this.props.G.cells[id] === null;
  }

  render() {
    const playerTurn = '0';

    return (
      <div style={{ margin: 30 }}>
        <Screen playerID={this.props.playerID} playerTurn={playerTurn} />
      </div>
    );

    // let tbody = [];
    // for (let i = 0; i < 3; i++) {
    //   let cells = [];
    //   for (let j = 0; j < 3; j++) {
    //     const id = 3 * i + j;
    //     cells.push(
    //       <td
    //         key={id}
    //         className={this.isActive(id) ? 'active' : ''}
    //         onClick={() => this.onClick(id)}
    //       >
    //         {this.props.G.cells[id]}
    //       </td>
    //     );
    //   }
    //   tbody.push(<tr key={i}>{cells}</tr>);
    // }

    // let disconnected = null;
    // if (this.props.isMultiplayer && !this.props.isConnected) {
    //   disconnected = <div>Disconnected!</div>;
    // }

    // let winner = null;
    // if (this.props.ctx.gameover) {
    //   winner =
    //     this.props.ctx.gameover.winner !== undefined ? (
    //       <div id="winner">Winner: {this.props.ctx.gameover.winner}</div>
    //     ) : (
    //       <div id="winner">Draw!</div>
    //     );
    // }

    // let player = null;
    // if (this.props.playerID) {
    //   player = <div id="player">Player: {this.props.playerID}</div>;
    // }

    // if (this.props.isPreview) {
    //   disconnected = player = null;
    // }

    // return (
    //   <div>
    //     <table id="board">
    //       <tbody>{tbody}</tbody>
    //     </table>
    //     {player}
    //     {winner}
    //     {disconnected}
    //   </div>
    // );
  }
}

export default Board;
