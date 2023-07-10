export enum Endpoint {
    LOGIN = "auth/login",
    LOGOUT = "auth/logout",
    ACTIVOS_FIJOS = '/activos-fijos',
    ACTIVOS_REGISTRADOS = '/activos-registrados',
    USERS = '/users',
    REGISTER_ACTIVO = '/activo/register',
    REGISTER_MANY_ACTIVO = '/activo/register-many'
}

export enum SocketEvent {
    REGISTER = 'activo@register',
    REGISTER_MANY_ACTIVO = 'activo@register-many'
}