var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var ETH_PV_KEY_REGEX = /^(0x)?[0-9a-fA-F]{64}$/;
var ETH_ADDRESS_REGEX = /^(0x)?[0-9a-fA-F]{40}$/;
var PGP_KEY_REGEX = /^(-----BEGIN PGP PUBLIC KEY BLOCK-----).*([a-zA-Z0-9//\n/.:+ =]+).*(-----END PGP PUBLIC KEY BLOCK-----)$|^(-----BEGIN PGP PRIVATE KEY BLOCK-----).*([a-zA-Z0-9//\n/.:+ =]+).*(-----END PGP PRIVATE KEY BLOCK-----)$/;
var PV_KEY_FOUND = "[+] Private Key found";
var ADDRESS_FOUND = "[+] Address found";
var PGP_KEY_FOUND = "[+] PGP Key found";
var NOT_FOUND_MSG = "No Private Keys found!";
function findKey(files) {
    var result = processFile(files);
    if (result.length === 0)
        return [
            {
                fileName: "",
                lineNumbers: [],
                keysFound: [NOT_FOUND_MSG],
            },
        ];
    return result;
}
function processFile(files) {
    var result = [];
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        if (!file.fileName)
            continue;
        var caughtKeys = [];
        var caughtAddresses = [];
        var caughtLineNumbers = [];
        var fileName = file.fileName;
        var lineContent = [];
        var lines = file.fileContent.split("\n");
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var spotResult = spotPrivateKey(line);
            if (spotResult && spotResult.startsWith(PV_KEY_FOUND)) {
                var privateKey = spotResult.split(": ")[1];
                var lineNumber = i + 1;
                caughtLineNumbers.push(lineNumber);
                caughtKeys.push(privateKey);
            }
            else if (spotResult && spotResult.startsWith(ADDRESS_FOUND)) {
                var address = spotResult.split(": ")[1];
                var lineNumber = i + 1;
                caughtLineNumbers.push(lineNumber);
                caughtAddresses.push(address);
            }
            else if (spotResult && spotResult.startsWith(PGP_KEY_FOUND)) {
                var pgpKey = spotResult.split(": ")[1];
                var lineNumber = i + 1;
                caughtLineNumbers.push(lineNumber);
                caughtKeys.push(pgpKey);
            }
            else {
                lineContent.push(line);
                caughtLineNumbers.push(i + 1);
            }
        }
        result.push({
            fileName: fileName,
            lineContent: lineContent.join("\n"),
            lineNumbers: caughtLineNumbers,
            keysFound: caughtKeys,
            addressesFound: caughtAddresses,
            numberOfKeysFound: caughtKeys.length + caughtAddresses.length,
        });
    }
    return formatResult(result);
}
function spotPrivateKey(line) {
    if (typeof line !== "string")
        throw new Error("line must be a string");
    if (line.match(ETH_PV_KEY_REGEX))
        return "".concat(PV_KEY_FOUND, ": ").concat(line);
    else if (line.match(ETH_ADDRESS_REGEX))
        return "".concat(ADDRESS_FOUND, ": ").concat(line);
    else if (line.match(PGP_KEY_REGEX))
        return "".concat(PGP_KEY_FOUND, ": ").concat(line);
    else
        return "none";
}
function formatResult(result) {
    var formattedResult = [];
    for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
        var fileData = result_1[_i];
        var lineNumbers = __spreadArray([], new Set(fileData.lineNumbers), true);
        formattedResult.push({
            fileName: fileData.fileName,
            lineNumbers: lineNumbers,
            keysFound: fileData.keysFound,
        });
    }
    return formattedResult;
}
console.log(findKey([
    {
        fileName: "src/file1.txt",
        fileContent: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef\n\n10ac8b8edd8935b0999cfc9a45ed1f02f7ff798854e973794b64c4dc2a6fa451\n\n\n\nTEST: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef\n\n\n\n\n\n0x9a116E22E1247B8cbEb4693B2BcF20c21C477394\n\n9a116E22E1247B8cbEb4693B2BcF20c21C477394",
    },
    {
        fileName: "src/file2.ts",
        fileContent: "function sumMatrix(matrix: number[][]) {\n\tvar sum = 0;\n\tfor (var i = 0; i < matrix.length; i++) {\n\t\tvar currentRow = matrix[i];\n\t\tfor (var i = 0; i < currentRow.length; i++) {\n\t\t\tsum += currentRow[i];\n\t\t}\n\t}\n\treturn sum;\n}\n\nfunction f(shouldInitialize: boolean) {\n\tif (shouldInitialize) {\n\t\tvar x = 10;\n\t\treturn x;\n\t}\n}\n// 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef\n// asdasdsadsad 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef adsasdsadasdas\nf(true); // returns '10'\nf(false); // returns 'undefined'\n\nfor (var i = 0; i < 10; i++) {\n\tsetTimeout(function () {\n\t\tconsole.log(i);\n\t}, 100 * i);\n}\n",
    },
]));
