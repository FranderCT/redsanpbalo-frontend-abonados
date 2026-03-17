export const Role = {
    ADMIN: 'ADMIN',
    GUEST: 'INVITADO',
    BOD: 'JUNTA',
    SUB: 'ABONADO',
    ASSOS: 'ASOCIADO',
    PLMBR: 'FONTANERO',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export interface Roles {
    Id: number,
    Rolname: Role
}
