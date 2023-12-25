import { fileDataArray } from "./in";

interface FindKeyResult {
	fileName: string;
	lineContent: string;
	lineNumbers: number[];
	keysFound: string[];
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

type Response = MainImplResponse[] | string;

const ETH_PV_KEY_REGEX: RegExp = /^(0x)?[0-9a-fA-F]{64}$/;
const ETH_ADDRESS_REGEX: RegExp = /^0x[a-fA-F0-9]{40}$/;
const PGP_KEY_REGEX: RegExp =
	/^(-----BEGIN PGP PUBLIC KEY BLOCK-----).*?([a-zA-Z0-9\/\n\+\/:.=]+).*?(-----END PGP PUBLIC KEY BLOCK-----)$|^(-----BEGIN PGP PRIVATE KEY BLOCK-----).*?([a-zA-Z0-9\/\n\+\/:.=]+).*?(-----END PGP PRIVATE KEY BLOCK-----)$/;
const CLEAN_LINE_REGEX: RegExp = /^\s*\+/;

const PV_KEY_FOUND: string = "[+] Private Key found";
const ADDRESS_FOUND: string = "[+] Address found";
const PGP_KEY_FOUND: string = "[+] PGP Key found";
const NOT_FOUND_MSG: string = "[-] No Private Keys found!";

export default function findKey(files: IFiles[]): Response {
	const result: Response = processFile(files);

	if (result === NOT_FOUND_MSG) return NOT_FOUND_MSG as string;

	return result;
}

function processFile(files: IFiles[]): Response {
	let result: FindKeyResult[] = [];

	for (const file of files) {
		if (!file.fileName) continue;

		let caughtKeys: string[] = [];
		let caughtLineNumbers: number[] = [];
		let fileName: string = file.fileName;
		let lineContent: string[] = [];

		const lines: string[] = file.fileContent.split("\n");

		for (
			let lineNumber: number = 0;
			lineNumber < lines.length;
			lineNumber++
		) {
			const line: string = lines[lineNumber];

			let spotResult: string | boolean = spotPrivateKey(line, lineNumber);
			if (
				spotResult &&
				(spotResult.startsWith(PV_KEY_FOUND) ||
					spotResult.startsWith(ADDRESS_FOUND) ||
					spotResult.startsWith(PGP_KEY_FOUND))
			) {
				const privateKey: string = spotResult.split(": ")[1];

				caughtLineNumbers.push(lineNumber);
				caughtKeys.push(privateKey);
			} else lineContent.push(line);
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

function cleanLine(line: string): string {
	const CLEAN_LINE_REGEX = /^\s*[\+\-]/;

	let newLine: string = line.replace(CLEAN_LINE_REGEX, "");
	newLine = newLine.replace(/[^a-fA-F0-9\-]+/g, "");

	return newLine;
}

function spotPrivateKey(line: string, lineNumber: number): string {
	if (ETH_PV_KEY_REGEX.test(cleanLine(line)))
		return `${PV_KEY_FOUND} in line ${lineNumber + 1}: ${line}`;
	else if (ETH_ADDRESS_REGEX.test(cleanLine(line)))
		return `${ADDRESS_FOUND} in line ${lineNumber + 1}: ${line}`;
	else if (PGP_KEY_REGEX.test(cleanLine(line)))
		return `${PGP_KEY_FOUND} in line ${lineNumber + 1}: ${line}`;
	else return `Found nothing in line ${lineNumber + 1}`;
}

function formatResult(result: FindKeyResult[]): Response {
	let formattedResult: MainImplResponse[] = [];
	let found: boolean = false;

	for (const fileData of result) {
		const lineNumbers: number[] = [...new Set(fileData.lineNumbers)];
		formattedResult.push({
			fileName: fileData.fileName,
			lineNumbers: lineNumbers,
			keysFound: fileData.keysFound,
		});
	}

	for (const file of formattedResult) {
		if (file.keysFound.length > 0 || file.lineNumbers.length > 0) {
			found = true;
			break;
		}
	}

	return found ? formattedResult : NOT_FOUND_MSG;
}

console.log(findKey(fileDataArray));
