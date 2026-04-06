/* eslint-disable @typescript-eslint/naming-convention */
export interface AlmacenamientoLecheModel {
  tipo: 'ambiente' | 'refrigerador' | 'congelador';
  temperatura: string;
  duracionHoras: number;
  descripcion: string;
  status: 'disponible' | 'expirado' | 'usado' | 'eliminado';
}

export const TIPO_ALMACENAMIENTO_LECHE = {
  AMBIENTE: 'ambiente',
  REFRIGERADOR: 'refrigerador',
  CONGELADOR: 'congelador',
};
export type TipoAlmacenamientoLeche =
  (typeof TIPO_ALMACENAMIENTO_LECHE)[keyof typeof TIPO_ALMACENAMIENTO_LECHE];

export const statusBancoLeche = {
  DISPONIBLE: 'disponible',
  EXPIRADO: 'expirado',
  USADO: 'usado',
  ELIMINADO: 'eliminado',
};
export type StatusBancoLeche =
  (typeof statusBancoLeche)[keyof typeof statusBancoLeche];

export interface BancoLecheRegistro {
  id: string;
  folio: string;
  tipo: TipoAlmacenamientoLeche;
  status?: StatusBancoLeche;
  horaRegistro: string;
  fechaRegistro: string;
  fechaVencimiento: string;
  horaVencimiento: string;
  duracionHoras: number;
  descripcion: string;
}

export const ALMACENAMIENTO_LECHE: AlmacenamientoLecheModel[] = [
  {
    tipo: 'ambiente',
    temperatura: '≤ 25°C',
    duracionHoras: 4,
    descripcion: 'Leche a temperatura ambiente',
    status: 'disponible',
  },
  {
    tipo: 'refrigerador',
    temperatura: '≤ 4°C',
    duracionHoras: 96, // 4 días
    descripcion: 'Leche en refrigerador',
    status: 'disponible',
  },
  {
    tipo: 'congelador',
    temperatura: '−18°C',
    duracionHoras: 4320, // 6 meses
    descripcion: 'Leche en congelador',
    status: 'disponible',
  },
];
