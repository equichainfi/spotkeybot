var files = [
    {
        fileName: "./src/file1.ts",
        fileContent: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef\n" +
            "10ac8b8edd8935b0999cfc9a45ed1f02f7ff798854e973794b64c4dc2a6fa451\n" +
            "\n" +
            "TEST: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef\n",
    },
    {
        fileName: "./src/file2.ts",
        fileContent: "function sumMatrix(matrix: number[][]) {\n" +
            "\tvar sum = 0;\n" +
            "\tfor (var i = 0; i < matrix.length; i++) {\n" +
            "\t\tvar currentRow = matrix[i];\n" +
            "\t\tfor (var i = 0; i < currentRow.length; i++) {\n" +
            "\t\t\tsum += currentRow[i];\n" +
            "\t\t}\n" +
            "\t}\n" +
            "\treturn sum;\n" +
            "}\n" +
            "\n" +
            "function f(shouldInitialize: boolean) {\n" +
            "\tif (shouldInitialize) {\n" +
            "\t\tvar x = 10;\n" +
            "\t}\n" +
            "\treturn x;\n" +
            "}\n" +
            "// 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef\n" +
            "f(true); // returns '10'\n" +
            "f(false); // returns 'undefined'\n" +
            "\n" +
            "for (var i = 0; i < 10; i++) {\n" +
            "\tsetTimeout(function () {\n" +
            "\t\tconsole.log(i);\n" +
            "\t}, 100 * i);\n" +
            "}\n",
    },
];
var ETH_PV_KEY_REGEX = /^(0x)?[0-9a-fA-F]{64}$/;
var ETH_ADDRESS_REGEX = /^(0x)?[0-9a-fA-F]{40}$/;
var PGP_KEY_REGEX = /^(-----BEGIN PGP PUBLIC KEY BLOCK-----).*([a-zA-Z0-9//\n/.:+ =]+).*(-----END PGP PUBLIC KEY BLOCK-----)$|^(-----BEGIN PGP PRIVATE KEY BLOCK-----).*([a-zA-Z0-9//\n/.:+ =]+).*(-----END PGP PRIVATE KEY BLOCK-----)$/;
function main(files) {
    var res = processFile(files);
    return res;
}
function processFile(files) {
    var result = [];
    var formmatedResult = "";
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        var caughtKeys = [];
        var caughtAddresses = [];
        var caughtLineNumbers = [];
        var fileName = file.fileName;
        var lineContent = [];
        var lines = file.fileContent.split("\n");
        for (var _a = 0, lines_1 = lines; _a < lines_1.length; _a++) {
            var line = lines_1[_a];
            var lineResult = spotKeys(line);
            if (lineResult && (lineResult.startsWith("[+] Ethereum pv key founded:") || lineResult.startsWith("[+] PGP key founded:"))) {
                var privateKey = lineResult.split(": ")[1];
                var lineNumber = lines.indexOf(line) + 1;
                caughtKeys.push(privateKey);
                caughtLineNumbers.push(lineNumber);
            }
            else if (lineResult && lineResult.startsWith("[+] Ethereum address founded:")) {
                var address = lineResult.split(": ")[1];
                var lineNumber = lines.indexOf(line) + 1;
                caughtAddresses.push(address);
                caughtLineNumbers.push(lineNumber);
            }
            if (lineResult) {
                lineContent.push(line);
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
    console.log(format(result));
    return result;
}
function format(result) {
    return result.map(function (fileResult) {
        return "============ File: ".concat(fileResult.fileName, " ============\n") +
            "Line: ".concat(fileResult.lineNumbers.join(", ") ? fileResult.lineNumbers.join(", ") : "None", "\n") +
            "Keys found: ".concat(fileResult.keysFound.length > 0 ? fileResult.keysFound.join(", ") : "None", "\n") +
            "Addresses found: ".concat(fileResult.addressesFound.length > 0 ? fileResult.addressesFound.join(", ") : "None", "\n") +
            "Number of addresses found: ".concat(fileResult.addressesFound.length > 0 ? fileResult.addressesFound.length : "None\n") +
            "Number of keys found: ".concat(fileResult.numberOfKeysFound ? fileResult.numberOfKeysFound : "None", "\n") +
            "Line content: ".concat(fileResult.lineContent.length > 0 ? fileResult.lineContent : "None", "\n");
    }).join("\n");
}
function spotKeys(line) {
    if (line.match(ETH_PV_KEY_REGEX)) {
        return "[+] Ethereum pv key founded: ".concat(line);
    }
    else if (line.match(ETH_ADDRESS_REGEX)) {
        return "[+] Ethereum address founded: ".concat(line);
    }
    else if (line.match(PGP_KEY_REGEX)) {
        return "[+] PGP key founded: ".concat(line);
    }
    else {
        return null;
    }
}
console.log(main(files));
/**
 * @param filePaths - array of files
 * @returns array of objects: { fileName: string, content: string, pvkey: string }
 */
/**
 * [
 * 	{
 *     fileName: "./src/file1.ts",
 *     lineNumbers: [2, 6],
 *     keysFound: ["0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"]
 * 	}
 * ]
 */
