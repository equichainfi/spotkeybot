/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */

const dotenv = require("dotenv");
dotenv.config();

module.exports = (app) => {
    app.log.info("pkbotapp loaded");

    app.on(
        ["pull_request.opened", "pull_request.reopened", "pull_request.edited"],
        async (context) => {},
    );
};
