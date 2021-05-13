const Tarea = require('./tarea');
const colors = require('colors');

class Tareas {
	_listado = {};

	constructor() {
		this._listado = {};
	}

	borrarTarea(id = '') {
		if (this._listado[id]) {
			delete this._listado[id];
		}
	}

	cargarTareasFromArray(tareas = []) {
		tareas.forEach((tarea) => (this._listado[tarea.id] = tarea));
	}

	get listadoArr() {
		const listado = [];

		Object.keys(this._listado).forEach((key) => {
			listado.push(this._listado[key]);
		});

		return listado;
	}

	crearTarea(desc = '') {
		const tarea = new Tarea(desc);
		this._listado[tarea.id] = tarea;
	}

	listadoCompleto() {
		console.log();

		const arrayDeTareas = this.listadoArr;

		if (arrayDeTareas.length === 0) {
			console.log('No hay ninguna tarea.'.red);
			console.log();
			return;
		}

		arrayDeTareas.forEach((tarea, indice) => {
			let numeracion = colors.green(indice + 1 + '.');
			let descripcion = tarea.desc;
			let estaCompletado = tarea.completadoEn
				? 'Completado'.green
				: 'pendiente'.red;
			console.log(`${numeracion} ${descripcion} :: ${estaCompletado}`);
		});

		console.log();
	}

	ListadoPendientesCompletadas(completadas = true) {
		console.log();

		const tareasFiltradas = this.listadoArr.filter((tarea) => {
			if (completadas && tarea.completadoEn) {
				return true;
			} else if (!completadas && !tarea.completadoEn) {
				return true;
			}
		});

		if (tareasFiltradas.length === 0) {
			const mensaje = completadas ? 'completada' : 'pendiente';
			console.log(`No hay ninguna tarea ${mensaje}`.red);
			console.log();
			return;
		}

		tareasFiltradas.forEach((tarea, indice) => {
			let salida = '';
			let numeracion = colors.green(indice + 1 + '.');
			let descripcion = tarea.desc;
			salida += `${numeracion} ${descripcion}`;
			if (completadas) {
				let fecha = ' :: ' + colors.green(tarea.completadoEn);
				salida += fecha;
			}
			console.log(salida);
		});

		console.log();
	}

	toggleCompletadas(ids = []) {
		ids.forEach((id) => {
			const tarea = this._listado[id];
			if (!tarea.completadoEn) {
				tarea.completadoEn = new Date().toISOString();
			}
		});

		this.listadoArr.forEach((tarea) => {
			if (!ids.includes(tarea.id)) {
				this._listado[tarea.id].completadoEn = null;
			}
		});
	}
}

module.exports = Tareas;
