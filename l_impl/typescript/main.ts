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

const ETH_PV_KEY_REGEX: RegExp = /(^|\b)(0x)?[0-9a-fA-F]{64}(\b|$)/;
const ETH_ADDRESS_REGEX: RegExp = /(^|\b)(0x)?[0-9a-fA-F]{40}(\b|$)/;
const BTC_PV_KEY_REGEX: RegExp = / ^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/;
const PGP_KEY_REGEX: RegExp =
	/^(-----BEGIN PGP PUBLIC KEY BLOCK-----).*?([a-zA-Z0-9\/\n\+\/:.=]+).*?(-----END PGP PUBLIC KEY BLOCK-----)$|^(-----BEGIN PGP PRIVATE KEY BLOCK-----).*?([a-zA-Z0-9\/\n\+\/:.=]+).*?(-----END PGP PRIVATE KEY BLOCK-----)$/;

const PV_KEY_FOUND: string = "[+] Private Key found";
const ADDRESS_FOUND: string = "[+] Address found";
const PGP_KEY_FOUND: string = "[+] PGP Key found";
const NOT_FOUND_MSG: string = "[-] No Private Keys found!";

export default function findKey(files: IFiles[]): Response {
	const result: Response = processFile(files) as Response;

	if (result === NOT_FOUND_MSG) return NOT_FOUND_MSG as string;

	return result;
}

function processFile(files: IFiles[]): Response | undefined {
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
			keysFound:
				extractLineFromKey(caughtKeys.join("\n")).split("\n") || [],
			numberOfKeysFound: caughtKeys.length || 0,
		});
	}

	return formatResult(result);
}

function spotPrivateKey(line: string, lineNumber: number): string {
	if (ETH_PV_KEY_REGEX.test(line))
		return `${PV_KEY_FOUND} in line ${lineNumber + 1}: ${line}`;
	else if (ETH_ADDRESS_REGEX.test(line))
		return `${ADDRESS_FOUND} in line ${lineNumber + 1}: ${line}`;
	else if (PGP_KEY_REGEX.test(line))
		return `${PGP_KEY_FOUND} in line ${lineNumber + 1}: ${line}`;
	else if (BTC_PV_KEY_REGEX.test(line))
		return `${PV_KEY_FOUND} in line ${lineNumber + 1}: ${line}`;
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

function extractLineFromKey(line: string): string {
	return line.replace(/^[\s*+-]+/, "").trim();
}

console.log(findKey(fileDataArray));
