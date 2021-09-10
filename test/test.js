'use strict';

process.env.MONGODB_URI_TEST = 'mongodb://localhost/database-test';

var glob = require('glob'),
    path = require('path'),
    mongooseConfig = require('../src/config/mongoose');



describe('Mongodb connect',  () => {

    it('connected..',  (done) => {
        mongooseConfig.connection(() => {
            done();
        });
    });

});

glob.sync(path.join(__dirname, '../src/modules/**/test/*.js')).forEach( (file) => {
    require(path.resolve(file));
});


describe('Mongodb disconnect', () => {

    it('disconnected..',  (done) => {
        mongooseConfig.dropDatabase(() => {
            process.exit(0);
            mongooseConfig.disconnect(done);
        });
    });

});