export interface EventProps {
	id: number;
	title: string;
	description?: string;
	start_date: string;
	end_date?: string;
	start_time?: string;
	end_time?: string;
	location?: string;
	created_at: string;
	updated_at: string;
}

export type EventPostProps = Omit<
	EventProps,
	"id" | "created_at" | "updated_at"
>;
