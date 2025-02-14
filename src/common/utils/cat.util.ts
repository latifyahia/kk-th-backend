import { IUserCat } from 'src/user/types/user.interfaces';

export function getCatsWithActiveSub(cats: IUserCat[]): IUserCat[] {
  return cats.reduce((acc: IUserCat[], cat: IUserCat) => {
    if (cat.subscriptionActive) {
      acc.push(cat);
    }
    return acc;
  }, []);
}
