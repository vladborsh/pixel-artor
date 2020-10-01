export function copy<T>(arr: T[][]) {
  const newArr = [];

  for (let row of arr) {
    newArr.push([...row]);
  }

  return newArr;
}
