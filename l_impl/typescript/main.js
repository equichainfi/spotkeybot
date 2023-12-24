"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var ETH_PV_KEY_REGEX = /^(0x)?[0-9a-fA-F]{64}$/;
var ETH_ADDRESS_REGEX = /^(0x)?[0-9a-fA-F]{40}$/;
var PGP_KEY_REGEX = /^(-----BEGIN PGP PUBLIC KEY BLOCK-----).*?([a-zA-Z0-9\/\n\+\/:.=]+).*?(-----END PGP PUBLIC KEY BLOCK-----)$|^(-----BEGIN PGP PRIVATE KEY BLOCK-----).*?([a-zA-Z0-9\/\n\+\/:.=]+).*?(-----END PGP PRIVATE KEY BLOCK-----)$/;
var PV_KEY_FOUND = "[+] Private Key found";
var ADDRESS_FOUND = "[+] Address found";
var PGP_KEY_FOUND = "[+] PGP Key found";
var NOT_FOUND_MSG = "No Private Keys found!";
function findKey(files) {
    var result = processFile(files);
    if (result === NOT_FOUND_MSG)
        return NOT_FOUND_MSG;
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
        var caughtLineNumbers = [];
        var fileName = file.fileName;
        var lineContent = [];
        var lines = file.fileContent.split("\n");
        for (var lineNumber = 0; lineNumber < lines.length; lineNumber++) {
            var line = lines[lineNumber];
            var spotResult = spotPrivateKey(line, lineNumber);
            if (spotResult &&
                (spotResult.startsWith(PV_KEY_FOUND) ||
                    spotResult.startsWith(ADDRESS_FOUND) ||
                    spotResult.startsWith(PGP_KEY_FOUND))) {
                var privateKey = spotResult.split(": ")[1];
                caughtLineNumbers.push(lineNumber);
                caughtKeys.push(privateKey);
            }
            else
                lineContent.push(line);
        }
        result.push({
            fileName: fileName,
            lineContent: lineContent.join("\n"),
            lineNumbers: caughtLineNumbers || [],
            keysFound: caughtKeys || [],
            numberOfKeysFound: caughtKeys.length || 0,
        });
    }
    return formatResult(result);
}
function spotPrivateKey(line, lineNumber) {
    if (ETH_PV_KEY_REGEX.test(line))
        return "".concat(PV_KEY_FOUND, " in line ").concat(lineNumber + 1, ": ").concat(line);
    else if (ETH_ADDRESS_REGEX.test(line))
        return "".concat(ADDRESS_FOUND, " in line ").concat(lineNumber + 1, ": ").concat(line);
    else if (PGP_KEY_REGEX.test(line))
        return "".concat(PGP_KEY_FOUND, " in line ").concat(lineNumber + 1, ": ").concat(line);
    else
        return "Found nothing in line ".concat(lineNumber + 1);
}
function formatResult(result) {
    var formattedResult = [];
    var found = false;
    for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
        var fileData = result_1[_i];
        var lineNumbers = __spreadArray([], new Set(fileData.lineNumbers), true);
        formattedResult.push({
            fileName: fileData.fileName,
            lineNumbers: lineNumbers,
            keysFound: fileData.keysFound,
        });
    }
    for (var _a = 0, formattedResult_1 = formattedResult; _a < formattedResult_1.length; _a++) {
        var file = formattedResult_1[_a];
        if (file.keysFound.length > 0 || file.lineNumbers.length > 0) {
            found = true;
            break;
        }
    }
    return found ? formattedResult : NOT_FOUND_MSG;
}
var f = "ETH Private Key ✅:\n0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef\n\n0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef\nETH Public Key ✅:\n0x9a116E22E1247B8cbEb4693B2BcF20c21C477394";
console.log(findKey([
    {
        fileName: "src/file1.txt",
        fileContent: f,
    },
]));
