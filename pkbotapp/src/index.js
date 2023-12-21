/**
 * This is the main entrypoint to your Probot app
 * @param {import("probot").Probot} app
 */

const dotenv = require("dotenv");
const format = require("./lib/format");
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
            let hasPrivateKey = false;

            const pushedFilesData = await context.octokit.pulls.listFiles({
                owner: context.payload.repository.owner.login,
                repo: context.payload.repository.name,
                pull_number: 16,
            });

            const filesArray = [];
            const filesDataArray = [];

            for (const file of pushedFilesData.data) {
                const filename = file.filename;
                const additions = file.additions;
                const deletions = file.deletions;
                const fileData = file.patch.replace("@@ -0,0 +1 @@\n+", "");

                const fileObject = {
                    filename: filename,
                    additions: additions,
                    deletions: deletions,
                    fileData: fileData,
                };

                filesDataArray.push(fileData);
                filesArray.push(fileObject);
            }

            console.log(filesDataArray);

            if (hasPrivateKey) {
                // const label = context.issue({ labels: [FOUND_LABEL] });
            } else {
                const label = context.issue({ labels: [NOT_FOUND_LABEL] });
                const msg = context.issue({
                    body: `${format(filesArray)}`,
                });

                await context.octokit.issues.createComment(msg);
            }
        },
    );
};
