import { GroupProps } from "./group";
import { ProfessorProps } from "./professor";
import { SubjectProps } from "./subject";

export interface LessonProps {
	id: number;
	group: number;
	group_details: GroupProps;
	professor: number;
	professor_details: ProfessorProps;
	subject: number;
	subject_details: SubjectProps;
	time: number;
	day: number;
	created_at: string;
}

export type LessonPostProps = Omit<
	LessonProps,
	"id" | "professor_details" | "subject_details" | "created_at" | "group_details"
>;
