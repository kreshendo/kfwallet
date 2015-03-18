var Kfwallet  = new function() {
    
    
    this.data = {
        youtubeUrl: null,
        privKey1: null,
        pubKey1: null,
        seedGuess: null,
        winningSeed: null,
        winningPubKey: null,
        winningPrivKey: null,
        winnerAddress: null,
        rapperAddress: null,
        multisigAddress: null,
        network: null     
         
    };
    this.createWallet = function (winningSeed, youtubeUrl){
        var bitcore = require('bitcore');
        var crypto = require('crypto');
    //generate multisig address
        this.data.youtubeUrl = youtubeUrl;
        var ytHash = crypto.createHash('sha256').update(this.data.youtubeUrl).digest('hex');
        this.data.privKey1 = new bitcore.PrivateKey(ytHash);
        this.data.pubKey1 = this.data.privKey1.toPublicKey();
        var hash = crypto.createhash('sha256').update(winningSeed).digest('hex');
        this.data.winningPrivKey = new bitcore.PrivateKey(hash);
        console.log('winning private key for  this wallet is... ' + this.data.winningPrivKey);
        this.data.winningPubKey = this.data.winnningPrivKey.toPublicKey();
        console.log('winning publik key for this wallet is...' + this.data.winningPubKey);
        this.data.multisigAddress = new bitcore.Address([this.data.pubKey1, this.data.winningPubKey], 2);
        this.data.winningSees = null;
        this.data.winningPrivKey = null;
    //save multisigAddress, privKey1 and pubKey1 to the datastore
    
    };
    this.loadWallet = function (youtubeUrl) {
        var bitcore = require('bitcore');
        var crypto = require('crypto');
        this.data.youtubeUrl = youtubeUrl;
        var ytHash = crypto.createHash('sha256').update(this.data.youtubeUrl).digest('hex');
        this.data.privKey1 = new bitcore.PrivateKey(ytHash);
        this.data.pubKey1 = this.data.privKey1.toPublicKey();
        
    };
    this.validateSeedGuess = function (seedGuess){
        var bitcore = require('bitcore');
        var crypto = require('crypto');
        var guessHash = crypto.createHash('sha256').update(seedGuess).digest('hex');
        var guessPrivKey = new bitcore.PrivateKey(guessHash);
        console.log('private key for your guess is ' + guessPrivKey);
        var guessPubKey = guessPrivKey.toPublicKey();
        console.log('the public key for your guess is ' + guessPubKey);
        if (guessPubKey.toString() === this.data.winningPubKey.toString()) {
              this.data.winningPrivKey = guessPrivKey;
              return true;
        } else {
           return fales;
        }
    };
    this.requestwithdrawal = function (winnerAddress ) {
        
        
    };
    this.getInformation = function () {
        return this.data;
    };
    
};

module. exports = function () {
    var instance = new Kfwallet();
    return instance;
}