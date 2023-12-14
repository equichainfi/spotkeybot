import { Probot } from "probot";

export = (app: Probot) => {
    app.log.info("Yay, the app was loaded!");

    app.on("pull_request.opened", async (context) => {
        try {
            console.log("Pull request opened event triggered");

            // Uncomment the following lines if you want to list files and check for private keys
            // const files = await context.octokit.pulls.listFiles({
            //     owner: context.payload.repository.owner.login,
            //     repo: context.payload.repository.name,
            //     pull_number: context.payload.pull_request.number,
            // });

            // // Uncomment the following lines if you want to check for private keys in the files
            // if (checkForPK(files.data)) {
            //     await context.octokit.issues.createComment({
            //         owner: context.payload.repository.owner.login,
            //         repo: context.payload.repository.name,
            //         issue_number: context.payload.pull_request.number,
            //         body: "⚠️ This pull request contains a file with a potential private key. Please review and remove it.",
            //     });
            // }

            // Uncomment the following line if you want to comment with the filename
            // await context.octokit.issues.createComment({
            //     owner: context.payload.repository.owner.login,
            //     repo: context.payload.repository.name,
            //     issue_number: context.payload.pull_request.number,
            //     body: files.data[0].filename,
            // });

            // Commenting with a review
            await context.octokit.pulls.createReview({
                owner: context.payload.repository.owner.login,
                repo: context.payload.repository.name,
                pull_number: context.payload.pull_request.number,
                body: "⚠️ This pull request contains a file with a potential private key. Please review and remove it.",
                event: "COMMENT",
            });
        } catch (error) {
            console.error("Error in pull_request.opened event:", error);
        }
    });

    app.on("issues.opened", async (context) => {
        try {
            console.log("Issues opened event triggered");

            const params = context.issue({ body: "Hello World!" });

            await context.octokit.issues.createComment(params);
        } catch (error) {
            console.error("Error in issues.opened event:", error);
        }
    });

    app.on("pull_request.reopened", async (context) => {
        try {
            console.log("Pull request reopened event triggered");

            await context.octokit.pulls.createReviewComment({
                owner: context.payload.repository.owner.login,
                repo: context.payload.repository.name,
                pull_number: context.payload.pull_request.number,
                body: "This pull request has been reopened. Check for private keys is not going to be performed again.",
            });
        } catch (error) {
            console.error("Error in pull_request.reopened event:", error);
        }
    });
};

// Function to check for private keys in files
// function checkForPK(files) {
//     const keyPattern1: RegExp =
//         /-----BEGIN (RSA|OPENSSH|DSA|EC|PGP) PRIVATE KEY-----/;
//     const keyPattern2: RegExp = /0x/;

//     return files.some((file) => {
//         return (
//             keyPattern1.test(file.contents) ||
//             file.filename.includes(".pem") ||
//             file.filename.includes(".key") ||
//             file.filename.includes(".pk") ||
//             file.filename.includes(".p12") ||
//             file.filename.includes(".pfx") ||
//             file.filename.includes(".asc") ||
//             keyPattern2.test(file.contents)
//         );
//     });
// }
