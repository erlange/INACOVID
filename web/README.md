# Web for INACOVID

This folder is the repo for the INACOVID web interface on https://erlange.github.io/INACOVID
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.2.3.

## Installation
Firstly you must have [Node.js](https://nodejs.org/en/) installed prior to running the commands below.

From this directory run:
```
npm i
```
Wait until the packages are fully downloaded, then run:
```
npm start
```
## Development server

After running `npm start` above, navigate to `http://localhost:4211/`. 

The port can be configured in the [package.json](https://github.com/erlange/INACOVID/blob/master/web/package.json#L6) file. The app will automatically reload if you modify any of the source files.

## Dummy Data

Dummy data are provided under `/assets/dummy` folder to facilitate working on development environment. This folder corresponds to the config in the [environment.ts](https://github.com/erlange/INACOVID/blob/master/web/src/environments/environment.ts)

## Build to Production

Run `npm run build-prod` to build into production. The build artifacts will be stored in the `dist/` directory.
```
npm run build-prod
```



## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
