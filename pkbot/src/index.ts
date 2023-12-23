import {
    AddLabelResponse,
    IFileObject,
    IFiles,
    MainImplResponse,
    Probot,
} from "probot";
import dotenv from "dotenv";
import { findKey, format, addLabel } from "./functions";
import { EVENTS } from "./functions/utils";
dotenv.config();

export = (app: Probot): void => {
    app.log.info(
        "============================= pkbotapp loaded =============================\n",
    );

    app.on(EVENTS, async (context) => {
        let msg: any, sender: string, label: AddLabelResponse;

        const pushedFilesData = await context.octokit.pulls.listFiles({
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            pull_number: context.payload.pull_request.number,
        });

        const filesArray: IFileObject[] = [];
        const filesDataArray: IFiles[] = [];

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

        const privateKeysResult: MainImplResponse[] | string = findKey(
            filesDataArray.map((file) => ({
                fileName: file.fileName,
                fileContent: file.fileContent,
            })),
        );

        console.log(privateKeysResult);

        let hasPrivateKey: boolean = privateKeysResult.length > 0;

        sender = context.payload.sender.login;
        msg = context.issue({
            body: `${format({ filesArray, found: hasPrivateKey, sender })}`,
        });
        label = addLabel(hasPrivateKey);

        await context.octokit.issues.addLabels({
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            issue_number: context.payload.pull_request.number,
            labels: [label],
        });
        await context.octokit.issues.createComment(msg);
    });
};

/**
 * 1. check if repo is private
 * 2. if repo is private, then print msg to PR chat
 * 3. else ... idk
 */
