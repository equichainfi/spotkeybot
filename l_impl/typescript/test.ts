interface FindKeyResult {
	fileName: string;
	lineContent: string;
	lineNumbers: number[];
	keysFound: string[];
	addressesFound: string[];
	numberOfKeysFound: number;
}

type IFiles = {
	fileName: string;
	fileContent: string;
}[];

interface MainImplResponse {
	fileName: string;
	lineNumbers: number[];
	keysFound: string[];
}
import {
	ETH_PV_KEY_REGEX,
	ETH_ADDRESS_REGEX,
	PGP_KEY_REGEX,
	PV_KEY_FOUND,
	ADDRESS_FOUND,
	PGP_KEY_FOUND,
} from "../../pkbot/src/functions/utils";

export default function findKey(files: IFiles) {
	const result = processFile(files);

	if (result.length === 0) return "No Private Keys found!";

	return result;
}

function processFile(files: IFiles): MainImplResponse[] {
	let result: FindKeyResult[] = [];
	for (const file of files) {
		if (!file.fileName) continue;

		let caughtKeys: string[] = [];
		let caughtAddresses: string[] = [];
		let caughtLineNumbers: number[] = [];
		let fileName: string = file.fileName;
		let lineContent: string[] = [];

		const lines: string[] = file.fileContent.split("\n");
		for (const line of lines) {
			let catchedPrivateKeys: { [key: number]: string } = {};

			let catchedAddresses: { [key: number]: string } = {};

			let spotResult: string | boolean = spotPrivateKey(line);

			if (spotResult && spotResult.startsWith(PV_KEY_FOUND)) {
				const privateKey: string = spotResult.split(": ")[1];
				const lineNumber: number = lines.indexOf(line) + 1;

				caughtLineNumbers.push(lineNumber);
				catchedPrivateKeys[lineNumber] = privateKey;
			} else if (spotResult && spotResult.startsWith(ADDRESS_FOUND)) {
				const address: string = spotResult.split(": ")[1];
				const lineNumber: number = lines.indexOf(line) + 1;

				caughtLineNumbers.push(lineNumber);
				catchedAddresses[lineNumber] = address;
			} else if (spotResult && spotResult.startsWith(PGP_KEY_FOUND)) {
				const pgpKey: string = spotResult.split(": ")[1];
				const lineNumber: number = lines.indexOf(line) + 1;

				caughtLineNumbers.push(lineNumber);
				catchedPrivateKeys[lineNumber] = pgpKey;
			} else continue;
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
	if (typeof line !== "string") {
		throw new Error("line must be a string");
	}

	if (line.match(ETH_PV_KEY_REGEX)) return `${PV_KEY_FOUND}: ${line}`;
	else if (line.match(ETH_ADDRESS_REGEX)) {
		return `${ADDRESS_FOUND}: ${line}`;
	} else if (line.match(PGP_KEY_REGEX)) {
		return `${PGP_KEY_FOUND}: ${line}`;
	} else return "none";
}

function formatResult(result: FindKeyResult[]): MainImplResponse[] {
	let formattedResult = [];

	for (const filename in result) {
		const fileData = result[filename];
		let lineNumbers: number[] = [];

		for (const lineNumber in fileData.lineNumbers) {
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

console.log(
	findKey([
		{
			fileName: "test.txt",
			fileContent:
				"0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef" +
				"10ac8b8edd8935b0999cfc9a45ed1f02f7ff798854e973794b64c4dc2a6fa451" +
				"TEST: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef" +
				"0x9a116E22E1247B8cbEb4693B2BcF20c21C477394" +
				"9a116E22E1247B8cbEb4693B2BcF20c21C477394",
		},
		{
			fileName: "test.txt",
			fileContent:
				"0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef" +
				"10ac8b8edd8935b0999cfc9a45ed1f02f7ff798854e973794b64c4dc2a6fa451" +
				"TEST: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef" +
				"0x9a116E22E1247B8cbEb4693B2BcF20c21C477394" +
				"9a116E22E1247B8cbEb4693B2BcF20c21C477394",
		},
	])
);
