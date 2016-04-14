var should = require('should');
var Hand = require('../pokersolver').Hand;
var NaturalRoyalFlush = require('../pokersolver').NaturalRoyalFlush;
var FiveOfAKind = require('../pokersolver').FiveOfAKind;
var WildRoyalFlush = require('../pokersolver').WildRoyalFlush;
var StraightFlush = require('../pokersolver').StraightFlush;
var FourOfAKind = require('../pokersolver').FourOfAKind;
var FullHouse = require('../pokersolver').FullHouse;
var Flush = require('../pokersolver').Flush;
var Straight = require('../pokersolver').Straight;
var ThreeOfAKind = require('../pokersolver').ThreeOfAKind;
var TwoPair = require('../pokersolver').TwoPair;
var Game = require('../pokersolver').Game;

var gameForTest = new Game('joker');

// Joker Poker is designed to be for five cards, but can be for any number.
// Qualification is not used, as straight hand rank determines pay.
describe('A basic hand', function() {
  it('should return a hand with cards sorted descending', function() {
    var hand = Hand.solve(['Kh', 'Tc', 'As', '3s', '2h'], gameForTest);
    hand.cardPool[0].toString().should.equal('As');
    return hand.cardPool[4].toString().should.equal('2h');
  });
  it('should return a hand with cards sorted descending, jokers last, but set to value', function() {
    var hand = Hand.solve(['Kh', 'Or', 'As', '7c', '2h'], gameForTest);
    hand.cardPool[0].toString().should.equal('As');
    return hand.cardPool[4].toString().should.equal('Ar');
  });
  return it('should return a correct description with a joker', function() {
    var hand = Hand.solve(['Kh', 'As', '3c', '3s', 'Or'], gameForTest);
    return hand.descr.should.equal('Three of a Kind, 3\'s');
  });
});

describe('A Natural Royal Flush', function() {
  it('should be detected as possible', function() {
    var hand = new NaturalRoyalFlush(['As', 'Qs', 'Js', 'Ts', 'Ks'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new NaturalRoyalFlush(['7s', '8s', 'Js', 'Ts', '9s'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  return it('should be detected as not possible with a joker', function() {
    var hand = new NaturalRoyalFlush(['Or', 'Ks', 'Js', 'Ts', 'Qs'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('A Wild Royal Flush', function() {
  it('should be detected as possible', function() {
    var hand = new WildRoyalFlush(['As', 'Or', 'Js', 'Ts', 'Ks'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new WildRoyalFlush(['7s', 'Or', 'Js', 'Ts', '9s'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  it('should be detected as possible with a joker - outside', function() {
    var hand = new WildRoyalFlush(['Ks', 'Qs', 'Js', 'Ts', 'Or'], gameForTest);
    hand.isPossible.should.equal(true);
  });
  it('should be detected as possible with two jokers - inside/outside', function() {
    var hand = new WildRoyalFlush(['Or', 'Qs', 'Ts', 'Ks', 'Or'], gameForTest);
    hand.isPossible.should.equal(true);
  });
  return it('should be detected as possible with jokers - can set as low', function() {
    var hand = new WildRoyalFlush(['Qs', 'Or', 'As', 'Js', 'Ks'], gameForTest);
    hand.isPossible.should.equal(true);
  });
});

describe('A Straight Flush', function() {
  it('should be detected as possible', function() {
    var hand = new StraightFlush(['7s', '8s', 'Js', 'Ts', '9s'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new StraightFlush(['7s', '8s', 'Js', 'Ts', '9d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  it('should be detected as possible with a joker - inside', function() {
    var hand = new StraightFlush(['7s', '8s', 'Js', 'Ts', 'Or'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as possible with a joker - outside', function() {
    var hand = new StraightFlush(['7s', '8s', '9s', 'Ts', 'Or'], gameForTest);
    hand.isPossible.should.equal(true);
    return hand.descr.should.equal('Straight Flush, Js High');
  });
  it('should be detected as possible with two jokers - inside/outside', function() {
    var hand = new StraightFlush(['Or', '8s', 'Js', 'Ts', 'Or'], gameForTest);
    hand.isPossible.should.equal(true);
    return hand.descr.should.equal('Straight Flush, Qs High');
  });
  it('should be detected as possible with jokers - highest possible', function() {
    var hand = new StraightFlush(['9s', 'Or', '7s', 'Js', 'Kh', 'Ts', 'Or'], gameForTest);
    hand.isPossible.should.equal(true);
    return hand.descr.should.equal('Straight Flush, Ks High');
  });
  it('should be detected as possible with jokers - can set as low', function() {
    var hand = new StraightFlush(['Qs', 'Or', 'As', 'Js', 'Kh', 'Ts', 'Or'], gameForTest);
    hand.isPossible.should.equal(true);
    return hand.descr.should.equal('Royal Flush');
  });
  return it('should be detected as not possible, even with a joker', function() {
    var hand = new StraightFlush(['Or', '8s', 'Js', 'Ts', '9d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('A Five of a Kind', function() {
  it('should be detected as possible with joker', function() {
    var hand = new FiveOfAKind(['7h', '7d', 'Or', '7s', '7c'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  return it('should be detected as not possible', function() {
    var hand = new FiveOfAKind(['7h', '7d', '3s', '7s', '7c'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  return it('should be detected as not possible, even with a joker', function() {
    var hand = new FiveOfAKind(['7h', 'Or', '3s', '7s', '7c'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('A Four of a Kind', function() {
  it('should be detected as possible', function() {
    var hand = new FourOfAKind(['7h', '7d', '3s', '7s', '7c'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as possible with a joker', function() {
    var hand = new FourOfAKind(['7h', '3d', 'Or', '7s', '7c'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new FourOfAKind(['7h', '3d', '3s', '7s', '7c'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  return it('should be detected as not possible, even with a joker', function() {
    var hand = new FourOfAKind(['7h', '3d', '3s', 'Or', '7c'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('A Full House', function() {
  it('should be detected as possible, with/without joker', function() {
    var hand = new FullHouse(['Qd', 'Js', 'Qc', 'Jc', 'Jd'], gameForTest);
    hand.isPossible.should.equal(true);
    hand = new FullHouse(['9c', '9d', 'Jh', 'Jc', 'Js', '9h', 'As'], gameForTest);
    hand.isPossible.should.equal(true);
    hand = new FullHouse(['9c', '9d', 'Or', 'Jc', 'Js'], gameForTest);
    hand.isPossible.should.equal(true);
    hand = new FullHouse(['9c', '9d', 'Jh', 'Or', 'Js', '9h', 'As'], gameForTest);
    hand.isPossible.should.equal(true);
    hand = new FullHouse(['9h', '9s', 'Or', '5c', 'Kd', '5d', 'Kh'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible, with/without joker', function() {
    var hand = new FullHouse(['5h', '3h', '3c', '5d', '2s', 'Ts', 'Td'], gameForTest);
    hand.isPossible.should.equal(false);
    hand = new FullHouse(['Kd', '6h', '7s', '7d', 'Kh'], gameForTest);
    hand.isPossible.should.equal(false);
    hand = new FullHouse(['9h', '9s', 'Or', '5d', 'Kh'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  it('should pick the high kickers', function() {
    var hand = new FullHouse(['5d', '5h', '3h', '3c', 'Qh', 'Qd', 'Qs'], gameForTest);
    hand.cards.toString().indexOf('3h').should.equal(-1);
    hand = new FullHouse(['5d', '5h', '3h', '3c', 'Or', 'Qd', 'Qs'], gameForTest);
    return hand.cards.toString().indexOf('3h').should.equal(-1);
  });
  it('should be in order', function() {
    var hand = new FullHouse(['9c', 'Qs', '9h', '5h', 'Ts', 'Qc', 'Qh'], gameForTest);
    hand.cards.toString().should.equal('Qs,Qc,Qh,9c,9h');
    hand = new FullHouse(['9c', 'Qs', '9h', '5h', 'Ts', 'Or', 'Qh'], gameForTest);
    return hand.cards.toString().should.equal('Qs,Qh,Qr,9c,9h');
  });
});

describe('A Flush', function() {
  it('should be detected as possible', function() {
    var hand = new Flush(['4h', 'Th', '5h', '2h', 'Kh'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new Flush(['Th', '5h', '2h', 'Kh', '8d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  it('should be detected as possible with a joker, highest rank', function() {
    var hand = new Flush(['4h', 'Th', '5h', 'Or', 'Kh'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as possible with a joker, next highest rank', function() {
    var hand = new Flush(['4h', 'Th', 'Ah', 'Or', 'Kh'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  return it('should be detected as not possible, even with joker', function() {
    var hand = new Flush(['4s', 'Th', 'Or', 'Ac', '2h', 'Kh', '8d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('A Straight', function() {
  it('should be detected as possible', function() {
    var hand = new Straight(['6s', '3s', '2s', '4s', '5c'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as possible', function() {
    var hand = new Straight(['5d', '6s', '7s', '8c', 'Ts', '9s', '2d'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new Straight(['5h', '6s', '6h', '7c', '8d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  it('should detect a low ace', function() {
    var hand = new Straight(['2c', '3s', '4h', '5c', 'As'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should detect a high ace', function() {
    var hand = new Straight(['2d', '3s', '4h', '7c', 'As', 'Ts', 'Kd'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  it('should be detected as possible with a joker - inside', function() {
    var hand = new Straight(['7s', '8s', 'Jc', 'Ts', 'Or'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as possible with a joker - outside', function() {
    var hand = new Straight(['7d', '8s', '9s', 'Ts', 'Or'], gameForTest);
    hand.isPossible.should.equal(true);
    return hand.descr.should.equal('Straight, J High');
  });
  it('should be detected as possible with two jokers - inside/outside', function() {
    var hand = new Straight(['Or', '8s', 'Jh', 'Ts', 'Or'], gameForTest);
    hand.isPossible.should.equal(true);
    return hand.descr.should.equal('Straight, Q High');
  });
  it('should be detected as possible with jokers - highest possible', function() {
    var hand = new Straight(['Qs', 'Or', '8c', 'Jh', 'Kh', 'Ts', 'Or'], gameForTest);
    hand.isPossible.should.equal(true);
    return hand.descr.should.equal('Straight, A High');
  });
  it('should be detected as possible with jokers - can set as low', function() {
    var hand = new Straight(['Qs', 'Or', 'As', 'Js', 'Kh', 'Ts', 'Or'], gameForTest);
    hand.isPossible.should.equal(true);
    return hand.descr.should.equal('Straight, A High');
  });
  return it('should be detected as not possible, even with a joker', function() {
    var hand = new Straight(['Or', '8s', 'Js', 'Ts', '8d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('Three of a Kind', function() {
  it('should be detected as possible', function() {
    var hand = new ThreeOfAKind(['5c', '5s', '5h', '6c', '2d'], gameForTest);
    hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new ThreeOfAKind(['5c', '2h', '5h', '6c', '2d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  it('should be detected as possible with joker', function() {
    var hand = new ThreeOfAKind(['5c', '5s', 'Or', '6c', '2d'], gameForTest);
    hand.isPossible.should.equal(true);
  });
  return it('should be detected as not possible', function() {
    var hand = new ThreeOfAKind(['5c', '7h', 'Or', '6c', '2d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('Two Pair', function() {
  it('should be detected as possible', function() {
    var hand = new TwoPair(['5c', '5c', '6s', '6c', 'Td', '9s', '2d'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  return it('should be detected as not possible', function() {
    var hand = new TwoPair(['5c', '6s', '6h', '7c', '2d', 'Ts', '8d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('Qualifying Hands', function() {
  it('Royal Flush should qualify', function() {
    var hand = Hand.solve(['As', 'Or', 'Js', 'Ts', 'Qs'], gameForTest, true);
    var winners = Hand.winners([hand]);
    winners.length.should.equal(1);
    return winners[0].should.equal(hand);
  });
  it('Five of a Kind should qualify', function() {
    var hand = Hand.solve(['7h', '7d', 'Or', '7s', '7c'], gameForTest, true);
    var winners = Hand.winners([hand]);
    winners.length.should.equal(1);
    return winners[0].should.equal(hand);
  });
  it('Straight Flush should qualify', function() {
    var hand = Hand.solve(['7s', '8s', 'Js', 'Ts', '9s'], gameForTest, true);
    var winners = Hand.winners([hand]);
    winners.length.should.equal(1);
    return winners[0].should.equal(hand);
  });
  it('Four of a Kind should qualify', function() {
    var hand = Hand.solve(['7h', '7d', '3s', '7s', '7c'], gameForTest, true);
    var winners = Hand.winners([hand]);
    winners.length.should.equal(1);
    return winners[0].should.equal(hand);
  });
  it('Full House should qualify', function() {
    var hand = Hand.solve(['9c', '9d', 'Or', 'Jc', 'Js'], gameForTest, true);
    var winners = Hand.winners([hand]);
    winners.length.should.equal(1);
    return winners[0].should.equal(hand);
  });
  it('Flush should qualify', function() {
    var hand = Hand.solve(['7s', '8s', 'Js', 'Ts', 'Qs'], gameForTest, true);
    var winners = Hand.winners([hand]);
    winners.length.should.equal(1);
    return winners[0].should.equal(hand);
  });
  it('Straight should qualify', function() {
    var hand = Hand.solve(['7s', '8d', 'Js', 'Ts', '9s'], gameForTest, true);
    var winners = Hand.winners([hand]);
    winners.length.should.equal(1);
    return winners[0].should.equal(hand);
  });
  it('Three of a Kind should qualify', function() {
    var hand = Hand.solve(['7h', '7d', '3s', '2s', '7c'], gameForTest, true);
    var winners = Hand.winners([hand]);
    winners.length.should.equal(1);
    return winners[0].should.equal(hand);
  });
  it('Two Pair should qualify', function() {
    var hand = Hand.solve(['4c', '3d', '3h', '2s', '2c'], gameForTest, true);
    var winners = Hand.winners([hand]);
    winners.length.should.equal(1);
    return winners[0].should.equal(hand);
  });
  it('One Pair should not qualify', function() {
    var hand = Hand.solve(['Ah', 'As', '6d', '3s', '2h'], gameForTest, true);
    var winners = Hand.winners([hand]);
    return winners.length.should.equal(0);
  });
  it('High Card should not qualify', function() {
    var hand = Hand.solve(['Qh', '9s', 'Ad', 'Ks', 'Jh'], gameForTest, true);
    var winners = Hand.winners([hand]);
    return winners.length.should.equal(0);
  });
});
