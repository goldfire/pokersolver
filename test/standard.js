var should = require('should');
var Hand = require('../pokersolver').Hand;
var Flush = require('../pokersolver').Flush;
var StraightFlush = require('../pokersolver').StraightFlush;
var Straight = require('../pokersolver').Straight;
var FourOfAKind = require('../pokersolver').FourOfAKind;
var FullHouse = require('../pokersolver').FullHouse;
var ThreeOfAKind = require('../pokersolver').ThreeOfAKind;
var TwoPair = require('../pokersolver').TwoPair;
var OnePair = require('../pokersolver').OnePair;
var Game = require('../pokersolver').Game;

var gameForTest = new Game('standard');

describe('A basic hand', function() {
  it('should return a hand with cards sorted descending', function() {
    var hand = Hand.solve(['Kh', 'Tc', '5d', 'As', '3c', '3s', '2h']);
    hand.cardPool[0].toString().should.equal('As');
    return hand.cardPool[6].toString().should.equal('2h');
  });
  it('should return a correct description', function() {
    var hand = Hand.solve(['Kh', 'Tc', '5d', 'As', '3c', '3s', '2h']);
    return hand.descr.should.equal('Pair, 3\'s');
  });
  return it('should return throw an Error for a hand with duplicate cards', function() {
    (function () {
      Hand.solve(['As', 'Qh', 'Ts', 'As', '2d']);
    }).should.throw();
  });
});

describe('A Straight Flush', function() {
  it('should be detected as possible', function() {
    var hand = new StraightFlush(['Qd', '7s', '8s', 'Js', 'Kh', 'Ts', '9s'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new StraightFlush(['Qd', '7s', '8s', 'Js', 'Kh', 'Ts', '9d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  return it('should return 5 cards with low ace', function() {
    var hand = new StraightFlush(['Ad', '2d', '3d', '4d', '5d', 'Ts', '9d'], gameForTest);
    return hand.cards.length.should.equal(5);
  });
});

describe('A Four of a Kind', function() {
  it('should be detected as possible', function() {
    var hand = new FourOfAKind(['7h', '7d', '3s', '2c', '7s', '7c', '4s'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  return it('should be detected as not possible', function() {
    var hand = new FourOfAKind(['7h', '3d', '3s', '2c', '7s', '7c', '4s'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('A Full House', function() {
  it('should be detected as possible', function() {
    var hand = new FullHouse(['Qd', 'Js', '3h', 'Qc', '7d', 'Jc', 'Jd'], gameForTest);
    hand.isPossible.should.equal(true);
    hand = new FullHouse(['9c', '9d', 'Jh', 'Jc', 'Js', '9h', 'As'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new FullHouse(['5h', '3h', '3c', '5d', '2s', 'Ts', 'Td'], gameForTest);
    hand.isPossible.should.equal(false);
    hand = new FullHouse(['5s', '9d', 'Kd', '6h', '7s', '7d', 'Kh'], gameForTest);
    hand.isPossible.should.equal(false);
    hand = new FullHouse(['9h', '9s', '3d', '5c', 'Kd', '5d', 'Kh'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  it('should pick the high kickers', function() {
    var hand = new FullHouse(['5d', '5h', '3h', '3c', 'Qh', 'Qd', 'Qs'], gameForTest);
    return hand.cards.toString().indexOf('3h').should.equal(-1);
  });
  return it('should be in order', function() {
    var hand;
    hand = new FullHouse(['9c', 'Qs', '9h', '5h', 'Ts', 'Qc', 'Qh'], gameForTest);
    return hand.cards.toString().should.equal('Qs,Qc,Qh,9c,9h');
  });
});

describe('A Flush', function() {
  it('should be detected as possible', function() {
    var hand = new Flush(['4h', 'Th', '5h', 'Ac', '2h', 'Kh', '8d'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  return it('should be detected as not possible', function() {
    var hand = new Flush(['4s', 'Th', '5h', 'Ac', '2h', 'Kh', '8d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('A Straight', function() {
  it('should be detected as possible', function() {
    var hand = new Straight(['5c', '6s', '3s', '2s', '5s', '4s', '5d'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as possible', function() {
    var hand = new Straight(['5d', '6s', '7s', '8c', 'Ts', '9s', '2d'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new Straight(['5h', '6s', '6h', '7c', '2s', 'Ts', '8d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  it('should detect a low ace', function() {
    var hand = new Straight(['2c', '3s', '4h', '5c', 'As', 'Ts', '8d'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should detect a high ace', function() {
    var hand = new Straight(['2d', '3s', '4h', '7c', 'As', 'Ts', 'Kd'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  return it('should know that an ace is not high in a wheel', function() {
    var lowHand = new Straight(['2s', '3s', '4h', '5c', 'As', 'Ts', '8d'], gameForTest);
    var highHand = new Straight(['2s', '3s', '4h', '5c', '6s', 'Ts', '8d'], gameForTest);
    return highHand.loseTo(lowHand).should.equal(false);
  });
});

describe('Three of a Kind', function() {
  it('should be detected as possible', function() {
    var hand = new ThreeOfAKind(['5c', '5s', '5h', '6c', 'Td', '9s', '2d'], gameForTest);
    hand.isPossible.should.equal(true);
    return hand.toString().should.equal('5c, 5s, 5h, 10d, 9s');
  });
  return it('should be detected as not possible', function() {
    var hand = new ThreeOfAKind(['5c', '2h', '5h', '6c', 'Ts', '9s', '2d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('Two Pair', function() {
  it('should be detected as possible', function() {
    var hand = new TwoPair(['5c', '5d', '6s', '6c', 'Td', '9s', '2d'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  return it('should be detected as not possible', function() {
    var hand = new TwoPair(['5c', '6s', '6h', '7c', '2d', 'Ts', '8d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('One Pair', function() {
  it('should be detected as possible', function() {
    var hand = new OnePair(['5h', '5c', '7s', '6c', 'Ts', '9s', '2d'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new OnePair(['5h', '6s', 'Jh', '7c', '2s', 'Ts', '8d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  return it('should select the correct winner', function() {
    var highHand = new OnePair(['4d', '4h', 'Ah', 'Jc', 'Ts', '7s', '8d'], gameForTest);
    var lowHand = new OnePair(['4d', '4h', 'Ac', 'Tc', '9s', '7c', '8d'], gameForTest);
    return lowHand.loseTo(highHand).should.equal(true) && highHand.loseTo(lowHand).should.equal(false);
  });
});

describe('Building hands from 7 cards', function() {
  it('should return best hand as Two Pair', function() {
    var hand = Hand.solve(['8d', '8s', '4s', '5c', 'Qd', '5d', 'Qh']);
    return hand.name.should.equal('Two Pair');
  });
  it('should detect the best hand string (#1)', function() {
    var hand = Hand.solve(['8d', '8s', '4s', '5c', 'Qd', '5d', 'Qh']);
    return hand.toString().should.equal('Qd, Qh, 8d, 8s, 5c');
  });
  return it('should detect the best hand string (#2)', function() {
    var hand = Hand.solve(['4s', '4h', 'Ah', 'Jc', 'Ts', '7s', '8d']);
    return hand.toString().should.equal('4s, 4h, Ah, Jc, 10s');
  });
});

describe('Building hands from 5 cards', function() {
  return it('should return best hand as Two Pair', function() {
    var hand = Hand.solve(['8d', '8s', 'Qd', 'Ad', 'Qh']);
    return hand.name.should.equal('Two Pair');
  });
});

describe('Determining winning hands', function() {
  it('should detect the winning hand from a list', function() {
    var h1 = Hand.solve(['2s', '3s', '4h', '5c', 'As', 'Ts', '8d']);
    var h2 = Hand.solve(['5s', 'Td', '3h', 'Ac', '2s', 'Ts', '8d']);
    var h3 = Hand.solve(['5s', '5h', '3s', '3c', '2s', 'Ts', '3d']);
    var winners = Hand.winners([h1, h2, h3]);
    winners.length.should.equal(1);
    return winners[0].should.equal(h3);
  });
  return it('should detect the winning hands from a list', function() {
    var h1 = Hand.solve(['2s', '3s', '4h', '5c', 'As', 'Ts', '8d']);
    var h2 = Hand.solve(['2h', '3h', '4d', '5d', 'Ah', 'Tc', '8c']);
    var h3 = Hand.solve(['5s', 'Ts', '3h', 'Ac', '2s', 'Tc', '8d']);
    var winners = Hand.winners([h1, h2, h3]);
    winners.length.should.equal(2);
    (winners.indexOf(h1) >= 0).should.equal(true);
    return (winners.indexOf(h2) >= 0).should.equal(true);
  });
});
