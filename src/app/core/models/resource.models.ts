export type ResourceKind = 'people' | 'planets' | 'films' | 'starships';

export interface ResourceRecord {
    id: number | string;
    name?: string;
    title?: string;
    [key: string]: unknown;
}
export interface ApiPage<T> { content?: T[]; data?: T[]; results?: T[]; totalElements?: number; total?: number; }
export type ApiPayload<T> = T[] | ApiPage<T>;

export interface ResourceConfig { kind: ResourceKind; label: string; singular: string; icon: string; accent: string; fields: string[]; }
