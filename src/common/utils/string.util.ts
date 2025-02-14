import { IUserCat } from 'src/user/types/user.interfaces';

export function capitalizeFirstLetterOfString(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatCatNames(
  cats: IUserCat[],
  appendApostropheToName: boolean = false,
): string {
  // Capitalize each cat's name
  const formattedCatsNames: string[] = cats.map((cat) =>
    capitalizeFirstLetterOfString(cat.name),
  );

  if (cats.length === 1) {
    return appendApostropheToName
      ? appendApostropheToCatName(formattedCatsNames[0])
      : formattedCatsNames[0];
  } else if (formattedCatsNames.length === 2) {
    const lastCat = appendApostropheToName
      ? appendApostropheToCatName(formattedCatsNames[1])
      : formattedCatsNames[1];

    return `${formattedCatsNames[0]} and ${lastCat}`;
  } else {
    const lastCatName = appendApostropheToName
      ? appendApostropheToCatName(formattedCatsNames.pop()!)
      : formattedCatsNames.pop();
    return formattedCatsNames.join(', ') + ' and ' + lastCatName;
  }
}

export function appendApostropheToCatName(catName: string): string {
  return catName.endsWith('s') ? `${catName}'` : `${catName}'s`;
}
