# Alessandro Iudicone's website

Personal website with a scrollable 3D animation made with [Three.js](https://threejs.org/) and [Vite](https://vite.dev/), published with GitHub Pages at <https://alessandroiudicone.com>.

Based on Fireship's tutorial:

- Watch the [full tutorial](https://youtu.be/Q7AOvWpIVHU) on YouTube
- [Scrollable Three.js Animation](https://fireship.io/snippets/threejs-scrollbar-animation) Snippet

## Project structure

```text
src/                   site source (Vite root)
├── index.html
├── main.js            browser wiring: renderer, textures, scroll, animation loop
├── scene.js           3D scene and animations (no DOM/WebGL: unit-testable)
├── scene.test.js      unit tests (Vitest)
├── style.css
├── assets/            images and textures
└── public/CNAME       copied as-is into the build output
tests/e2e/             end-to-end smoke tests (Playwright) on the production build
.github/workflows/     CI/CD pipeline
.github/dependabot.yml automatic dependency updates
```

## Usage

Requires Node.js 24 (the version is in `.nvmrc`: with nvm just run `nvm use`).

```bash
npm ci              # install dependencies
npm run dev         # development server with hot reload
npm run lint        # ESLint
npm test            # unit tests (npm run test:watch to re-run them on every change)
npm run build       # production build in dist/
npm run preview     # serve dist/ on http://localhost:4173
```

The end-to-end tests open the production build in a headless Chromium:

```bash
npx playwright install --with-deps chromium   # first time only
npm run build
npm run test:e2e
```

## CI/CD and deployment

The pipeline is [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml):

| Event                         | What happens                                                         |
| ----------------------------- | -------------------------------------------------------------------- |
| Pull request                  | `npm ci` → lint → unit tests → build → end-to-end tests              |
| Push to `main` or manual run  | the same checks, then `dist/` is deployed to GitHub Pages            |

**To publish a change, push it to `main`** (or merge a pull request). No build output is committed: the workflow uploads `dist/` as a Pages artifact and `actions/deploy-pages` publishes it. If any check fails, nothing is deployed and the site stays as it is.

One-time repository settings:

- **Settings → Pages → Build and deployment → Source: GitHub Actions**.
- The custom domain `alessandroiudicone.com` is configured in **Settings → Pages → Custom domain**: when deploying with Actions, GitHub ignores the `CNAME` file (it is kept in `src/public/` for reference).

### Dependency updates

[Dependabot](.github/dependabot.yml) checks npm packages and GitHub Actions once a month and opens pull requests (minor and patch npm updates grouped in a single one). The pipeline tests every pull request: merge it when it's green and the site is redeployed with the new versions.

## :whale: **Run with Docker in local environment**

Stop the running container of the application and remove it from the current machine if present;

```bash
docker container stop <containerID>
docker container rm <containerID>
```

Build the docker image from the project root directory with

```bash
docker image build -t local-repo/3d-aless .
```

- the `-t local-repo/3d-aless` part of the command gives a name and the tag in the 'name:tag' format to the image;
- the `.` part of the command says that the Dockerfile for building the image is located in the current directory.

You can now start the container

```bash
docker container run --name 3d-aless_container -p 8080:80 -d local-repo/3d-aless
```

and go to `http://localhost:8080/` on a browser to see the rendered output.

Once finished, stop container

```bash
docker stop 3d-aless_container
```

and remove the image of the application

```bash
docker image rm -f local-repo/3d-aless
```
