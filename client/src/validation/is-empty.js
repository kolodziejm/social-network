// helper-method to check if object/string/... is empty
// potrzebujemy jej, poniewaz validator sprawdza tylko stringi. Alternatywa do lodash

const isEmpty = (value) => (
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) || // empty object without keys 
  (typeof value === 'string' && value.trim().length === 0)
);

export default isEmpty;