# Web for INACOVID

This folder is the repo for the INACOVID web interface on https://erlange.github.io/INACOVID
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.2.3.

## Installation
From this directory run:
```
npm i
```
Wait until the packages are fully downloaded, then run:
```
npm start
```
## Development server

Navigate to `http://localhost:4211/`. The port can be configured in the [package.json](https://github.com/erlange/INACOVID/blob/master/web/package.json#L6) file. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
```
ng build --prod --base-href /INACOVID/ --aot
```

Make sure the `--base-href` corresponds to the `baseHref` property in the [environments.prod.ts](https://github.com/erlange/INACOVID/blob/master/web/src/environments/environment.prod.ts#L3) file

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
