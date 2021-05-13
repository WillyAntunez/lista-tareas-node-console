const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const {
	inquirerMenu,
	pausa,
	leerInput,
	listadoTareasBorrar,
	confirmar,
	mostrarListadoChecklist,
} = require('./helpers/inquirer');
const Tareas = require('./models/tareas');

require('colors');

console.clear();

const main = async () => {
	const mensajeEspaciado = (mensaje) => {
		console.log('\n');
		console.log(mensaje);
		console.log('\n');
	};

	let opt = '';
	const tareas = new Tareas();

	let tareasDB = [];

	console.log('================'.green);
	console.log('   Bienvenido'.white);
	console.log('================'.green);
	console.log();

	try {
		tareasDB = leerDB();
		console.log(tareasDB);
		mensajeEspaciado('Tareas cargadas correctamente'.green);
	} catch (error) {
		mensajeEspaciado('Hay un error con el archivo data.json existente.'.red);
		const ok = await confirmar(
			'¿Deseas resetear tu lista de tareas para que funcione?'
		);
		if (ok) {
			guardarDB([]);
			tareasDB = leerDB();
			mensajeEspaciado('Lista de tareas reseteada correctamente'.green);
		} else {
			mensajeEspaciado(
				'Ni modo, revisa que le hiciste a tu archivo data.json o vuelve para reiniciar la data.'
					.red
			);
			mensajeEspaciado('Hasta luego'.green);
			return;
		}
	}

	if (tareasDB) {
		tareas.cargarTareasFromArray(tareasDB);
	}

	await pausa();

	do {
		//imprime el menu
		opt = await inquirerMenu();

		switch (opt) {
			case '1':
				//crear
				const desc = await leerInput('Descripción: ');
				tareas.crearTarea(desc);
				break;
			case '2':
				tareas.listadoCompleto();
				break;
			case '3':
				tareas.ListadoPendientesCompletadas(true);
				break;
			case '4':
				tareas.ListadoPendientesCompletadas(false);
				break;

			case '5':
				if (tareas.listadoArr.length > 0) {
					const ids = await mostrarListadoChecklist(tareas.listadoArr);
					tareas.toggleCompletadas(ids);
				} else {
					mensajeEspaciado('No hay ninguna tarea todavia'.red);
				}
				break;

			case '6':
				const id = await listadoTareasBorrar(tareas.listadoArr);
				if (id !== '0') {
					const ok = await confirmar('¿Está seguro?');
					if (ok) {
						tareas.borrarTarea(id);
						mensajeEspaciado('Tarea borrada'.red);
					}
				}
				break;
		}

		guardarDB(tareas.listadoArr);

		await pausa();
	} while (opt !== '0');

	mensajeEspaciado('Hasta luego'.green);
};

main();
