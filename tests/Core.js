import Core from '../src/Core';

const numbers = [8, 6, 7, 7, 3, 60];
const target = 611;
const tolerance = 9;

const op = new Core(target, numbers);

op.on('done', result => {
  console.log(JSON.stringify(result));
});

op.solve(result => {
  if (result.number < target + tolerance && result.number > target - tolerance)
    return true;
});