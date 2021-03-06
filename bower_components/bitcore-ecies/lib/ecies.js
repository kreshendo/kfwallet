'use strict';

var bitcore = require('bitcore');

var PublicKey = bitcore.PublicKey;
var Hash = bitcore.crypto.Hash;
var Random = bitcore.crypto.Random;
var $ = bitcore.util.preconditions;


var AESCBC = require('./aescbc');

// http://en.wikipedia.org/wiki/Integrated_Encryption_Scheme
var ECIES = function ECIES() {
  if (!(this instanceof ECIES)) {
    return new ECIES();
  }
};

ECIES.prototype.privateKey = function(privateKey) {
  $.checkArgument(privateKey, 'no private key provided');

  this._privateKey = privateKey || null;

  return this;
};

ECIES.prototype.publicKey = function(publicKey) {
  $.checkArgument(publicKey, 'no public key provided');

  this._publicKey = publicKey || null;

  return this;
};

ECIES.prototype.encrypt = function(message) {
  if (!Buffer.isBuffer(message)) message = new Buffer(message);
  var ivbuf = Random.getRandomBuffer(128 / 8);

  var r = this._privateKey.bn;
  var Rpubkey = this._privateKey.publicKey;
  var Rbuf = Rpubkey.toDER(true);
  var KB = this._publicKey.point;
  var P = KB.mul(r);
  var S = P.getX();
  var Sbuf = S.toBuffer({
    size: 32
  });
  var kEkM = Hash.sha512(Sbuf);
  var kE = kEkM.slice(0, 32);
  var kM = kEkM.slice(32, 64);
  var c = AESCBC.encryptCipherkey(message, kE, ivbuf);
  var d = Hash.sha256hmac(c, kM);
  var encbuf = Buffer.concat([Rbuf, c, d]);

  return encbuf;
};

ECIES.prototype.decrypt = function(encbuf) {
  $.checkArgument(encbuf);

  var kB = this._privateKey.bn;
  this._publicKey = PublicKey.fromDER(encbuf.slice(0, 33));
  var R = this._publicKey.point;
  var P = R.mul(kB);
  var S = P.getX();

  var Sbuf = S.toBuffer({
    size: 32
  });
  var kEkM = Hash.sha512(Sbuf);

  var kE = kEkM.slice(0, 32);
  var kM = kEkM.slice(32, 64);

  var c = encbuf.slice(33, encbuf.length - 32);
  var d = encbuf.slice(encbuf.length - 32, encbuf.length);

  var d2 = Hash.sha256hmac(c, kM);
  if (d.toString('hex') !== d2.toString('hex')) throw new Error('Invalid checksum');
  var messagebuf = AESCBC.decryptCipherkey(c, kE);

  return messagebuf;
};

module.exports = ECIES;
