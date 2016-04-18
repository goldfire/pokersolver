var should = require('should');
var Hand = require('../pokersolver').Hand;
var Flush = require('../pokersolver').Flush;
var StraightFlush = require('../pokersolver').StraightFlush;
var Straight = require('../pokersolver').Straight;
var FiveOfAKind = require('../pokersolver').FiveOfAKind;
var FourOfAKindPairPlus = require('../pokersolver').FourOfAKindPairPlus;
var FourOfAKind = require('../pokersolver').FourOfAKind;
var TwoThreeOfAKind = require('../pokersolver').TwoThreeOfAKind;
var ThreeOfAKindTwoPair = require('../pokersolver').ThreeOfAKindTwoPair;
var FullHouse = require('../pokersolver').FullHouse;
var ThreeOfAKind = require('../pokersolver').ThreeOfAKind;
var ThreePair = require('../pokersolver').ThreePair;
var TwoPair = require('../pokersolver').TwoPair;
var OnePair = require('../pokersolver').OnePair;
var HighCard = require('../pokersolver').HighCard;
var Game = require('../pokersolver').Game;
var PaiGowPokerHelper = require('../pokersolver').PaiGowPokerHelper;

var gameForTest = new Game('paigowpokerfull');

// Pai Gow Poker is a game that uses seven cards.
// These cards are divided into a five-card and two-card hand.
// Special Rules: Joker either completes a straight and/or flush, or is an ace.
//                The wheel straight (A2345) is the second highest straight.
describe('A basic hand', function() {
  it('should return a hand with cards sorted descending', function() {
    var hand = Hand.solve(['Kh', '3c', 'Tc', 'As', '3s', '7d', '2h'], gameForTest);
    hand.cardPool[0].toString().should.equal('As');
    return hand.cardPool[6].toString().should.equal('2h');
  });
  it('should return a hand with cards sorted descending, jokers last', function() {
    var hand = Hand.solve(['Kh', 'Or', 'Qs', 'Td', '5s', '7c', '2h'], gameForTest);
    hand.cardPool[0].toString().should.equal('Kh');
    return hand.cardPool[6].toString().should.equal('Ar');
  });
  it('should return a correct description with a joker', function() {
    var hand = Hand.solve(['Kh', 'Or', 'Qs', 'Td', '5s', '7c', '2h'], gameForTest);
    return hand.descr.should.equal('A High');
  });
  it('should use the helper class and be split according to House Way', function() {
    var hand = PaiGowPokerHelper.solve(['Kh', 'Or', 'Qs', 'Td', '5s', '7c', '2h']);
    hand.hiHand.descr.should.equal('A High');
    return hand.loHand.descr.should.equal('K High');
  });
  return it('should use the helper class and be split manually, even if not house way', function() {
    var hand = PaiGowPokerHelper.setHands(['Kh', 'Or', 'Qs', 'Td', '5s'], ['7c', '2h']);
    hand.hiHand.descr.should.equal('A High');
    return hand.loHand.descr.should.equal('7 High');
  });
});

describe('A Five of a Kind', function() {
  it('should be detected as possible with joker', function() {
    var hand = new FiveOfAKind(['Ah', 'Ad', 'Or', 'As', 'Ac', 'Kh', 'Qd'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible with joker', function() {
    var hand = new FiveOfAKind(['Ah', 'Kd', 'Or', 'Ks', 'Kc', 'Kh', 'Qd'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  it('should be split according to House Way', function() {
    var hand = PaiGowPokerHelper.solve(['Ah', 'Ad', 'Or', 'As', 'Ac', 'Kh', 'Kd']);
    hand.hiHand.descr.should.equal('Five of a Kind, A\'s');
    return hand.loHand.descr.should.equal('Pair, K\'s');
  });
  return it('should be split according to House Way', function() {
    var hand = PaiGowPokerHelper.solve(['Ah', 'Ad', 'Or', 'As', 'Ac', 'Kh', 'Qd']);
    hand.hiHand.descr.should.equal('Three of a Kind, A\'s');
    return hand.loHand.descr.should.equal('Pair, A\'s');
  });
});

describe('A Four of a Kind with Pair or Better', function() {
  it('should be detected as possible', function() {
    var hand = new FourOfAKindPairPlus(['Ah', 'Kd', 'Or', 'Ks', 'Kc', 'Kh', 'Qd'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new FourOfAKindPairPlus(['Ah', 'Ad', 'Or', 'As', 'Jc', 'Kh', 'Qd'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  it('should be split according to House Way', function() {
    var hand = PaiGowPokerHelper.solve(['Ah', 'Ad', 'Or', 'As', 'Jc', 'Kh', 'Kd']);
    hand.hiHand.descr.should.equal('Four of a Kind, A\'s');
    return hand.loHand.descr.should.equal('Pair, K\'s');
  });
  it('should be split according to House Way', function() {
    var hand = PaiGowPokerHelper.solve(['Ah', 'Ad', 'Or', 'As', 'Jc', 'Jh', 'Kd']);
    hand.hiHand.descr.should.equal('Two Pair, A\'s & J\'s');
    return hand.loHand.descr.should.equal('Pair, A\'s');
  });
  return it('should be split according to House Way', function() {
    var hand = PaiGowPokerHelper.solve(['Ah', 'Kd', 'Kh', 'Kc', 'Ac', 'Kh', 'Qd']);
    hand.hiHand.descr.should.equal('Four of a Kind, K\'s');
    return hand.loHand.descr.should.equal('Pair, A\'s');
  });
});

describe('A Straight Flush with No Pair', function() {
  it('should be detected as possible', function() {
    var hand = new StraightFlush(['7s', '8s', 'Js', 'Ts', '9s', 'Qd', '6c'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new StraightFlush(['7s', '8s', 'Js', 'Ts', '9d', 'Qc', '6h'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  it('should be split according to House Way, 5 cards', function() {
    var hand = PaiGowPokerHelper.solve(['7s', '8s', 'Js', 'Ts', '9s', 'Ad', '3c']);
    hand.hiHand.descr.should.equal('Straight Flush, Js High');
    return hand.loHand.descr.should.equal('A High');
  });
  it('should be split according to House Way, 6 cards', function() {
    var hand = PaiGowPokerHelper.solve(['7s', '8s', 'Js', 'Ts', '9s', 'Qd', '3c']);
    hand.hiHand.descr.should.equal('Straight Flush, Js High');
    return hand.loHand.descr.should.equal('Q High');
  });
  return it('should be split according to House Way, 7 cards', function() {
    var hand = PaiGowPokerHelper.solve(['7s', '8s', 'Js', 'Ts', '9s', 'Qd', '6c']);
    hand.hiHand.descr.should.equal('Straight, 10 High');
    return hand.loHand.descr.should.equal('Q High');
  });
});

describe('A Straight Flush with One Pair', function() {
  it('should be detected as possible', function() {
    var hand = new StraightFlush(['7s', '8s', 'Js', 'Ts', '9s', 'Jd', '6c'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new StraightFlush(['7s', '8s', 'Js', 'Ts', '9d', 'Jc', '6h'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  it('should be split according to House Way, Pair T-K with A, S/F with A in low', function() {
    var hand = PaiGowPokerHelper.solve(['7s', '8s', 'Js', 'Ts', '9s', 'Ad', 'Jc']);
    hand.hiHand.descr.should.equal('Straight Flush, Js High');
    return hand.loHand.descr.should.equal('A High');
  });
  it('should be split according to House Way, Pair T-K with A, A needed for S/F', function() {
    var hand = PaiGowPokerHelper.solve(['7d', 'Ks', 'Js', 'Ts', 'Qs', 'As', 'Jc']);
    hand.hiHand.descr.should.equal('Pair, J\'s');
    return hand.loHand.descr.should.equal('A High');
  });
  it('should be split according to House Way, Pair with preservation', function() {
    var hand = PaiGowPokerHelper.solve(['7s', '8s', 'Js', 'Ts', '9s', 'Qd', '7c']);
    hand.hiHand.descr.should.equal('Straight, Q High');
    return hand.loHand.descr.should.equal('Pair, 7\'s');
  });
  return it('should be split according to House Way, Pair without preservation', function() {
    var hand = PaiGowPokerHelper.solve(['7s', '8s', '9s', 'Ts', '6s', 'Qd', '6c']);
    hand.hiHand.descr.should.equal('Straight Flush, 10s High');
    return hand.loHand.descr.should.equal('Q High');
  });
});

describe('A Straight Flush with Two Pair', function() {
  it('should be detected as possible', function() {
    var hand = new StraightFlush(['As', '3s', '2s', '5s', '4s', '4d', '2c'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new StraightFlush(['As', '3s', '2d', '5s', '4s', '4d', '2c'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  it('should be split according to House Way, Two low pair with A', function() {
    var hand = PaiGowPokerHelper.solve(['As', '3s', '2s', '5s', '4s', '4d', '2c']);
    hand.hiHand.descr.should.equal('Two Pair, 4\'s & 2\'s');
    return hand.loHand.descr.should.equal('A High');
  });
  it('should be split according to House Way, Two low pair without A', function() {
    var hand = PaiGowPokerHelper.solve(['6s', '3s', '2s', '5s', '4s', '4d', '2c']);
    hand.hiHand.descr.should.equal('Straight Flush, 6s High');
    return hand.loHand.descr.should.equal('4 High');
  });
  return it('should be split according to House Way, At least one higher pair', function() {
    var hand = PaiGowPokerHelper.solve(['6s', '3s', '7s', '5s', '4s', '4d', '7c']);
    hand.hiHand.descr.should.equal('Pair, 7\'s');
    return hand.loHand.descr.should.equal('Pair, 4\'s');
  });
});

describe('A Straight Flush with Three Pair', function() {
  it('should be detected as possible', function() {
    var hand = new StraightFlush(['As', '3s', '2s', 'Or', '4s', '4d', '2c'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new StraightFlush(['As', '3s', '2s', 'Or', '4h', '4d', '2c'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  return it('should be split according to House Way, Three Pair', function() {
    var hand = PaiGowPokerHelper.solve(['As', '3s', '2s', 'Or', '4s', '4d', '2c']);
    hand.hiHand.descr.should.equal('Two Pair, 4\'s & 2\'s');
    return hand.loHand.descr.should.equal('Pair, A\'s');
  });
});

describe('A Straight with Three of a Kind', function() {
  it('should be detected as possible', function() {
    var hand = new Straight(['6s', '3s', '2s', '4s', '5c', '5h', '5d'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new Straight(['5h', '6s', '6h', '7c', '8d', '6c', 'Td'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  return it('should be split according to House Way, Three of a Kind', function() {
    var hand = PaiGowPokerHelper.solve(['As', '3s', '2s', '4s', '5c', '5h', '5d']);
    hand.hiHand.descr.should.equal('Straight, Wheel');
    return hand.loHand.descr.should.equal('Pair, 5\'s');
  });
});

describe('A Flush with Full House', function() {
  it('should be detected as possible', function() {
    var hand = new Flush(['Ah', 'Jh', 'Js', 'Jc', 'Or', '2h', 'Kh'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new Flush(['Ah', 'Jh', 'Js', 'Jc', 'Or', '2s', 'Kh'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  return it('should be split according to House Way, Full House', function() {
    var hand = PaiGowPokerHelper.solve(['Ah', 'Jh', 'Js', 'Jc', 'Or', '2h', 'Kh']);
    hand.hiHand.descr.should.equal('Three of a Kind, J\'s');
    return hand.loHand.descr.should.equal('Pair, A\'s');
  });
});

describe('A Flush with Four of a Kind', function() {
  it('should be detected as possible', function() {
    var hand = new Flush(['Ah', 'Or', 'As', 'Ac', 'Jh', '2h', 'Kh'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new Flush(['Ah', 'Jh', 'Js', 'Jc', 'Or', '2s', 'Kh'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  return it('should be split according to House Way, Four of a Kind', function() {
    var hand = PaiGowPokerHelper.solve(['Ah', 'Or', 'As', 'Ac', 'Jh', '2h', 'Kh']);
    hand.hiHand.descr.should.equal('Flush, Ah High');
    return hand.loHand.descr.should.equal('Pair, A\'s');
  });
});

describe('A Four of a Kind', function() {
  it('should be detected as possible', function() {
    var hand = new FourOfAKind(['Ah', 'Ad', 'Or', 'As', 'Jc', 'Kh', 'Qd'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new FourOfAKind(['Ah', 'Kd', 'Or', 'Js', 'Kc', 'Kh', 'Qd'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  it('should be split according to House Way', function() {
    var hand = PaiGowPokerHelper.solve(['Ah', 'Ad', 'Or', 'As', '9c', 'Kh', 'Qd']);
    hand.hiHand.descr.should.equal('Pair, A\'s');
    return hand.loHand.descr.should.equal('Pair, A\'s');
  });
  it('should be split according to House Way', function() {
    var hand = PaiGowPokerHelper.solve(['Th', 'Td', 'Tc', 'Ts', 'Jc', 'Kh', 'Qd']);
    hand.hiHand.descr.should.equal('Pair, 10\'s');
    return hand.loHand.descr.should.equal('Pair, 10\'s');
  });
  it('should be split according to House Way', function() {
    var hand = PaiGowPokerHelper.solve(['Th', 'Td', 'Tc', 'Ts', 'Jc', 'Ah', 'Qd']);
    hand.hiHand.descr.should.equal('Four of a Kind, 10\'s');
    return hand.loHand.descr.should.equal('A High');
  });
  return it('should be split according to House Way', function() {
    var hand = PaiGowPokerHelper.solve(['6h', '6d', '6c', '6s', '7c', '3h', '2d']);
    hand.hiHand.descr.should.equal('Four of a Kind, 6\'s');
    return hand.loHand.descr.should.equal('7 High');
  });
});

describe('Two Threes of a Kind', function() {
  it('should be detected as possible', function() {
    var hand = new TwoThreeOfAKind(['Ah', 'Ad', 'Jd', 'As', 'Jc', 'Jh', 'Qd'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new TwoThreeOfAKind(['Ah', 'Kd', 'Or', 'Js', 'Kc', 'Kh', 'Qd'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  return it('should be split according to House Way', function() {
    var hand = PaiGowPokerHelper.solve(['Ah', 'Ad', 'Jd', 'As', 'Jc', 'Jh', 'Qd']);
    hand.hiHand.descr.should.equal('Three of a Kind, J\'s');
    return hand.loHand.descr.should.equal('Pair, A\'s');
  });
});

describe('A Three of a Kind with Two Pair', function() {
  it('should be detected as possible', function() {
    var hand = new ThreeOfAKindTwoPair(['Ah', 'Ad', 'Jd', 'As', 'Jc', 'Qh', 'Qd'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new ThreeOfAKindTwoPair(['Ah', 'Kd', 'Or', 'Js', 'Kc', 'Kh', 'Qd'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  return it('should be split according to House Way', function() {
    var hand = PaiGowPokerHelper.solve(['Ah', 'Ad', 'Jd', 'As', 'Jc', 'Qh', 'Qd']);
    hand.hiHand.descr.should.equal('Full House, A\'s over J\'s');
    return hand.loHand.descr.should.equal('Pair, Q\'s');
  });
});

describe('A Full House', function() {
  it('should be detected as possible', function() {
    var hand = new FullHouse(['Ah', 'Ad', 'Jd', 'As', 'Jc', 'Qh', '9d'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new FullHouse(['8h', 'Kd', 'Or', 'Js', 'Kc', 'Kh', 'Qd'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  it('should be split according to House Way', function() {
    var hand = PaiGowPokerHelper.solve(['Ah', 'Jh', 'Js', 'Jc', 'Or', '2d', 'Kh']);
    hand.hiHand.descr.should.equal('Three of a Kind, J\'s');
    return hand.loHand.descr.should.equal('Pair, A\'s');
  });
  return it('should be split according to House Way', function() {
    var hand = PaiGowPokerHelper.solve(['Ah', 'Kd', '2d', '2s', '6c', '6h', '6d']);
    hand.hiHand.descr.should.equal('Full House, 6\'s over 2\'s');
    return hand.loHand.descr.should.equal('A High');
  });
});

describe('Three of a Kind', function() {
  it('should be detected as possible', function() {
    var hand = new ThreeOfAKind(['5c', '5s', '5h', '6c', '2d', '9h', 'Qs'], gameForTest);
    hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new ThreeOfAKind(['5c', '2h', '5h', '6c', '2d', '9h', 'Qs'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  it('should be split according to House Way', function() {
    var hand = PaiGowPokerHelper.solve(['5c', '5s', '5h', '6c', '2d', '9h', 'Qs']);
    hand.hiHand.descr.should.equal('Three of a Kind, 5\'s');
    return hand.loHand.descr.should.equal('Q High');
  });
  return it('should be split according to House Way', function() {
    var hand = PaiGowPokerHelper.solve(['Ac', 'As', 'Ah', '6c', '2d', '9h', 'Qs']);
    hand.hiHand.descr.should.equal('Pair, A\'s');
    return hand.loHand.descr.should.equal('A High');
  });
});

describe('Three Pair', function() {
  it('should be detected as possible', function() {
    var hand = new ThreePair(['5c', '5d', '6s', '6c', '9d', '9s', '2d'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new ThreePair(['5c', '6s', '6h', '5d', '2d', 'Ts', '8d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  it('should be split according to House Way', function() {
    var hand = PaiGowPokerHelper.solve(['Ac', 'As', '6h', '6c', '9d', '9h', 'Qs']);
    hand.hiHand.descr.should.equal('Two Pair, 9\'s & 6\'s');
    return hand.loHand.descr.should.equal('Pair, A\'s');
  });
});

describe('Two Pair', function() {
  it('should be detected as possible', function() {
    var hand = new TwoPair(['5c', '5d', '6s', '6c', 'Td', '9s', '2d'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new TwoPair(['5c', '6s', '6h', '7c', '2d', 'Ts', '8d'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  it('should be split according to House Way', function() {
    var hand = PaiGowPokerHelper.solve(['Ac', 'Ts', '6h', '6c', '3d', '3h', 'Qs']);
    hand.hiHand.descr.should.equal('Two Pair, 6\'s & 3\'s');
    return hand.loHand.descr.should.equal('A High');
  });
  it('should be split according to House Way', function() {
    var hand = PaiGowPokerHelper.solve(['Ac', '5s', '6h', '6c', '9d', '9h', 'Qs']);
    hand.hiHand.descr.should.equal('Two Pair, 9\'s & 6\'s');
    return hand.loHand.descr.should.equal('A High');
  });
  it('should be split according to House Way', function() {
    var hand = PaiGowPokerHelper.solve(['Kc', '5s', '6h', '6c', '9d', '9h', 'Qs']);
    hand.hiHand.descr.should.equal('Pair, 9\'s');
    return hand.loHand.descr.should.equal('Pair, 6\'s');
  });
  it('should be split according to House Way', function() {
    var hand = PaiGowPokerHelper.solve(['Ac', '5s', '6h', '6c', 'Kd', 'Kh', 'Qs']);
    hand.hiHand.descr.should.equal('Two Pair, K\'s & 6\'s');
    return hand.loHand.descr.should.equal('A High');
  });
  return it('should be split according to House Way', function() {
    var hand = PaiGowPokerHelper.solve(['Ac', 'As', '6h', '4c', '9d', '9h', 'Qs']);
    hand.hiHand.descr.should.equal('Pair, A\'s');
    return hand.loHand.descr.should.equal('Pair, 9\'s');
  });
});

describe('One Pair', function() {
  it('should be detected as possible', function() {
    var hand = new OnePair(['5h', '5c', '7s', '9s', '2d', 'Kh', 'Tc'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be detected as not possible', function() {
    var hand = new OnePair(['5h', '6s', '2s', 'Ts', '8d', 'Kh', 'Or'], gameForTest);
    return hand.isPossible.should.equal(false);
  });
  return it('should be split according to House Way', function() {
    var hand = PaiGowPokerHelper.solve(['5h', '5c', '7s', '9s', '2d', 'Kh', 'Tc']);
    hand.hiHand.descr.should.equal('Pair, 5\'s');
    return hand.loHand.descr.should.equal('K High');
  });
});

describe('High Card', function() {
  it('should be detected as possible', function() {
    var hand = new HighCard(['5h', '6s', '2s', 'Ts', '8d', 'Kh', 'Or'], gameForTest);
    return hand.isPossible.should.equal(true);
  });
  it('should be split according to House Way', function() {
    var hand = PaiGowPokerHelper.solve(['5h', '6c', '7s', '9s', '2d', 'Kh', 'Tc']);
    hand.hiHand.descr.should.equal('K High');
    return hand.loHand.descr.should.equal('10 High');
  });
});

describe('Hand Comparisons and Winners', function() {
  it('should disqualify a player who sets the lo hand higher than the hi', function() {
    var player = PaiGowPokerHelper.setHands(['Kh', '7c', 'Qs', 'Td', '5s'], ['Ac', '2h']);
    var banker = PaiGowPokerHelper.solve(['8h', '9c', '4s', '3d', '5s', '7c', '2h']);
    var winners = PaiGowPokerHelper.winners(player, banker);
    return winners.should.equal(-1);
  });
  it('Even if the player is banking, he/she can still be disqualified', function() {
    var dealer = PaiGowPokerHelper.solve(['8h', '9c', '4s', '3d', '5s', '7c', '2h']);
    var banker = PaiGowPokerHelper.setHands(['Kh', '7c', 'Qs', 'Td', '5s'], ['Ac', '2h']);
    var winners = PaiGowPokerHelper.winners(dealer, banker);
    return winners.should.equal(1);
  });
  it('Player must win both to win', function() {
    var player = PaiGowPokerHelper.setHands(['Kh', 'Kc', '7s', 'Td', '5s'], ['Ac', 'Qh']);
    var banker = PaiGowPokerHelper.solve(['8h', '8c', '4s', 'Ad', 'Js', '7c', '2h']);
    var winners = PaiGowPokerHelper.winners(player, banker);
    return winners.should.equal(1);
  });
  it('Banker must win both to win', function() {
    var player = PaiGowPokerHelper.setHands(['Kh', 'Kc', '7s', 'Td', '5s'], ['Ac', 'Qh']);
    var banker = PaiGowPokerHelper.solve(['8h', '8c', '4s', 'Ad', 'Ks', '4c', '2h']);
    var winners = PaiGowPokerHelper.winners(player, banker);
    return winners.should.equal(-1);
  });
  it('Banker takes all ties', function() {
    var player = PaiGowPokerHelper.setHands(['Kh', 'Kc', '7s', 'Td', '5s'], ['Ac', 'Qh']);
    var banker = PaiGowPokerHelper.solve(['Ah', 'Qc', 'Ks', 'Kd', 'Ts', '7c', '5h']);
    var winners = PaiGowPokerHelper.winners(player, banker);
    return winners.should.equal(-1);
  });
  it('Player wins hi, Banker wins lo, push', function() {
    var player = PaiGowPokerHelper.setHands(['Kh', 'Kc', '7s', 'Td', '6s'], ['Ac', 'Jh']);
    var banker = PaiGowPokerHelper.solve(['Ah', 'Qc', 'Ks', 'Kd', 'Ts', '7c', '5h']);
    var winners = PaiGowPokerHelper.winners(player, banker);
    return winners.should.equal(0);
  });
  it('Banker wins hi, Player wins lo, push', function() {
    var player = PaiGowPokerHelper.setHands(['Kh', 'Kc', '7s', 'Td', '4s'], ['Ac', 'Qh']);
    var banker = PaiGowPokerHelper.solve(['Ah', 'Jc', 'Ks', 'Kd', 'Ts', '7c', '5h']);
    var winners = PaiGowPokerHelper.winners(player, banker);
    return winners.should.equal(0);
  });
  it('In Pai Gow Poker, A2345 is the second highest straight', function() {
    var player = PaiGowPokerHelper.setHands(['Ah', '2c', '5s', '3d', '4s'], ['Jc', 'Th']);
    var banker = PaiGowPokerHelper.solve(['9h', 'Jd', 'Ks', 'Qd', 'Ts', '7c', '5h']);
    var winners = PaiGowPokerHelper.winners(player, banker);
    return winners.should.equal(1);
  });
});
