const Clothing = require('../../data/').clothing;
const expect = require('chai').expect


describe('Clothing data module', () => {  
    it('should retrieve hm data', function * () {
        const res = yield Clothing.retrieveClothingInfo("http://www.hm.com/us/product/72665");
        expect(res.price).to.be.eql(119);
        expect(res.image).to.be.include('http://lp.hm.com/hmprod');
    })
    it('should retrieve nike data', function * () {
        const res = yield Clothing.retrieveClothingInfo("https://store.nike.com/us/en_us/pd/-/pid-11671979");
        expect(res.price).to.be.eql(190);
        expect(res.image).to.be.include('https://images.nike.com');
    })
    it('should retrieve jcrew data', function * () {
        const res = yield Clothing.retrieveClothingInfo("https://www.jcrew.com/p/F5543");
        expect(res.price).to.be.eql(450);
        expect(res.image).to.be.include('https://www.jcrew.com');
    })
})