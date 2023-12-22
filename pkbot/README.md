# eqcbot

> A GitHub App built with [Probot](https://github.com/probot/probot) that Equichain Private Key Bot

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t eqcbot .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> eqcbot
```

## Contributing

If you have suggestions for how eqcbot could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2023 Olivier Kobialka
