import { IFileObject, IFiles, MainImplResponse, Probot } from "probot";
import dotenv from "dotenv";
import { findKey, format } from "./lib";
dotenv.config();

export = (app: Probot): void => {
    const NOT_FOUND_LABEL: string = process.env.NOT_FOUND_LABEL!;
    const FOUND_LABEL: string = process.env.FOUND_LABEL!;
    const EVENTS: any[] = [
        "pull_request.opened",
        "pull_request.reopened",
        "pull_request.edited",
        "pull_request.synchronize",
    ];

    app.log.info(
        "============================= pkbotapp loaded =============================\n",
    );

    app.on(EVENTS, async (context) => {
        let msg: any, sender: string;

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

        // console.log(filesDataArray);

        const privateKeysResult: MainImplResponse[] = findKey(
            filesDataArray.map((file) => ({
                fileName: file.fileName,
                fileContent: file.fileContent,
            })),
        );

        console.log(
            findKey(
                filesDataArray.map((file) => ({
                    fileName: file.fileName,
                    fileContent: file.fileContent,
                })),
            ),
        );

        let hasPrivateKey: boolean = privateKeysResult.length > 0;

        if (hasPrivateKey)
            await context.octokit.issues.addLabels(
                context.issue({ labels: [FOUND_LABEL] }),
            );
        else
            await context.octokit.issues.addLabels(
                context.issue({ labels: [NOT_FOUND_LABEL] }),
            );

        sender = context.payload.sender.login;
        msg = context.issue({
            body: `${format({ filesArray, found: hasPrivateKey, sender })}`,
        });

        await context.octokit.issues.createComment(msg);
    });
};
