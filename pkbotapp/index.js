/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = app => {
	app.log.info("Yay, the app was loaded!");

	app.on("issues.opened", async context => {
		const openTime = new Date();
		const issueComment = context.issue({
			body: `Thanks for opening this issue! It was opened at ${openTime.toTimeString()}`,
		});
		return context.octokit.issues.createComment(issueComment);
	});

	app.on(["pull_request.opened", "pull_request.reopened"], async context => {
		return context.octokit.pulls.checkIfMerged({
			owner: context.payload.repository.owner.login,
			repo: context.payload.repository.name,
			pull_number: context.payload.pull_request.number,
		});
	});
	app.on(["pull_request.opened", "pull_request.reopened"], async context => {
		const openTime = new Date();
		const prComment = context.issue({
			body: `Thanks for opening this PR! It was opened at ${openTime.toTimeString()}`,
		});
		return context.octokit.issues.createComment(prComment);
	});

	app.on(["issue_comment.created", "issue_comment.edited"], async context => {
		if (context.payload.comment.user.type === "Bot") return;

		if (
			context.payload.issue.author_association === "OWNER" ||
			context.payload.issue.author_association === "COLLABORATOR"
		) {
			commands(app, "label", (context, command) => {
				const labels = command.arguments.split(/, */);
				return context.github.issues.addLabels(
					context.issue({ labels })
				);
			});
		}
	});
};
