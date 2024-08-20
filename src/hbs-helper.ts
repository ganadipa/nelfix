import * as hbs from 'hbs';

hbs.registerHelper('eq', function (a, b) {
  return a === b;
});

hbs.registerHelper('addOne', function (value) {
  return value + 1;
});

hbs.registerHelper('range', function (start, end) {
  const list = [];
  for (let i = start; i <= end; i++) {
    list.push(i);
  }
  return list;
});
