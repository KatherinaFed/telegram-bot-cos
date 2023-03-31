const sizeModel = {
  1: '001',
  32: '001',
  34: '002',
  36: '003',
  38: '004',
  40: '005',
  42: '006',
  44: '007',
};

function isNumber(num) {
  return Number.isInteger(parseInt(num, 10));
}

module.exports = { sizeModel, isNumber };