/* eslint-disable quotes */
import { IFileObject, IFormatInput } from "probot";

export default function format({
    filesArray,
    found,
    sender,
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

        const filesContent: string = filesArray
            .map(
                (file: IFileObject) =>
                    `**===== ${file.filename} =====**\n\`\`\`${getFileExtension(
                        file.filename,
                    )}\n${file.fileData}\n\`\`\``,
            )
            .join("\n\n");

        return `${header}\n\n### Files changed:\n${filesChanged}\n\n### Files content:\n${filesContent}\n\n`;
    } else return `${header}`;
}

function getFileExtension(fileName: string): string {
    return (fileName.split(".").pop() || "").toLowerCase();
}
