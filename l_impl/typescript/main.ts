interface FindKeyResult {
	fileName: string;
	lineContent: string;
	lineNumbers: number[];
	keysFound: string[];
	addressesFound: string[];
	numberOfKeysFound: number;
}

interface IFiles {
	fileName: string;
	fileContent: string;
}

interface MainImplResponse {
	fileName: string;
	lineNumbers: number[];
	keysFound: string[];
}

const ETH_PV_KEY_REGEX: RegExp = /^(0x)?[0-9a-fA-F]{64}$/;
const ETH_ADDRESS_REGEX: RegExp = /^(0x)?[0-9a-fA-F]{40}$/;
const PGP_KEY_REGEX: RegExp =
	/^(-----BEGIN PGP PUBLIC KEY BLOCK-----).*([a-zA-Z0-9//\n/.:+ =]+).*(-----END PGP PUBLIC KEY BLOCK-----)$|^(-----BEGIN PGP PRIVATE KEY BLOCK-----).*([a-zA-Z0-9//\n/.:+ =]+).*(-----END PGP PRIVATE KEY BLOCK-----)$/;

const PV_KEY_FOUND: string = "[+] Private Key found";
const ADDRESS_FOUND: string = "[+] Address found";
const PGP_KEY_FOUND: string = "[+] PGP Key found";

const NOT_FOUND_MSG: string = "No Private Keys found!";

function findKey(files: IFiles[]): MainImplResponse[] | null {
	const result = processFile(files);

	if (result.length === 0) return null;

	return result;
}

function processFile(files: IFiles[]): MainImplResponse[] {
	let result: FindKeyResult[] = [];

	for (const file of files) {
		if (!file.fileName) continue;

		let caughtKeys: string[] = [];
		let caughtAddresses: string[] = [];
		let caughtLineNumbers: number[] = [];
		let fileName: string = file.fileName;
		let lineContent: string[] = [];

		const lines: string[] = file.fileContent.split("\n");

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];

			let spotResult: string | boolean = spotPrivateKey(line);

			if (spotResult && spotResult.startsWith(PV_KEY_FOUND)) {
				const privateKey: string = spotResult.split(": ")[1];
				const lineNumber: number = i + 1;

				caughtLineNumbers.push(lineNumber);
				caughtKeys.push(privateKey);
			} else if (spotResult && spotResult.startsWith(ADDRESS_FOUND)) {
				const address: string = spotResult.split(": ")[1];
				const lineNumber: number = i + 1;

				caughtLineNumbers.push(lineNumber);
				caughtAddresses.push(address);
			} else if (spotResult && spotResult.startsWith(PGP_KEY_FOUND)) {
				const pgpKey: string = spotResult.split(": ")[1];
				const lineNumber: number = i + 1;

				caughtLineNumbers.push(lineNumber);
				caughtKeys.push(pgpKey);
			} else {
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

function spotPrivateKey(line: string) {
	if (typeof line !== "string") throw new Error("line must be a string");

	if (line.match(ETH_PV_KEY_REGEX)) return `${PV_KEY_FOUND}: ${line}`;
	else if (line.match(ETH_ADDRESS_REGEX)) return `${ADDRESS_FOUND}: ${line}`;
	else if (line.match(PGP_KEY_REGEX)) return `${PGP_KEY_FOUND}: ${line}`;
	else return "none";
}

function formatResult(result: FindKeyResult[]): MainImplResponse[] {
	let formattedResult = [];

	for (const fileData of result) {
		const lineNumbers = [...new Set(fileData.lineNumbers)];

		formattedResult.push({
			fileName: fileData.fileName,
			lineNumbers: lineNumbers,
			keysFound: fileData.keysFound,
		});
	}

	return formattedResult;
}

console.log(
	findKey([
		{
			fileName: "src/file1.txt",
			fileContent: `0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef\n
10ac8b8edd8935b0999cfc9a45ed1f02f7ff798854e973794b64c4dc2a6fa451\n
\n
TEST: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef\n
\n
\n
0x9a116E22E1247B8cbEb4693B2BcF20c21C477394\n
9a116E22E1247B8cbEb4693B2BcF20c21C477394`,
		},
		{
			fileName: "src/file2.ts",
			fileContent: `function sumMatrix(matrix: number[][]) {
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
		return x;
	}
}
// 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
// asdasdsadsad 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef adsasdsadasdas
f(true); // returns '10'
f(false); // returns 'undefined'

for (var i = 0; i < 10; i++) {
	setTimeout(function () {
		console.log(i);
	}, 100 * i);
}
`,
		},
	])
);
