export enum Endpoint {
  LOGIN = "/auth/login",
  LOGOUT = "/auth/logout",
  ACTIVO_FIJO = "/activo",
  ACTIVOS_FIJOS = "/activo/activos-fijos",
  ACTIVOS_FIJOS_BY_CODIGO = "/activo/activos",
  ACTIVOS_REGISTRADOS = "/activo/registrados",
  ACTIVOS_FALTANTES = "/activo/faltantes",
  USERS = "/users",
  REGISTER_ACTIVO = "/activo/register",
  REGISTER_MANY_ACTIVO = "/activo/register-many",
}

export enum SocketEvent {
  REGISTER = "activo@register",
  REGISTER_MANY_ACTIVO = "activo@register-many",
}
