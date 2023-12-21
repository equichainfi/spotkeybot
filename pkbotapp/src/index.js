/**
 * This is the main entrypoint to your Probot app
 * @param {import("probot").Probot} app
 */

const dotenv = require("dotenv");
const format = require("./lib/format");
const findKey = require("./lib/findKey");
dotenv.config();

module.exports = (app) => {
    NOT_FOUND_LABEL = process.env.NOT_FOUND_LABEL;
    FOUND_LABEL = process.env.FOUND_LABEL;

    app.log.info(
        "============================= pkbotapp loaded =============================\n",
    );

    app.on(
        [
            "pull_request.opened",
            "pull_request.reopened",
            "pull_request.edited",
            "pull_request.synchronize",
        ],
        async (context) => {
            let hasPrivateKey, msg;

            const pushedFilesData = await context.octokit.pulls.listFiles({
                owner: context.payload.repository.owner.login,
                repo: context.payload.repository.name,
                pull_number: 21,
                // fix pull_number
            });

            const filesArray = [];
            const filesDataArray = [];

            for (const file of pushedFilesData.data) {
                const filename = file.filename;
                const additions = file.additions;
                const deletions = file.deletions;

                const fileData = file.patch
                    .split("\n")
                    .slice(1)
                    .join("\n")
                    .trim();

                const fileObject = {
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

            console.log(filesDataArray);
            console.log(findKey(filesDataArray));
            // hasPrivateKey = findKey(filesDataArray) ? true : false;

            if (hasPrivateKey) {
                // const label = context.issue({ labels: [FOUND_LABEL] });
                msg = context.issue({
                    body: `${format(filesArray, hasPrivateKey)}`,
                });
            } else {
                const label = context.issue({ labels: [NOT_FOUND_LABEL] });
                msg = context.issue({
                    body: `${format(filesArray, hasPrivateKey)}`,
                });
            }

            await context.octokit.issues.createComment(msg);
        },
    );
};
