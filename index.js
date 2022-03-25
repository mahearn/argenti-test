const fs = require('fs');
const nReadlines = require('n-readlines');
const pokerHands = new nReadlines('poker-hands.txt');

const order = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']; //ranking order from lowest to highest (A !== 1)

let player1Hand = [],
  player2Hand = [],
  player1Score = 0,
  player2Score = 0;

function compareHands(h1, h2) {
  let h1Details = getHandDetails(h1),
    h2Details = getHandDetails(h2);
  if (h1Details.rank === h2Details.rank) {
    if (h1Details.value > h2Details.value) {
      player1Score++;
    } else if (h1Details.value < h2Details.value) {
      player2Score++;
    }
  }
}

function getHandDetails(hand) {
  const faces = hand
    .map((a) => String.fromCharCode([77 - order.indexOf(a[0])]))
    .sort();
  const suits = hand.map((a) => a[1]).sort();
  const counts = faces.reduce(count, {});
  const duplicates = Object.values(counts).reduce(count, {});
  const flush = suits[0] === suits[4];
  const first = faces[0].charCodeAt(0);
  const straight = faces.every((f, index) => f.charCodeAt(0) - first === index);
  let rank =
    (flush && straight && 10) ||
    (duplicates[4] && 9) ||
    (duplicates[3] && duplicates[2] && 8) ||
    (flush && 7) ||
    (straight && 6) ||
    (duplicates[3] && 5) ||
    (duplicates[2] > 1 && 4) ||
    (duplicates[2] && 3) ||
    2;

  return { rank, value: faces.sort(byCountFirst).join('') };

  function byCountFirst(a, b) {
    //Counts are in reverse order - bigger is better
    const countDiff = counts[b] - counts[a];
    if (countDiff) return countDiff; // If counts don't match return
    return b > a ? -1 : b === a ? 0 : 1;
  }

  function count(c, a) {
    c[a] = (c[a] || 0) + 1;
    return c;
  }
}

while ((line = pokerHands.next())) {
  let strLine = line.toString();
  let cardsToDeal = strLine.split(' ');
  player1Hand = cardsToDeal.slice(0, 5);
  player2Hand = cardsToDeal.slice(5);
  compareHands(player1Hand, player2Hand);
}

console.log('Player 1: ' + player1Score + ' hands');
console.log('Player 2: ' + player2Score + ' hands');
