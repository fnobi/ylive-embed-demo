const expect = require('chai').expect;

describe('javascript', () => {
    it('calculate addition', () => {
        expect(3 + 2).to.be.equal(5);
    });
    it('invalid calculate addition', () => {
        expect(3 + 2).to.be.equal(8);
    });
});
