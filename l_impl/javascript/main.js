const readlineSync = require("readline-sync");
const fs = require("fs");
const { exec } = require("child_process");

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const processFile = async filePaths => {
	const result = {};

	for (const filePath of filePaths) {
		const catchedPV = [];
		const catchedAddresses = [];
		const lineNumbers = [];

		try {
			const lines = fs.readFileSync(filePath, "utf8").split("\n");

			for (const [index, line] of lines.entries()) {
				const spotResult = spot(line);

				if (
					spotResult &&
					spotResult.startsWith("[+] Private Key found")
				) {
					result[filePath] = result[filePath] || [];
					result[filePath].push(index);
					catchedPV.push(line);
					lineNumbers.push(index + 1);
				} else if (
					spotResult &&
					spotResult.startsWith("[+] Address found")
				) {
					result[filePath] = result[filePath] || [];
					result[filePath].push(index);
					catchedAddresses.push(line);
					lineNumbers.push(index + 1);
				}
			}
		} catch (error) {
			console.error(
				`Error processing file ${filePath}: ${error.message}`
			);
		}

		console.log(`\x1b[31m[+] Private Keys Catched: ${catchedPV}\x1b[0m`);
		console.log(`\x1b[33m[+] Line numbers: ${lineNumbers.sort()}\x1b[0m`);
	}

	return formatResult(result);
};

const formatResult = result => {
	let resultStr = "";
	for (const filePath in result) {
		resultStr += `\x1b[31m\n[+] File: ${filePath}\x1b[0m\n`;
		for (const lineNumber of result[filePath]) {
			resultStr += `\x1b[33m[+] Line number: ${lineNumber + 1}\x1b[0m\n`;
		}
	}

	return resultStr;
};

const main = async filePaths => {
	if (!Array.isArray(filePaths)) {
		throw new TypeError(`[-] Expected array, got ${typeof filePaths}`);
	}

	return await processFile(filePaths);
};

const spot = line => {
	const pvkeyRegex = /(^|\b)(0x)?[0-9a-fA-F]{64}(\b|$)/;
	const addrRegex = /(^|\b)(0x)?[0-9a-fA-F]{40}(\b|$)/;
	const pgpRegex =
		/^(-----BEGIN PGP PUBLIC KEY BLOCK-----).*([a-zA-Z0-9\/\/\n\/\.\:\+\ \=]+).*(-----END PGP PUBLIC KEY BLOCK-----)$|^(-----BEGIN PGP PRIVATE KEY BLOCK-----).*([a-zA-Z0-9\/\/\n\/\.\:\+\ \=]+).*(-----END PGP PRIVATE KEY BLOCK-----)$/;

	if (pvkeyRegex.test(line)) {
		return `[+] Private Key found: ${line}`;
	} else if (addrRegex.test(line)) {
		return `[+] Address found: ${line}`;
	} else if (pgpRegex.test(line)) {
		return `[+] Private Key Block found: ${line}`;
	} else {
		return null;
	}
};

const filePaths = [
	"C:/Users/olivi/OneDrive/Pulpit/pkbot/l_impl/tests/eth500.txt",
	"C:/Users/olivi/OneDrive/Pulpit/pkbot/l_impl/tests/main.ts",
	"C:/Users/olivi/OneDrive/Pulpit/pkbot/l_impl/tests/file.txt",
	"C:/Users/olivi/OneDrive/Pulpit/pkbot/l_impl/tests/cert.txt",
];

main(filePaths).then(console.log);
