var should = require('should');
var Hand = require('../pokersolver').Hand;
var Flush = require('../pokersolver').Flush;
var StraightFlush = require('../pokersolver').StraightFlush;
var Straight = require('../pokersolver').Straight;
var FourOfAKind = require('../pokersolver').FourOfAKind;
var ThreeOfAKind = require('../pokersolver').ThreeOfAKind;
var TwoPair = require('../pokersolver').TwoPair;
var OnePair = require('../pokersolver').OnePair;
var Game = require('../pokersolver').Game;

var gameForTest = new Game('fourcardbonus');

// Four Card Poker is only three cards, and a different ranking.
// This is ONLY for the purposes of the bonus bet.
describe('A basic hand', function() {
  it('should return a hand with cards sorted descending', function() {
    var hand = Hand.solve(['Kh', 'Tc', 'As', '3s', '2h'], gameForTest);
    hand.cardPool[0].toString().should.equal('As');
    return hand.cardPool[4].toString().should.equal('2h');
  });
  return it('should return a correct description', function() {
    var hand = Hand.solve(['Kh', 'As', 'Ad', '3s', '2h'], gameForTest);
    return hand.descr.should.equal('Pair, A\'s');
  });
});

describe('A Four of a Kind', function() {
  it('should be detected as possible', function() {
    var hand = new FourOfAKind(['7h', '7d', '7s', '7c'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  return it('should be detected as not possible', function() {
    var hand = new FourOfAKind(['7h', '3d', '7s', '7c'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('A Straight Flush', function() {
  it('should be detected as possible', function() {
    var hand = new StraightFlush(['8s', 'Js', 'Ts', '9s'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  return it('should be detected as not possible', function() {
    var hand = new StraightFlush(['8s', 'Js', 'Ts', '9d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('Three of a Kind', function() {
  it('should be detected as possible', function() {
    var hand = new ThreeOfAKind(['5c', '5s', '5h', '6c'], gameForTest);
    hand.isPossible.should.equal(true);
  });
  return it('should be detected as not possible', function() {
    var hand = new ThreeOfAKind(['5c', '2h', '5h', '2d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('A Flush', function() {
  it('should be detected as possible', function() {
    var hand = new Flush(['4h', '5h', '2h', 'Kh'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  return it('should be detected as not possible', function() {
    var hand = new Flush(['Th', '2h', 'Kh', '8d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('A Straight', function() {
  it('should be detected as possible', function() {
    var hand = new Straight(['3s', '2s', '4s', '5c'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new Straight(['6s', '6h', '7c', '8d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  it('should detect a low ace', function() {
    var hand = new Straight(['2c', '3s', '4h', 'As'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  return it('should detect a high ace', function() {
    var hand = new Straight(['2d', '3s', 'As', 'Kd'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('Two Pair', function() {
  it('should be detected as possible', function() {
    var hand = new TwoPair(['5c', '5c', '6s', '6c'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  return it('should be detected as not possible', function() {
    var hand = new TwoPair(['5c', '6s', '6h', '8d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('One Pair', function() {
  it('should be detected as possible', function() {
    var hand = new OnePair(['5h', '5c', '9s', '2d'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  return it('should be detected as not possible', function() {
    var hand = new OnePair(['5h', '6s', 'Ts', '8d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('Qualifying Hands', function() {
  it('Straight Flush should qualify', function() {
    var hand = Hand.solve(['8s', 'Js', 'Ts', '9s'], gameForTest, true);
    var winners = Hand.winners([hand]);
    winners.length.should.equal(1);
    return winners[0].should.equal(hand);
  });
  it('Four of a Kind should qualify', function() {
    var hand = Hand.solve(['7h', '7d', '7s', '7c'], gameForTest, true);
    var winners = Hand.winners([hand]);
    winners.length.should.equal(1);
    return winners[0].should.equal(hand);
  });
  it('Flush should qualify', function() {
    var hand = Hand.solve(['7s', '8s', 'Ts', 'Qs'], gameForTest, true);
    var winners = Hand.winners([hand]);
    winners.length.should.equal(1);
    return winners[0].should.equal(hand);
  });
  it('Straight should qualify', function() {
    var hand = Hand.solve(['7s', '8d', 'Ts', '9s'], gameForTest, true);
    var winners = Hand.winners([hand]);
    winners.length.should.equal(1);
    return winners[0].should.equal(hand);
  });
  it('Three of a Kind should qualify', function() {
    var hand = Hand.solve(['7h', '7d', '2s', '7c'], gameForTest, true);
    var winners = Hand.winners([hand]);
    winners.length.should.equal(1);
    return winners[0].should.equal(hand);
  });
  it('Two Pair should qualify', function() {
    var hand = Hand.solve(['9c', '9d', 'Jc', 'Js'], gameForTest, true);
    var winners = Hand.winners([hand]);
    winners.length.should.equal(1);
    return winners[0].should.equal(hand);
  });
  it('Pair of Aces should qualify', function() {
    var hand = Hand.solve(['Ah', 'As', '3s', '2h'], gameForTest, true);
    var winners = Hand.winners([hand]);
    winners.length.should.equal(1);
    return winners[0].should.equal(hand);
  });
  it('Lower Pair should not qualify', function() {
    var hand = Hand.solve(['Jh', 'Js', '3s', '2h'], gameForTest, true);
    var winners = Hand.winners([hand]);
    return winners.length.should.equal(0);
  });
  it('High Card should not qualify', function() {
    var hand = Hand.solve(['Qh', '9s', 'Ad', 'Jh'], gameForTest, true);
    var winners = Hand.winners([hand]);
    return winners.length.should.equal(0);
  });
});
