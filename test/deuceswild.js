var should = require('should');
var Hand = require('../pokersolver').Hand;
var Flush = require('../pokersolver').Flush;
var StraightFlush = require('../pokersolver').StraightFlush;
var NaturalRoyalFlush = require('../pokersolver').NaturalRoyalFlush;
var WildRoyalFlush = require('../pokersolver').WildRoyalFlush;
var Straight = require('../pokersolver').Straight;
var FiveOfAKind = require('../pokersolver').FiveOfAKind;
var FourOfAKind = require('../pokersolver').FourOfAKind;
var FourWilds = require('../pokersolver').FourWilds;
var FullHouse = require('../pokersolver').FullHouse;
var ThreeOfAKind = require('../pokersolver').ThreeOfAKind;
var Game = require('../pokersolver').Game;

var gameForTest = new Game('deuceswild');

// Deuces Wild is designed to be for five cards, but can be for any number.
describe('A basic hand', function() {
  it('should return a hand with cards sorted descending, wilds last', function() {
    var hand = Hand.solve(['Kh', 'Tc', 'As', '3s', '2h'], gameForTest);
    hand.cardPool[0].toString().should.equal('As');
    return hand.cardPool[4].toString().should.equal('Ah');
  });
  return it('should return a correct description with a deuce', function() {
    var hand = Hand.solve(['Kh', 'As', '3c', '3s', '2h'], gameForTest);
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
  return it('should be detected as not possible with a deuce', function() {
    var hand = new NaturalRoyalFlush(['2s', 'Ks', 'Js', 'Ts', 'Qs'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('A Wild Royal Flush', function() {
  it('should be detected as possible', function() {
    var hand = new WildRoyalFlush(['As', '2s', 'Js', 'Ts', 'Ks'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new WildRoyalFlush(['7s', '2s', 'Js', 'Ts', '9s'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  it('should be detected as possible with any deuce - inside', function() {
    var hand = new WildRoyalFlush(['Ks', 'As', 'Js', 'Ts', '2d'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as possible with a deuce - outside', function() {
    var hand = new WildRoyalFlush(['Ks', 'Qs', 'Js', 'Ts', '2h'], gameForTest);
    hand.isPossible.should.equal(true);
  });
  it('should be detected as possible with two deuces - inside/outside', function() {
    var hand = new WildRoyalFlush(['2c', 'Qs', 'Ts', 'Ks', '2s'], gameForTest);
    hand.isPossible.should.equal(true);
  });
  return it('should be detected as possible with deuces - can set as low', function() {
    var hand = new WildRoyalFlush(['Qs', '2s', 'As', 'Js', 'Ks'], gameForTest);
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
  it('should be detected as possible with a deuce - inside', function() {
    var hand = new StraightFlush(['7s', '8s', 'Js', 'Ts', '2s'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as possible with a deuce - outside', function() {
    var hand = new StraightFlush(['7s', '8s', '9s', 'Ts', '2c'], gameForTest);
    hand.isPossible.should.equal(true);
    return hand.descr.should.equal('Straight Flush, Js High');
  });
  it('should be detected as possible with two deuces - inside/outside', function() {
    var hand = new StraightFlush(['2d', '8s', 'Js', 'Ts', '2h'], gameForTest);
    hand.isPossible.should.equal(true);
    return hand.descr.should.equal('Straight Flush, Qs High');
  });
  it('should be detected as possible with deuces - highest possible', function() {
    var hand = new StraightFlush(['Qs', '2s', '8s', 'Js', 'Kh', 'Ts', '2c'], gameForTest);
    hand.isPossible.should.equal(true);
    return hand.descr.should.equal('Royal Flush');
  });
  it('should be detected as possible with deuces - can set as low', function() {
    var hand = new StraightFlush(['Qs', '2h', 'As', 'Js', 'Kh', 'Ts', '2d'], gameForTest);
    hand.isPossible.should.equal(true);
    return hand.descr.should.equal('Royal Flush');
  });
  return it('should be detected as not possible, even with a deuce', function() {
    var hand = new StraightFlush(['2c', '8s', 'Js', 'Ts', '9d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('A Five of a Kind', function() {
  it('should be detected as possible with deuce', function() {
    var hand = new FiveOfAKind(['7h', '7d', '2s', '7s', '7c'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  return it('should be detected as not possible', function() {
    var hand = new FiveOfAKind(['7h', '7d', '3s', '7s', '7c'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  return it('should be detected as not possible, even with a deuce', function() {
    var hand = new FiveOfAKind(['7h', '2c', '3s', '7s', '7c'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('Four Deuces', function() {
  it('should be detected as possible', function() {
    var hand = new FourWilds(['2h', '2d', '3s', '2s', '2c'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  return it('should be detected as not possible', function() {
    var hand = new FourWilds(['2h', '3d', '3s', '2s', '2c'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('A Four of a Kind', function() {
  it('should be detected as possible', function() {
    var hand = new FourOfAKind(['7h', '7d', '3s', '7s', '7c'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as possible with a deuce', function() {
    var hand = new FourOfAKind(['7h', '3d', '2s', '7s', '7c'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new FourOfAKind(['7h', '3d', '3s', '7s', '7c'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  return it('should be detected as not possible, even with a deuce', function() {
    var hand = new FourOfAKind(['7h', '3d', '3s', '2s', '7c'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('A Full House', function() {
  it('should be detected as possible, with/without deuce 1', function() {
    var hand = new FullHouse(['Qd', 'Js', 'Qc', 'Jc', 'Jd'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as possible, with/without deuce 2', function() {
    var hand = new FullHouse(['9c', '9d', 'Jh', 'Jc', 'Js', '9h', 'As'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as possible, with/without deuce 3', function() {
    var hand = new FullHouse(['9c', '9d', '2s', 'Jc', 'Js'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as possible, with/without deuce 4', function() {
    var hand = new FullHouse(['9c', '9d', 'Jh', '2s', 'Js', '9h', 'As'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as possible, with/without deuce 5', function() {
    var hand = new FullHouse(['9h', '9s', '2s', '5c', 'Kd', '5d', 'Kh'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible, with/without deuce', function() {
    var hand = new FullHouse(['Kd', '6h', '7s', '7d', 'Kh'], gameForTest);
    hand.isPossible.should.equal(false);
    hand = new FullHouse(['9h', '9s', '2s', '5d', 'Kh'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  it('should pick the high kickers', function() {
    var hand = new FullHouse(['5d', '5h', '3h', '3c', 'Qh', 'Qd', 'Qs'], gameForTest);
    hand.cards.toString().indexOf('3h').should.equal(-1);
    hand = new FullHouse(['5d', '5h', '3h', '3c', '2s', 'Qd', 'Qs'], gameForTest);
    return hand.cards.toString().indexOf('3h').should.equal(-1);
  });
  it('should be in order', function() {
    var hand = new FullHouse(['9c', 'Qs', '9h', '5h', 'Ts', 'Qc', 'Qh'], gameForTest);
    hand.cards.toString().should.equal('Qs,Qc,Qh,9c,9h');
    hand = new FullHouse(['9c', 'Qs', '9h', '5h', 'Ts', '2s', 'Qh'], gameForTest);
    return hand.cards.toString().should.equal('Qs,Qh,Qs,9c,9h');
  });
});

describe('A Flush', function() {
  it('should be detected as possible', function() {
    var hand = new Flush(['4h', 'Th', '5h', '3h', 'Kh'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new Flush(['Th', '5h', '3h', 'Kh', '8d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  it('should be detected as possible with a deuce, highest rank', function() {
    var hand = new Flush(['4h', 'Th', '5h', '2c', 'Kh'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as possible with a deuce, next highest rank', function() {
    var hand = new Flush(['4h', 'Th', 'Ah', '2s', 'Kh'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  return it('should be detected as not possible, even with deuce', function() {
    var hand = new Flush(['4s', 'Th', '2s', 'Ac', '3h', 'Kh', '8d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('A Straight', function() {
  it('should be detected as possible', function() {
    var hand = new Straight(['6s', '3s', '7s', '4s', '5c'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as possible', function() {
    var hand = new Straight(['5d', '6s', '7s', '8c', 'Ts', '9s', '3d'], gameForTest);
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
  it('should be detected as possible with a deuce - inside', function() {
    var hand = new Straight(['7s', '8s', 'Jc', 'Ts', '2d'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as possible with a deuce - outside', function() {
    var hand = new Straight(['7d', '8s', '9s', 'Ts', '2d'], gameForTest);
    hand.isPossible.should.equal(true);
    return hand.descr.should.equal('Straight, J High');
  });
  it('should be detected as possible with two deuces - inside/outside', function() {
    var hand = new Straight(['2c', '8s', 'Jh', 'Ts', '2d'], gameForTest);
    hand.isPossible.should.equal(true);
    return hand.descr.should.equal('Straight, Q High');
  });
  it('should be detected as possible with deuces - highest possible', function() {
    var hand = new Straight(['Qs', '2c', '8s', 'Jh', 'Kh', 'Ts', '2d'], gameForTest);
    hand.isPossible.should.equal(true);
    return hand.descr.should.equal('Straight, A High');
  });
  it('should be detected as possible with deuces - can set as low', function() {
    var hand = new Straight(['Qs', '2h', 'As', 'Js', 'Kh', 'Ts', '2s'], gameForTest);
    hand.isPossible.should.equal(true);
    return hand.descr.should.equal('Straight, A High');
  });
  return it('should be detected as not possible, even with a deuce', function() {
    var hand = new Straight(['2c', '8s', 'Js', 'Ts', '8d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
});

describe('Three of a Kind', function() {
  it('should be detected as possible', function() {
    var hand = new ThreeOfAKind(['5c', '5s', '5h', '6c', '3d'], gameForTest);
    hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new ThreeOfAKind(['5c', '3h', '5h', '6c', '3d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  it('should be detected as possible with deuce', function() {
    var hand = new ThreeOfAKind(['5c', '5s', '2c', '6c', '3d'], gameForTest);
    hand.isPossible.should.equal(true);
  });
  return it('should be detected as not possible', function() {
    var hand = new ThreeOfAKind(['5c', '7h', '3c', '6c', '2d'], gameForTest);
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
    var hand = Hand.solve(['7h', '7d', '3s', '4s', '7c'], gameForTest, true);
    var winners = Hand.winners([hand]);
    winners.length.should.equal(1);
    return winners[0].should.equal(hand);
  });
  it('Three of a Kind should qualify with deuces', function() {
    var hand = Hand.solve(['2h', '2d', '3s', '2s', '7c'], gameForTest, true);
    var winners = Hand.winners([hand]);
    winners.length.should.equal(1);
    return winners[0].should.equal(hand);
  });
  it('Two Pair should not qualify', function() {
    var hand = Hand.solve(['5c', '4s', '4c', '3d', '3h'], gameForTest, true);
    var winners = Hand.winners([hand]);
    return winners.length.should.equal(0);
  });
  it('One Pair should not qualify', function() {
    var hand = Hand.solve(['Ah', 'As', '6d', '3s', '4h'], gameForTest, true);
    var winners = Hand.winners([hand]);
    return winners.length.should.equal(0);
  });
  it('High Card should not qualify', function() {
    var hand = Hand.solve(['Qh', '9s', 'Ad', 'Ks', 'Jh'], gameForTest, true);
    var winners = Hand.winners([hand]);
    return winners.length.should.equal(0);
  });
});
