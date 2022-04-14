# [maltesphotography.de](https://maltesphotography.de/)

This is the source code for [maltesphotography.de](https://maltesphotography.de/) written in Next.js using PostgreSQL and Tailwind.

## Deployment

### Installing dependencies

```bash
yarn install
```

### Filling .env

Create a `.env` file in the root of the project by copying/renaming the `.env.example`.

`DATABSE_URL`

If your database user can create multiple databases, you only need this, otherwise `SHADOW_DATABASE_URL` is needed

`SHADOW_DATABASE_URL`

Another database URL. [More information why this is needed in cloud-environments](https://www.prisma.io/docs/concepts/components/prisma-migrate/shadow-database#cloud-hosted-shadow-databases-must-be-created-manually)

Make sure to also add the following to the data source in `prisma/schema.prisma`

```
datasource db {
  provider          = "postgresql"
  url               = env("DATABASE_URL")
  -> shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
}
```

`NEXTAUTH_URL`

This is the root of your application for example `https://maltesphotography.de`.

[More information](https://next-auth.js.org/configuration/options#nextauth_url)

`NEXTAUTH_SECRET`

Used to encrypt the NextAuth.js JWT and to hash email verification tokens.

[More information](https://next-auth.js.org/configuration/options#nextauth_secret)

`GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`

Github OAuth Credentials used to log into the admin interface at `/admin`

[Creating an OAuth App](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app)

Note: Set the callback url to `https://<NEXTAUTH_URL>/api/auth/callback`!

`GITHUB_ALLOWED_USER_IDS`

A comma-separated list of github user ids that can login via OAuth (Admin)

You can find yours here: https://api.github.com/users/your-github-username. It will also be printed on failed login attempts.

### Setup the Database

```bash
npx prisma migrate deploy
```

### Build the application

```bash
npm run build
```

### Start the server

```bash
npm run start
```

This starts the application on port 3000. This can be modified by using `yarn start --port <PORT>`

You need to proxy all requests to this url in your web-server / proxy.
