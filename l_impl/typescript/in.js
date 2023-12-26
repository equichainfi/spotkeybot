"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileDataArray = void 0;
exports.fileDataArray = [
    {
        fileName: "test/btc_test.txt",
        fileContent: "+E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262\nHUJ",
    },
    {
        fileName: "test/main.ts",
        fileContent: "+function sumMatrix(matrix: number[][]) {\n" +
            "+    var sum = 0;\n" +
            "+    for (var i = 0; i < matrix.length; i++) {\n" +
            "+        var currentRow = matrix[i];\n" +
            "+        for (var i = 0; i < currentRow.length; i++) {\n" +
            "+            sum += currentRow[i];\n" +
            "+        }\n" +
            "+    }\n" +
            "+    return sum;\n" +
            "+}\n" +
            "+\n" +
            "+function f(shouldInitialize: boolean) {\n" +
            "+  if (shouldInitialize) {\n" +
            "+    var x = 10;\n" +
            "+  }\n" +
            "+  return x;\n" +
            "+}\n" +
            "+// 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef\n" +
            "+f(true); // returns '10'\n" +
            "+f(false); // returns 'undefined'\n" +
            "+\n" +
            "+for (var i = 0; i < 10; i++) {\n" +
            "+  setTimeout(function () {\n" +
            "+    console.log(i);\n" +
            "+  }, 100 * i);\n" +
            "+}",
    },
    {
        fileName: "test/file2.txt",
        fileContent: "+0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef\n" +
            "-10ac8b8edd8935b0999cfc9a45ed1f02f7ff798854e973794b64c4dc2a6fa451\n" +
            "+\n" +
            "+TEST 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    },
];
