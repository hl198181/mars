/*!
 * mars
 * Copyright(c) 2015 Leon Huang
 * MIT Licensed
 */

'use strict';

describe('Hello World',function() {
    var foo = 0;
    beforeEach(function() {
        foo +=1;
    });
    afterEach(function() {
        foo = 0;
    });
    it('foo is not 1',function() {
        expect(foo).toBe(1);
    });
    it('foo is not 1',function() {
        expect(foo).toBe(1);
    });
});