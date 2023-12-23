import { FindKeyResult, IFiles, MainImplResponse, Response } from "probot";
import {
    ADDRESS_FOUND,
    ETH_ADDRESS_REGEX,
    ETH_PV_KEY_REGEX,
    NOT_FOUND_MSG,
    PGP_KEY_FOUND,
    PGP_KEY_REGEX,
    PV_KEY_FOUND,
} from "./utils";

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
        let caughtAddresses: string[] = [];
        let caughtLineNumbers: number[] = [];
        let fileName: string = file.fileName;
        let lineContent: string[] = [];

        const lines: string[] = file.fileContent.split("\n");

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (line.startsWith("+")) {
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
                } else lineContent.push(line);
            } else if (line.startsWith("-")) continue;
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
        if (file.keysFound.length === 0 && file.lineNumbers.length === 0)
            found = false;
        if (file.fileName === "") found = false;
        else found = true;
    }

    return found ? formattedResult : NOT_FOUND_MSG;
}
