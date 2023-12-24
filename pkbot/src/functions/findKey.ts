import { FindKeyResult, IFiles, MainImplResponse, Response } from "probot";
import {
    ADDRESS_FOUND,
    NOT_FOUND_MSG,
    PGP_KEY_FOUND,
    PV_KEY_FOUND,
} from "./utils";
import { ETH_ADDRESS_REGEX, ETH_PV_KEY_REGEX, PGP_KEY_REGEX } from "./regex";

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

function spotPrivateKey(line: string, lineNumber: number): string {
    if (ETH_PV_KEY_REGEX.test(line))
        return `${PV_KEY_FOUND} in line ${lineNumber + 1}: ${line}`;
    else if (ETH_ADDRESS_REGEX.test(line))
        return `${ADDRESS_FOUND} in line ${lineNumber + 1}: ${line}`;
    else if (PGP_KEY_REGEX.test(line))
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
