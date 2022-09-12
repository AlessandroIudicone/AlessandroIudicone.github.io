# Scrollable 3D Animation with Three.js

- Watch the [full tutorial](https://youtu.be/Q7AOvWpIVHU) on YouTube
- [Scrollable Three.js Animation](https://fireship.io/snippets/threejs-scrollbar-animation) Snippet

## Usage

Install dependencies

```bash
npm ci
```

Run the application in development environment

```bash
npm run dev
```

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

Remove the old image of the application if present;

```bash
docker image rm <imageID>
```

## To deploy on `AlessandroIudicone.github.io` repository

You need to have the `AlessandroIudicone.github.io` folder prelably cloned in the same path of the `3d-aless` folder

Install the dependencies

```bash
npm ci
```

Build the output files

```bash
RUN npm run build
```

Copy the entire content of the `dist` folder to the `AlessandroIudicone.github.io` project folder

```bash
cp -a dist/. ../AlessandroIudicone.github.io/
```
