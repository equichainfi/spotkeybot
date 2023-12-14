import { Probot } from "probot";

export = (app: Probot) => {
    app.on("pull_request.opened", async (context) => {
        // const files = await context.octokit.pulls.listFiles({
        //     owner: context.payload.repository.owner.login,
        //     repo: context.payload.repository.name,
        //     pull_number: context.payload.pull_request.number,
        // });

        // // if (checkForPK(files.data)) {
        // //     await context.octokit.issues.createComment({
        // //         owner: context.payload.repository.owner.login,
        // //         repo: context.payload.repository.name,
        // //         issue_number: context.payload.pull_request.number,
        // //         body: "⚠️ This pull request contains a file with a potential private key. Please review and remove it.",
        // //     });
        // // }
        // await context.octokit.issues.createComment({
        //     owner: context.payload.repository.owner.login,
        //     repo: context.payload.repository.name,
        //     issue_number: context.payload.pull_request.number,
        //     body: files.data[0].filename,
        // });
        return context.octokit.pulls.createReview({
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            pull_number: context.payload.pull_request.number,
            body: "⚠️ This pull request contains a file with a potential private key. Please review and remove it.",
            event: "COMMENT",
        });
    });

    app.on("issues.opened", async (context) => {
        const params = context.issue({ body: "Hello World!" });

        return context.octokit.issues.createComment(params);
    });

    app.on("pull_request.reopened", async (context) => {
        return context.octokit.pulls.createReview({
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            pull_number: context.payload.pull_request.number,
            body: "⚠️ This pull request contains a file with a potential private key. Please review and remove it.",
            event: "APPROVE",
        });
        context.octokit.pulls.createReviewComment({
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            pull_number: context.payload.pull_request.number,
            body: "⚠️ This pull request contains a file with a potential private key. Please review and remove it.",
        });
    });
};

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
