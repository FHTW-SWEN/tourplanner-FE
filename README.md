# Tour Planner Frontend

Angular frontend for the Tour Planner project.

## Getting Started

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm start
```

Open the app in your browser:

```text
http://localhost:4200/
```

## Configuration

The backend API URL is configured in:

```text
src/environments/environment.development.ts
```

Default URL:

```text
http://localhost:8080/api
```

If your backend runs on a different port, update the `apiBaseUrl` value.

## Build

```bash
npm run build
```

## Note

Do not commit `node_modules/`. Install it again with `npm ci`.
