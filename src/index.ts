import dotenv from "dotenv";
import { IFileObject, IFiles, MainImplResponse, Probot } from "probot";
import { findKey, format } from "./functions";
import foundPrivateKey from "./functions/hasKey";
import { EVENTS } from "./functions/utils";
dotenv.config();

export = (app: Probot): void => {
    app.on(EVENTS, async (context) => {
        const filesArray: IFileObject[] = [];
        const filesDataArray: IFiles[] = [];
        let msg, sender: string, found: boolean;

        const pushedFilesData = await context.octokit.pulls.listFiles({
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            pull_number: context.payload.pull_request.number,
        });

        for (const file of pushedFilesData.data) {
            const filename: string = file.filename;
            const additions: number = file.additions;
            const deletions: number = file.deletions;
            const fileData: string =
                file.patch?.split("\n").slice(1).join("\n").trim() ?? "";
            const fileObject: IFileObject = {
                filename: filename,
                additions: additions,
                deletions: deletions,
                fileData: fileData,
            };

            filesArray.push(fileObject);
            filesDataArray.push({
                fileName: filename,
                fileContent: fileData,
            });
        }
        const res: MainImplResponse[] = findKey(filesDataArray);

        const fileBlobs: string[] = pushedFilesData.data.map(
            (file) => file.blob_url,
        );
        sender = context.payload.sender.login;
        found = foundPrivateKey(res);
        msg = context.issue({
            body: `${format({ found, sender, res, fileBlobs })}`,
        });
        // label = addLabel(hasPrivateKey);

        // await context.octokit.issues.addLabels({
        //     owner: context.payload.repository.owner.login,
        //     repo: context.payload.repository.name,
        //     issue_number: context.payload.pull_request.number,
        //     labels: [label],
        // });

        await context.octokit.issues.createComment(msg);
    });
};
