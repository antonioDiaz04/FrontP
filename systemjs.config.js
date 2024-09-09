System.config({
    // Otras configuraciones...
    map: {
      // Otros mapeos...
      'google-maps-angular2': 'npm:google-maps-angular2/dist', // Coma añadida aquí
      // Otros mapeos...
    },
    packages: {
      // Otros paquetes...
      rxjs: {
        main: 'Rx.js',
        defaultExtension: 'js'
      },
      'google-maps-angular2': {
        defaultExtension: 'js',
        main: 'index.js',
        format: 'cjs'
      }, // Coma añadida aquí
      // Otros paquetes...
    }
  });
  