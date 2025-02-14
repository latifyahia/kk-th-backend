import { capitalizeFirstLetterOfString, formatCatNames } from '../string.util';
import { IUserCat } from '../../../user/types/user.interfaces';

describe('String Utils', () => {
  describe('capitalizeFirstLetterOfString', () => {
    it('should capitalize the first letter of a lowercase string', () => {
      const result = capitalizeFirstLetterOfString('hello');
      expect(result).toBe('Hello');
    });

    it('should capitalize the first letter of an uppercase string', () => {
      const result = capitalizeFirstLetterOfString('Hello');
      expect(result).toBe('Hello');
    });

    it('should return an empty string if input is an empty string', () => {
      const result = capitalizeFirstLetterOfString('');
      expect(result).toBe('');
    });

    it('should capitalize the first letter of a single character string', () => {
      const result = capitalizeFirstLetterOfString('a');
      expect(result).toBe('A');
    });

    it('should not change the rest of the string', () => {
      const result = capitalizeFirstLetterOfString('hELLO');
      expect(result).toBe('HELLO');
    });
  });

  describe('formatCatNames', () => {
    let cats: Record<string, string>[];

    beforeAll(() => {
      cats = [{ name: 'whisker' }];
    });

    it('should capitalize and format a single cat name without apostrophe', () => {
      const result = formatCatNames(cats as any as IUserCat[]);
      expect(result).toBe('Whisker');
    });

    it('should capitalize and format a single cat name with apostrophe', () => {
      const result = formatCatNames(cats as any as IUserCat[], true);
      expect(result).toBe("Whisker's");
    });

    it('should capitalize and format two cat names without apostrophe', () => {
      cats = [{ name: 'whisker' }, { name: 'mitten' }];
      const result = formatCatNames(cats as any as IUserCat[]);
      expect(result).toBe('Whisker and Mitten');
    });

    it('should capitalize and format two cat names and add an apostrophe to the last cat name', () => {
      cats = [{ name: 'whisker' }, { name: 'mitten' }];
      const result = formatCatNames(cats as any as IUserCat[], true);
      expect(result).toBe("Whisker and Mitten's");
    });

    it('should capitalize and format multiple cat names without apostrophe', () => {
      cats = [{ name: 'whisker' }, { name: 'mitten' }, { name: 'boot' }];

      const result = formatCatNames(cats as any as IUserCat[]);
      expect(result).toBe('Whisker, Mitten and Boot');
    });

    it('should capitalize and format multiple cat names and add an apostrophe to the last cat name', () => {
      cats = [{ name: 'whisker' }, { name: 'mitten' }, { name: 'boot' }];

      const result = formatCatNames(cats as any as IUserCat[], true);
      expect(result).toBe("Whisker, Mitten and Boot's");
    });

    it('should handle cat names ending with "s" correctly with apostrophe', () => {
      cats = [{ name: 'whisker' }, { name: 'mitten' }, { name: 'boots' }];
      const result = formatCatNames(cats as any as IUserCat[], true);
      expect(result).toBe("Whisker, Mitten and Boots'");
    });
  });
});
