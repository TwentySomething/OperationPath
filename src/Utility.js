/**
 * @param a {number[]}
 * @param b {number[]}
 * @param c {number[]}
 * @returns {{object}}
 *
 * @see https://stackoverflow.com/a/43053803/2584680
 */
export const cartesian = (a, b, ...c) => {
  const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
  return b ? cartesian(f(a, b), ...c) : a;
};

/**
 * @param arr {Array}
 * @returns {Array}
 */
export const combination = (arr) => {
  const result = [];

  for (let i = 0; i < arr.length - 1; i++)
    for (let j = i + 1; j < arr.length; j++)
      result.push([arr[i], arr[j]]);

  return result;
};

/**
 * @param object {Object}
 * @returns {Array}
 */
export const combinationOrderedObject = (object) => {
  const result = [];
  const arr = Object.entries(object);

  for (let i = 0; i < arr.length - 1; i++)
    for (let j = i + 1; j < arr.length; j++)
      result.push([arr[i][1], arr[j][1]]);

  return result;
};

/**
 * @param numbers     {number[]}
 * @param target      {number}
 * @returns {number}
 */
export const chooseClosest = (numbers, target) => {
  return numbers.reduce((prev, number) => Math.abs(target - number) < Math.abs(target - prev) ? number : prev);
};