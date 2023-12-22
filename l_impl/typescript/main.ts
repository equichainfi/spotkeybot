const files: {
	fileName: string;
	fileContent: string;
}[] = [
	{
		fileName: "./src/file1.ts",
		fileContent:
			"0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef\n" +
			"10ac8b8edd8935b0999cfc9a45ed1f02f7ff798854e973794b64c4dc2a6fa451\n" +
			"\n" +
			"TEST: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef\n",
	},
	{
		fileName: "./src/file2.ts",
		fileContent:
			"function sumMatrix(matrix: number[][]) {\n" +
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


const ETH_PV_KEY_REGEX: RegExp = /^(0x)?[0-9a-fA-F]{64}$/;
const ETH_ADDRESS_REGEX: RegExp = /^(0x)?[0-9a-fA-F]{40}$/;
const PGP_KEY_REGEX: RegExp =
	/^(-----BEGIN PGP PUBLIC KEY BLOCK-----).*([a-zA-Z0-9//\n/.:+ =]+).*(-----END PGP PUBLIC KEY BLOCK-----)$|^(-----BEGIN PGP PRIVATE KEY BLOCK-----).*([a-zA-Z0-9//\n/.:+ =]+).*(-----END PGP PRIVATE KEY BLOCK-----)$/


interface Result {
	fileName: string,
	lineContent: string,
	lineNumbers: number[],
	keysFound: string[],
	addressesFound: string[],
	numberOfKeysFound: number
}

type ProcessedFileResult = Result[]

function main(files: {
	fileName: string;
	fileContent: string;
}[]) {
	const res = processFile(files);

	return res
}

function processFile(files: {
	fileName: string;
	fileContent: string;
}[]) {
	let result = [];
	let formmatedResult = "";

	for (const file of files) {
		let caughtKeys: string[] = [];
		let caughtAddresses: string[] = [];
		let caughtLineNumbers: number[] = [];
		let fileName: string = file.fileName;
		let lineContent: string[] = [];

		const lines: string[] = file.fileContent.split("\n");

		for (const line of lines) {
			let lineResult = spotKeys(line);

			if (lineResult && (lineResult.startsWith("[+] Ethereum pv key founded:") || lineResult.startsWith("[+] PGP key founded:"))) {
				const privateKey: string = lineResult.split(": ")[1];
				const lineNumber: number = lines.indexOf(line) + 1;

				caughtKeys.push(privateKey);
				caughtLineNumbers.push(lineNumber);
			} else if (lineResult && lineResult.startsWith("[+] Ethereum address founded:")) {
				const address: string = lineResult.split(": ")[1];
				const lineNumber: number = lines.indexOf(line) + 1;

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

function format(result: any): string {
	return result.map((fileResult: Result): string => {
		return `============ File: ${fileResult.fileName} ============\n` +
			`Line: ${fileResult.lineNumbers.join(", ") ? fileResult.lineNumbers.join(", ") : "None"}\n` +
			`Keys found: ${fileResult.keysFound.length > 0 ? fileResult.keysFound.join(", ") : "None"}\n` +
			`Addresses found: ${fileResult.addressesFound.length > 0 ? fileResult.addressesFound.join(", ") : "None"}\n` +
			`Number of addresses found: ${fileResult.addressesFound.length > 0 ? fileResult.addressesFound.length : "None\n"}` +
			`Number of keys found: ${fileResult.numberOfKeysFound ? fileResult.numberOfKeysFound : "None"}\n` +
			`Line content: ${fileResult.lineContent.length > 0 ? fileResult.lineContent : "None"}\n`
	}).join("\n");
}

function spotKeys(line: string): string | null {
	if (line.match(ETH_PV_KEY_REGEX)) {
		return `[+] Ethereum pv key founded: ${line}`
	} else if (line.match(ETH_ADDRESS_REGEX)) {
		return `[+] Ethereum address founded: ${line}`
	} else if (line.match(PGP_KEY_REGEX)) {
		return `[+] PGP key founded: ${line}`
	} else {
		return null
	}
}

console.log(main(files))

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
