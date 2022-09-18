export enum DormirTipo {
  siesta = 'DormirSiesta',
  noche = 'DormirNoche',
  siestaEnCurso = 'DormirSiestaEnCurso',
  nocheEnCurso = 'DormirNocheEnCurso',
}
export interface DormirModel {
  inicio: DormirDetalleModel;
  final?: DormirDetalleModel;
}
export interface DormirDetalleModel {
  hora: string;
  detalle?: string;
}
