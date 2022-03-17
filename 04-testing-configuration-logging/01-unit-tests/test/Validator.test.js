const Validator = require('../Validator');
const expect = require('chai').expect;

const stringConfig = {
  type: 'string',
  min: 10,
  max: 20,
};

const numberConfig = {
  type: 'number',
  min: 5,
  max: 15,
};

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('с неподдерживаемым типом', () => {
      const validator = new Validator({name: stringConfig});

      const errors = validator.validate({name: 5});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
    });

    describe('проверяет строковые поля', () => {
      it('с короткой строкой', () => {
        const validator = new Validator({name: stringConfig});

        const errors = validator.validate({name: 'Lalala'});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
      });

      it('с подходящей по длине строкой', () => {
        const validator = new Validator({name: stringConfig});

        const errors = validator.validate({name: 'Lalalalalala'});

        expect(errors.length).to.be.equal(0);
      });

      it('с длиной строкой', () => {
        const validator = new Validator({name: stringConfig});

        const errors = validator.validate({name: 'LalalalalalaLalalalalala'});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 24');
      });
    });

    describe('проверяет числовые поля', () => {
      it('с маленьким положительным', () => {
        const validator = new Validator({name: numberConfig});

        const errors = validator.validate({name: 4});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal(`too little, expect 5, got 4`);
      });

      it('с подходящим числом', () => {
        const validator = new Validator({name: numberConfig});

        const errors = validator.validate({name: 10});

        expect(errors.length).to.be.equal(0);
      });

      it('с большим числом', () => {
        const validator = new Validator({name: numberConfig});

        const errors = validator.validate({name: 25});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 15, got 25');
      });
    });
  });
});
