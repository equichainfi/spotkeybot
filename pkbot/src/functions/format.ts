/* eslint-disable quotes */
import { IFileObject, IFormatInput } from "probot";

export default function format({
    filesArray,
    found,
    sender,
    res,
}: IFormatInput): string {
    const header: string = found
        ? `# ❗ Private Key found❗\n### ⚠️ You can proceed with caution ⚠️\n\n### 👤 Sender: @${sender}`
        : `# ✨ No Private Key found ✨\n✅ You can easily now merge this PR ✅`;

    if (found) {
        const filesChanged: string = filesArray
            .map(
                (file: IFileObject, index: number) =>
                    `${index + 1}. ${file.filename} (+${file.additions} -${
                        file.deletions
                    })`,
            )
            .join("\n");

        const keysFound = res
            .map((r) => {
                const keys = r.keysFound.map((key) => `* ${key}`);
                if (keys.length === 0) return "";
                else return `#### ${r.fileName}:\n${keys.join("\n")}`;
            })
            .join("\n");

        return `${header}\n\n### Files Changed:\n${filesChanged}\n\n### Keys Found:\n${keysFound}\n\n`;
    } else return `${header}`;
}

// function getFileExtension(fileName: string): string {
//     return (fileName.split(".").pop() || "").toLowerCase();
// }
