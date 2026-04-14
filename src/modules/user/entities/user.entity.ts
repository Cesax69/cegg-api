export class User {
    id: number;
    email: string;
    name: string | null;
    lastname: string | null;
    username: string | null;
    hash: string | null;
    password: string | null;
    createdAt: Date;
    rol_id: number | null;
}
