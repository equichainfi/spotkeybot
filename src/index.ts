import { Probot } from "probot";

export = (app: Probot) => {
    app.on("pull_request.opened", async (context) => {
        const prComment = context.issue({
            body: "PRIVATE KEY SPOTTED!",
        });
        await context.octokit.issues.createComment(prComment);
    });
};
