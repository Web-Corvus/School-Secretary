"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
	LESSON_BASE_URL,
	GROUP_BASE_URL,
	SUBJECT_BASE_URL,
	PROFESSOR_BASE_URL,
} from "@/config";
import { GroupProps } from "@/types/group";
import { SubjectProps } from "@/types/subject";
import { ProfessorProps } from "@/types/professor";
import { LessonPostProps } from "@/types/lesson";

export default function AddLesson() {
	const router = useRouter();
	const [groups, setGroups] = useState<GroupProps[]>([]);
	const [subjects, setSubjects] = useState<SubjectProps[]>([]);
	const [professors, setProfessors] = useState<ProfessorProps[]>([]);
	const [lesson, setLesson] = useState<LessonPostProps>({
		group: 0,
		subject: 0,
		professor: 0,
		day: 0,
		time: 0,
	});
	const [posting, setPosting] = useState(false);

	useEffect(() => {
		axios.get(GROUP_BASE_URL).then((res) => setGroups(res.data));
		axios.get(SUBJECT_BASE_URL).then((res) => setSubjects(res.data));
		axios.get(PROFESSOR_BASE_URL).then((res) => setProfessors(res.data));
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;
		setLesson((prev) => ({
			...prev,
			[name]: Number(value),
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setPosting(true);
		try {
			await axios.post(LESSON_BASE_URL, lesson);
			alert("Aula cadastrada com sucesso!");
			router.push("/lessons");
		} catch (error: any) {
			alert(`Erro ao cadastrar aula: ${error.message}`);
		} finally {
			setPosting(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center m-20">
			<h1 className="title">Adicionar Aula</h1>
			<div className="form-container">
				<form
					onSubmit={handleSubmit}
					className="form flex-col p-6 border border-[var(--divide)] rounded max-w-sm"
				>
					<div className="mb-4">
						<label htmlFor="group" className="block mb-2 font-bold">
							Turma
						</label>
						<select
							id="group"
							name="group"
							value={lesson.group}
							onChange={handleChange}
							className="form select"
							required
						>
							<option value="">Selecione a turma</option>
							{groups.map((group) => (
								<option key={group.id} value={group.id}>
									{group.full_name}
								</option>
							))}
						</select>
					</div>
					<div className="mb-4">
						<label
							htmlFor="subject"
							className="block mb-2 font-bold"
						>
							Matéria
						</label>
						<select
							id="subject"
							name="subject"
							value={lesson.subject}
							onChange={handleChange}
							className="form select"
							required
						>
							<option value="">Selecione a matéria</option>
							{subjects.map((subject) => (
								<option key={subject.id} value={subject.id}>
									{subject.full_name}
								</option>
							))}
						</select>
					</div>
					<div className="mb-4">
						<label
							htmlFor="professor"
							className="block mb-2 font-bold"
						>
							Professor
						</label>
						<select
							id="professor"
							name="professor"
							value={lesson.professor}
							onChange={handleChange}
							className="form select"
							required
						>
							<option value="">Selecione o professor</option>
							{professors.map((professor) => (
								<option key={professor.id} value={professor.id}>
									{professor.full_name}
								</option>
							))}
						</select>
					</div>
					<div className="mb-4">
						<label htmlFor="day" className="block mb-2 font-bold">
							Dia da Semana
						</label>
						<select
							id="day"
							name="day"
							value={lesson.day}
							onChange={handleChange}
							className="form select"
							required
						>
							<option value="">Selecione o dia</option>
							<option value="0">Domingo</option>
							<option value="1">Segunda-feira</option>
							<option value="2">Terça-feira</option>
							<option value="3">Quarta-feira</option>
							<option value="4">Quinta-feira</option>
							<option value="5">Sexta-feira</option>
							<option value="6">Sábado</option>
						</select>
					</div>
					<div className="mb-4">
						<label htmlFor="time" className="block mb-2 font-bold">
							Horário
						</label>
						<select
							id="time"
							name="time"
							value={lesson.time}
							onChange={handleChange}
							className="form select"
							required
						>
							<option value="">Selecione o horário</option>
							<option value="0">1º Horário</option>
							<option value="1">2º Horário</option>
							<option value="2">3º Horário</option>
							<option value="3">4º Horário</option>
							<option value="4">5º Horário</option>
							<option value="5">6º Horário</option>
						</select>
					</div>
					<button
						type="submit"
						className="btn w-full"
						disabled={posting}
					>
						{posting ? "Salvando..." : "Salvar"}
					</button>
				</form>
			</div>
		</div>
	);
}