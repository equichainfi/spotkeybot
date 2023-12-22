"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../pkbot/src/lib/utils");
function findKey(files) {
    var result = processFile(files);
    if (result.length === 0)
        return "No Private Keys found!";
    return result;
}
exports.default = findKey;
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
        for (var _a = 0, lines_1 = lines; _a < lines_1.length; _a++) {
            var line = lines_1[_a];
            var catchedPrivateKeys = {};
            var catchedAddresses = {};
            var spotResult = spotPrivateKey(line);
            if (spotResult && spotResult.startsWith(utils_1.PV_KEY_FOUND)) {
                var privateKey = spotResult.split(": ")[1];
                var lineNumber = lines.indexOf(line) + 1;
                caughtLineNumbers.push(lineNumber);
                catchedPrivateKeys[lineNumber] = privateKey;
            }
            else if (spotResult && spotResult.startsWith(utils_1.ADDRESS_FOUND)) {
                var address = spotResult.split(": ")[1];
                var lineNumber = lines.indexOf(line) + 1;
                caughtLineNumbers.push(lineNumber);
                catchedAddresses[lineNumber] = address;
            }
            else if (spotResult && spotResult.startsWith(utils_1.PGP_KEY_FOUND)) {
                var pgpKey = spotResult.split(": ")[1];
                var lineNumber = lines.indexOf(line) + 1;
                caughtLineNumbers.push(lineNumber);
                catchedPrivateKeys[lineNumber] = pgpKey;
            }
            else
                continue;
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
    if (typeof line !== "string") {
        throw new Error("line must be a string");
    }
    if (line.match(utils_1.ETH_PV_KEY_REGEX))
        return "".concat(utils_1.PV_KEY_FOUND, ": ").concat(line);
    else if (line.match(utils_1.ETH_ADDRESS_REGEX)) {
        return "".concat(utils_1.ADDRESS_FOUND, ": ").concat(line);
    }
    else if (line.match(utils_1.PGP_KEY_REGEX)) {
        return "".concat(utils_1.PGP_KEY_FOUND, ": ").concat(line);
    }
    else
        return "none";
}
function formatResult(result) {
    var formattedResult = [];
    for (var filename in result) {
        var fileData = result[filename];
        var lineNumbers = [];
        for (var lineNumber in fileData.lineNumbers) {
            lineNumbers.push(fileData.lineNumbers[lineNumber]);
        }
        formattedResult.push({
            fileName: filename,
            lineNumbers: lineNumbers,
            keysFound: fileData.keysFound,
        });
    }
    return formattedResult;
}
console.log(findKey([
    {
        fileName: "test.txt",
        fileContent: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef" +
            "10ac8b8edd8935b0999cfc9a45ed1f02f7ff798854e973794b64c4dc2a6fa451" +
            "TEST: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef" +
            "0x9a116E22E1247B8cbEb4693B2BcF20c21C477394" +
            "9a116E22E1247B8cbEb4693B2BcF20c21C477394",
    },
    {
        fileName: "test.txt",
        fileContent: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef" +
            "10ac8b8edd8935b0999cfc9a45ed1f02f7ff798854e973794b64c4dc2a6fa451" +
            "TEST: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef" +
            "0x9a116E22E1247B8cbEb4693B2BcF20c21C477394" +
            "9a116E22E1247B8cbEb4693B2BcF20c21C477394",
    },
]));
