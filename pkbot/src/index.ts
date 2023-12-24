import dotenv from "dotenv";
import { IFileObject, IFiles, MainImplResponse, Probot } from "probot";
import { findKey, format } from "./functions";
import { EVENTS, NOT_FOUND_MSG, WELCOME_MESSAGE } from "./functions/utils";
dotenv.config();

export = (app: Probot): void => {
    app.log.info(WELCOME_MESSAGE);

    app.on(EVENTS, async (context) => {
        let msg, sender: string, found: boolean;

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

        /**
         * idk, when i get NOT_FOUND_MSG, it works but found is still true no matter what and res in MD is like found === true
         */
        const privateKeysResult: MainImplResponse[] | string = findKey(
            filesDataArray.map((file) => ({
                fileName: file.fileName,
                fileContent: file.fileContent,
            })),
        );

        found = privateKeysResult !== NOT_FOUND_MSG ? true : false;

        sender = context.payload.sender.login;
        msg = context.issue({
            body: `${format({ filesArray, found, sender })}`,
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

/**
 * 1. check if repo is private
 * 2. if repo is private, then print msg to PR chat
 * 3. else ... idk
 */
