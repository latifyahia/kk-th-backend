import { getCatsWithActiveSub } from '../cat.util';
import { IUserCat } from 'src/user/types/user.interfaces';

describe('getCatsWithActiveSub', () => {
  let cats: any;

  beforeAll(() => {
    cats = [
      { name: 'Cat1', subscriptionActive: true },
      { name: 'Cat2', subscriptionActive: false },
      { name: 'Cat3', subscriptionActive: true },
    ];
  });

  it('should return only cats with active subscriptions', () => {
    const result = getCatsWithActiveSub(cats as any as IUserCat[]);
    expect(result).toEqual([
      { name: 'Cat1', subscriptionActive: true },
      { name: 'Cat3', subscriptionActive: true },
    ]);
  });

  it('should return an empty array if no cats have active subscriptions', () => {
    cats = [
      { name: 'Cat1', subscriptionActive: false },
      { name: 'Cat2', subscriptionActive: false },
    ];

    const result = getCatsWithActiveSub(cats as any as IUserCat[]);
    expect(result).toEqual([]);
  });

  it('should return an empty array if the input array is empty', () => {
    const result = getCatsWithActiveSub([]);
    expect(result).toEqual([]);
  });
});
