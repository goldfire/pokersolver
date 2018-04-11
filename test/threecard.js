var should = require('should');
var Hand = require('../pokersolver').Hand;
var Flush = require('../pokersolver').Flush;
var StraightFlush = require('../pokersolver').StraightFlush;
var Straight = require('../pokersolver').Straight;
var ThreeOfAKind = require('../pokersolver').ThreeOfAKind;
var OnePair = require('../pokersolver').OnePair;
var HighCard = require('../pokersolver').HighCard;
var Game = require('../pokersolver').Game;

var gameForTest = new Game('threecard');

// Three Card Poker is only three cards, and a different ranking.
// Hands are compared in this game, not just based on rank.
// Dealer qualifies with a Queen High
describe('A basic hand', function() {
  it('should return a hand with cards sorted descending', function() {
    var hand = Hand.solve(['3c', 'Kh', '3s'], gameForTest);
    hand.cardPool[0].toString().should.equal('Kh');
    return hand.cardPool[2].toString().should.equal('3s');
  });
  return it('should return a correct description', function() {
    var hand = Hand.solve(['As', '3c', '3s'], gameForTest);
    return hand.descr.should.equal('Pair, 3\'s');
  });
});

describe('A Straight Flush', function() {
  it('should be detected as possible', function() {
    var hand = new StraightFlush(['8s', 'Ts', '9s'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  return it('should be detected as not possible', function() {
    var hand = new StraightFlush(['8s', 'Ts', '9d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('A Flush', function() {
  it('should be detected as possible', function() {
    var hand = new Flush(['4h', 'Th', '5h'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  return it('should be detected as not possible', function() {
    var hand = new Flush(['4s', 'Th', '5h'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('A Straight', function() {
  it('should be detected as possible', function() {
    var hand = new Straight(['3s', '4s', '5c'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new Straight(['5h', '6s', '6h'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  it('should detect a low ace', function() {
    var hand = new Straight(['2c', '3s', 'As'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should detect a high ace', function() {
    var hand = new Straight(['2d', '4h', 'As'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  return it('should know that an ace is not high in a wheel', function() {
    var lowHand = new Straight(['2s', '3s', 'Ad'], gameForTest);
    var highHand = new Straight(['2s', '3s', '4h'], gameForTest);
    return highHand.loseTo(lowHand).should.equal(false);
  });
});

describe('Three of a Kind', function() {
  it('should be detected as possible', function() {
    var hand = new ThreeOfAKind(['5c', '5s', '5h'], gameForTest);
    hand.isPossible.should.equal(true);
    return hand.toString().should.equal('5c, 5s, 5h');
  });
  return it('should be detected as not possible', function() {
    var hand = new ThreeOfAKind(['5c', '2h', '5h'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('One Pair', function() {
  it('should be detected as possible', function() {
    var hand = new OnePair(['5h', '5c', '2d'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new OnePair(['5h', '6s', '8d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  return it('should select the correct winner', function() {
    var highHand = new OnePair(['4d', '4h', 'Jc'], gameForTest);
    var lowHand = new OnePair(['4d', '4h', 'Tc'], gameForTest);
    return lowHand.loseTo(highHand).should.equal(true) && highHand.loseTo(lowHand).should.equal(false);
  });
});

describe('Determining winning hands', function() {
  it('should detect the winning hand from a list', function() {
    var h1 = Hand.solve(['2s', '3s', '3h'], gameForTest, false);
    var h2 = Hand.solve(['3h', 'Ac', '2s'], gameForTest, true);
    var winners = Hand.winners([h1, h2]);
    winners.length.should.equal(1);
    return winners[0].should.equal(h2);
  });
  it('should detect the winning hand - straight higher than flush', function() {
    var h1 = Hand.solve(['3h', 'Ac', '2s'], gameForTest, true);
    var h2 = Hand.solve(['2s', '3s', '8s'], gameForTest, false);
    var winners = Hand.winners([h1, h2]);
    winners.length.should.equal(1);
    return winners[0].should.equal(h1);
  });
  it('should detect a tie', function() {
    var h1 = Hand.solve(['2s', '3s', '4h'], gameForTest, true);
    var h2 = Hand.solve(['2h', '3h', '4d'], gameForTest, false);
    var winners = Hand.winners([h1, h2]);
    winners.length.should.equal(2);
    (winners.indexOf(h1) >= 0).should.equal(true);
    return (winners.indexOf(h2) >= 0).should.equal(true);
  });
  it('should account for a disqualified hand', function() {
    var player = Hand.solve(['5c', '3d', '2s'], gameForTest, false);
    var dealer = Hand.solve(['Jh', '8s', 'Tc'], gameForTest, true);
    var winners = Hand.winners([player, dealer]);
    winners.length.should.equal(1);
    return winners[0].should.equal(player);
  });
});
