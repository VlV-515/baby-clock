export enum DormirTipo {
  siesta = 'DormirSiesta',
  noche = 'DormirNoche',
  siestaEnCurso = 'DormirSiestaEnCurso',
  nocheEnCurso = 'DormirNocheEnCurso',
}
export enum DormirTipoAlerta {
  bien = 'bien',
  alerta = 'alerta',
  peligro = 'peligro',
}
export interface DormirModel {
  inicio: DormirDetalleModel;
  final?: DormirDetalleModel;
}
export interface DormirDetalleModel {
  hora: string;
  detalle?: string;
}
export interface DormirAlertaModel {
  header: string;
  mensaje: string;
  tipo: DormirTipoAlerta;
  diferencia: string;
}
