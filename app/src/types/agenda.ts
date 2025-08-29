import { SubjectProps } from "./subject";

export interface AgendaItemProps {
	id: number;
	title: string;
	subject?: number;
	subject_details?: SubjectProps;
	description?: string;
	date: string;
	time?: string;
	created_at: string;
	updated_at: string;
}

export type AgendaItemPostProps = Omit<
	AgendaItemProps,
	"id" | "created_at" | "updated_at" | "subject_details"
>;
