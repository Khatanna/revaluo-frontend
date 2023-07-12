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
  activoFijo: IActivo;
  usuario: IUsuario;
  piso: string;
  imprimir: boolean;
}

export interface IActivosRegistradosResponse {
  prev: string;
  next: string;
  page: number;
  results: IActivoRegistrado[];
}

export interface IAuthResponse {
  token: string;
  user: IUsuario;
}

export interface IUserResponse {
  users: Pick<IUsuario, "id" | "nombre">[];
}

export interface IForm {
  [index: string]: string;
}

export interface IScanned extends IActivo {
  print: boolean;
}
