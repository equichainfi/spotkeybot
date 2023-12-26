/* eslint-disable quotes */
import { IFormatInput, MainImplResponse } from "probot";

export default function format({ found, sender, res }: IFormatInput): string {
    const header: string = found
        ? `# ❗ Private Key found❗\n### ⚠️ You can proceed with caution ⚠️\n\n### 👤 Sender: @${sender}`
        : `# ✨ No Private Key found ✨\n✅ You can easily now merge this PR ✅`;

    if (found) {
        const keysFound: string = res
            .map((r: MainImplResponse) => {
                const lineAndKey = r.keysFound.map((key: string, i: number) => {
                    return `Line ${r.lineNumbers[i]}: \`${key}\``;
                });
                if (lineAndKey.length === 0) return "";
                else return `#### ${r.fileName}:\n${lineAndKey.join("\n")}`;
            })
            .join("\n");

        return `${header}\n\n### Keys Found:\n${keysFound}\n\n`;
    } else return `${header}`;
}

//todo make "Line ${r.lineNumbers[index]}: \`${key}\`" a link to the line in the file
