function sumMatrix(matrix: number[][]) {
    var sum = 0;
    for (var i = 0; i < matrix.length; i++) {
        var currentRow = matrix[i];
        for (var i = 0; i < currentRow.length; i++) {
            sum += currentRow[i];
        }
    }
    return sum;
}

function f(shouldInitialize: boolean) {
  if (shouldInitialize) {
    var x = 10;
  }
  return x;
}
// 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
f(true); // returns '10'
f(false); // returns 'undefined'

for (var i = 0; i < 10; i++) {
  setTimeout(function () {
    console.log(i);
  }, 100 * i);
}
