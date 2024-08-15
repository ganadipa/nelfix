import * as hbs from 'hbs';

hbs.registerHelper('eq', function (a, b) {
  return a === b;
});

hbs.registerHelper('lt', function (a, b) {
  return a < b;
});

hbs.registerHelper('gt', function (a, b) {
  return a > b;
});

hbs.registerHelper('increment', function (value) {
  return parseInt(value) + 1;
});

hbs.registerHelper('decrement', function (value) {
  return parseInt(value) - 1;
});

hbs.registerHelper('paginationRange', function (currentPage, totalPages) {
  const rangeStart = Math.max(1, currentPage - 2);
  const rangeEnd = Math.min(totalPages, currentPage + 2);
  let pages = [];
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }
  return pages;
});
