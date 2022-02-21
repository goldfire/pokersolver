var Flush = require('../pokersolver').Flush;
var StraightFlush = require('../pokersolver').StraightFlush;
var Straight = require('../pokersolver').Straight;
var FourOfAKind = require('../pokersolver').FourOfAKind;
var FullHouse = require('../pokersolver').FullHouse;
var ThreeOfAKind = require('../pokersolver').ThreeOfAKind;
var TwoPair = require('../pokersolver').TwoPair;
var OnePair = require('../pokersolver').OnePair;
var OmahaGame = require('../pokersolver').OmahaGame;

describe('A basic hand', function () {
  var boardCards = ['As', '4h', 'Kd', '3h', '5h'];
  var playerCards = ['Ah', 'Ks', '4d', '2h'];
  it('should return a hand with cards sorted descending', function () {
    var hand = OmahaGame.solve(boardCards, playerCards);
    hand.cardPool[0].toString().should.equal('Ah');
    return hand.cardPool[4].toString().should.equal('2h');
  });
  it('should return a correct description', function () {
    var hand = OmahaGame.solve(boardCards, playerCards);
    return hand.descr.should.equal('Straight Flush, 5h High');
  });
  return it('should return throw an Error for a hand with duplicate cards', function () {
    (function () {
      var playerCards = ['As', 'Ah', 'Ks', '4d'];
      OmahaGame.solve(boardCards, playerCards);
    }.should.throw());
  });
});

describe('A Straight Flush', function () {
  it('should be detected as possible', function () {
    var boardCards = ['As', '4h', 'Kd', '3h', '5h'];
    var playerCards = ['Ah', 'Ks', '4d', '2h'];
    var hand = OmahaGame.solve(boardCards, playerCards);
    return hand.should.be.an.instanceOf(StraightFlush);
  });
  it('should be detected as not possible', function () {
    var boardCards = ['Ah', '4h', 'Kd', '3h', '5h'];
    var playerCards = ['As', 'Ks', '4d', '2h'];
    var hand = OmahaGame.solve(boardCards, playerCards);
    return hand.should.not.be.an.instanceOf(StraightFlush);
  });
  return it('should return 5 cards with low ace', function () {
    var boardCards = ['Ah', '4h', 'Kd', '3h', '5h'];
    var playerCards = ['As', 'Ks', '4d', '2h'];
    var hand = OmahaGame.solve(boardCards, playerCards);
    return hand.cards.length.should.equal(5);
  });
});

describe('A Four of a Kind', function () {
  it('should be detected as possible', function () {
    var boardCards = ['Ah', '4h', 'Kd', 'Ad', '5h'];
    var playerCards = ['As', 'Ac', '4d', '2h'];
    var hand = OmahaGame.solve(boardCards, playerCards);
    return hand.should.be.an.instanceOf(FourOfAKind);
  });
  return it('should be detected as not possible', function () {
    var boardCards = ['Ah', '4h', 'Kd', '4d', '5h'];
    var playerCards = ['As', 'Ac', 'Ad', '2h'];
    var hand = OmahaGame.solve(boardCards, playerCards);
    return hand.should.not.be.an.instanceOf(FourOfAKind);
  });
});

describe('A Full House', function () {
  it('should be detected as possible', function () {
    var boardCards = ['Ah', '4h', '5d', 'Kd', '5h'];
    var playerCards = ['As', '5c', '4d', '2h'];
    var hand = OmahaGame.solve(boardCards, playerCards);
    hand.should.be.an.instanceOf(FullHouse);

    boardCards = ['Ah', '4h', '5d', 'Ad', '7h'];
    playerCards = ['As', '5c', '4d', '2h'];
    hand = OmahaGame.solve(boardCards, playerCards);
    return hand.should.be.an.instanceOf(FullHouse);
  });
  it('should be detected as not possible', function () {
    var boardCards = ['2h', 'Ac', '4d', 'Kd', '5h'];
    var playerCards = ['As', '5c', '5d', 'Ah'];
    var hand = OmahaGame.solve(boardCards, playerCards);
    return hand.should.not.be.an.instanceOf(FullHouse);
  });
  it('should pick the high kickers', function () {
    var boardCards = ['Ah', '4h', '5d', 'Ad', '7h'];
    var playerCards = ['As', '5c', '4d', '2h'];
    var hand = OmahaGame.solve(boardCards, playerCards);
    return hand.cards.toString().indexOf('4h').should.equal(-1);
  });
  return it('should be in order', function () {
    var boardCards = ['Ah', '4h', '5d', 'Ad', '7h'];
    var playerCards = ['As', '5c', '4d', '2h'];
    var hand = OmahaGame.solve(boardCards, playerCards);
    return hand.cards.toString().should.equal('Ah,Ad,As,5d,5c');
  });
});

describe('A Flush', function () {
  it('should be detected as possible', function () {
    var boardCards = ['2h', 'Ac', '4d', 'Kh', '5h'];
    var playerCards = ['As', '4h', '5d', 'Ah'];
    var hand = OmahaGame.solve(boardCards, playerCards);
    return hand.should.be.an.instanceOf(Flush);
  });
  return it('should be detected as not possible', function () {
    var boardCards = ['2h', 'Ac', '4d', 'Kh', '5d'];
    var playerCards = ['As', '4h', '5h', 'Ah'];
    var hand = OmahaGame.solve(boardCards, playerCards);
    return hand.should.not.be.an.instanceOf(Flush);
  });
});

describe('A Straight', function () {
  it('should be detected as possible', function () {
    var boardCards = ['2h', '3c', '4d', 'Kh', '5h'];
    var playerCards = ['7s', '6c', '5d', 'Ah'];
    var hand = OmahaGame.solve(boardCards, playerCards);
    return hand.should.be.an.instanceOf(Straight);
  });
  it('should be detected as possible', function () {
    var boardCards = ['9h', 'Jc', '4d', 'Th', '5h'];
    var playerCards = ['As', '7c', '8d', 'Ah'];
    var hand = OmahaGame.solve(boardCards, playerCards);
    return hand.should.be.an.instanceOf(Straight);
  });
  it('should be detected as not possible', function () {
    var boardCards = ['3h', '3c', '4d', 'Kh', '4h'];
    var playerCards = ['7s', '6c', '5d', 'Ah'];
    var hand = OmahaGame.solve(boardCards, playerCards);
    return hand.should.not.be.an.instanceOf(Straight);
  });
  it('should detect a low ace', function () {
    var boardCards = ['2h', '3c', '4d', 'Kh', '5h'];
    var playerCards = ['7s', '7c', '5d', 'Ah'];
    var hand = OmahaGame.solve(boardCards, playerCards);
    return hand.should.be.an.instanceOf(Straight);
  });
  it('should detect a high ace', function () {
    var boardCards = ['2h', 'Jc', '4d', 'Kh', 'Ah'];
    var playerCards = ['7s', 'Tc', 'Qd', 'As'];
    var hand = OmahaGame.solve(boardCards, playerCards);
    return hand.should.be.an.instanceOf(Straight);
  });
});

describe('Three of a Kind', function () {
  it('should be detected as possible', function () {
    var boardCards = ['2h', '3c', '4d', 'Kh', '7h'];
    var playerCards = ['7s', '7c', '8d', 'Ah'];
    var hand = OmahaGame.solve(boardCards, playerCards);
    return hand.should.be.an.instanceOf(ThreeOfAKind);
  });
  it('should be detected as not possible', function () {
    var boardCards = ['2h', '3c', '4d', 'Kh', '5h'];
    var playerCards = ['7s', '7c', '7d', 'Ah'];
    var hand = OmahaGame.solve(boardCards, playerCards);
    return hand.should.not.be.an.instanceOf(ThreeOfAKind);
  });
});

describe('Two Pair', function () {
  it('should be detected as possible', function () {
    var boardCards = ['2h', 'Jc', '4d', '8h', '8d'];
    var playerCards = ['7s', '7c', '9d', 'Ah'];
    var hand = OmahaGame.solve(boardCards, playerCards);
    return hand.should.be.an.instanceOf(TwoPair);
  });
  it('should be detected as not possible', function () {
    var boardCards = ['2h', '3c', '4d', 'Kh', '5h'];
    var playerCards = ['7s', '7c', '5d', 'Jh'];
    var hand = OmahaGame.solve(boardCards, playerCards);
    return hand.should.not.be.an.instanceOf(TwoPair);
  });
});

describe('One Pair', function () {
  it('should be detected as possible', function () {
    var boardCards = ['2h', '3c', '4d', 'Kh', '8h'];
    var playerCards = ['Js', 'Qc', '8d', 'Ac'];
    var hand = OmahaGame.solve(boardCards, playerCards);
    return hand.should.be.an.instanceOf(OnePair);
  });
  it('should be detected as not possible', function () {
    var boardCards = ['2h', '3c', '4d', 'Kh', '7h'];
    var playerCards = ['Js', 'Qc', '8d', 'Ac'];
    var hand = OmahaGame.solve(boardCards, playerCards);
    return hand.should.not.be.an.instanceOf(OnePair);
  });
});
