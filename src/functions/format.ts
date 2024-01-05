/* eslint-disable quotes */
import { IFormatInput, MainImplResponse } from "probot";

export default function format({
    found,
    sender,
    res,
    fileBlobs,
    repoName,
    orgName,
}: IFormatInput): string {
    const header: string = found
        ? `# ❗ Private Key found❗\n### ⚠️ You can proceed with caution ⚠️\n\n### 👤 Sender: @${sender}`
        : `# ✨ No Private Key found ✨\n✅ You can easily now merge this PR ✅`;

    if (found) {
        const keysFound: string = res
            .map((r: MainImplResponse) => {
                const lineAndKey = r.keysFound.map(
                    (key: string, index: number) => {
                        if (r.lineNumbers[index] === undefined) return "";
                        const commitHash: string | null = extractCommitHash(
                            fileBlobs[index],
                        );
                        if (!commitHash) return "";
                        const linkToLine: string = `${r.lineNumbers[index]}:](${fileBlobs[index]}#L${r.lineNumbers[index]}`;
                        const linkToBlob: string = `https://github.com/${orgName}/${repoName}/issues/new?permalink=https%3A%2F%2Fgithub.com%2F${orgName}%2F${repoName}%2Fblob%2F${commitHash}%2F${r.fileName}%23L${r.lineNumbers[index]}`;

                        return `**[Line ${linkToLine})** \`${key}\` [create an issue](${linkToBlob}) 🆘`;
                    },
                );
                if (lineAndKey.length === 1 && lineAndKey[0] === "") return "";
                else return `### **${r.fileName}:**\n${lineAndKey.join("\n")}`;
            })
            .join("\n");

        return `${header}\n\n## Keys Found:\n${keysFound}\n\n`;
    } else return `${header}`;
}

function extractCommitHash(url: string): string | null {
    const match = url.match(/\/blob\/([a-f0-9]+)\//);
    return match ? match[1] : null;
}
