// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces



declare global {
	declare namespace App {
	interface Locals {
		user?: {
		id: string;
		name?: string;
		email?: string;
		} | null;
	}
}
}


export {};
