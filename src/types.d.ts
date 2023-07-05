export interface IActivo {
  responsable: string;
  tipo: string;
  piso: string;
  ubicacion: string;
  estado: string;
  codigo: string;
  condicion: string;
  rubro: string;
}

export interface IUsuario {
  id: number;
  nombre: string;
  color: string;
}

export interface IActivoRegistrado {
  activoFijo: IActivo,
  usuario: IUsuario,
  piso: string
}