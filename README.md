<h1 align="center">
  <br>
  Personal Website
  <br>
</h1>

<h4 align="center"></h4>

<p align="center">
</p>

<p align="center">
  <a href="#changelog">Changelog</a> •
  <a href="#usage">Usage</a> •
  <a href="#license">License</a> •
  <a href="#contributing">Contributing</a>
</p>

## Changelog

The full changelog can be found at [CHANGELOG.md](CHANGELOG.md)

## [1.0.0]

### Added

- Terminal style website
- Default commands including whoami, github, linkedin, email, clear, reset, help
- Commands can be customised using `config.json`, see [`config.example.json`](config.example.json)
- Custom commands defined in the same config
- Command completion with tab
- Command history with up/down arrow keys
- Deployable with Docker

## Usage

### Docker (Recommended)

1. Clone the repository
2. Copy `config.example.json` to `config.json` and configure as you desire. Fields beginning with `__comment` describe
   the related non-comment field.
3. Run the container with Docker Compose `docker compose up -d --build`.
4. The container will now be bound to `127.0.0.1:443` using a self-signed certificate generated on first start-up.
5. You can now place the container behind a reverse proxy such as Nginx.

<details>
  <summary>Bring your own cert</summary>

If you wish to use your own certificate instead of using a self-signed, that is possible.

The startup script [`nginx/5-ssl.sh`](nginx/5-ssl.sh) checks for the presence of both:

- `/etc/ssl/personal-website/personal-website.key`
- `/etc/ssl/personal-website/personal-website.crt`

Bind mount your cert and private key to these locations and Nginx will use your cert.

</details>

#### Environment Variables

| Name                | Description                                                                                                                                                                                                           |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NGINX_SERVER_NAME` | Used in the Nginx configuration template to respond to the correct server name. By default will respond to all requests. For more information view the [Nginx wiki](https://nginx.org/en/docs/http/server_names.html) |

### Build and deploy manually

1. Clone the repository
2. Copy `config.example.json` to `config.json` and configure as you desire. Fields beginning with `__comment` describe
   the related non-comment field.
3. Install dependencies, `npm install`
4. Deploy `dist/personal-website/browser` anywhere you wish.

## License

Licensed under either of

- Apache License, Version 2.0
  ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
- MIT license
  ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

at your option.

## Contributing

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in the work by you, as defined in the Apache-2.0 license, shall be
dual licensed as above, without any additional terms or conditions.

See [CONTRIBUTING.md](CONTRIBUTING.md).
