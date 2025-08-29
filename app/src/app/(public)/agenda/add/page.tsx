"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AgendaItemPostProps } from "@/types/agenda";
import { SubjectProps } from "@/types/subject";
import { AGENDA_BASE_URL, SUBJECT_BASE_URL } from "@/config";

export default function AddAgendaItem() {
	const router = useRouter();
	const [agendaItem, setAgendaItem] = useState<AgendaItemPostProps>({
		title: "",
		description: "",
		date: "",
		time: "",
		subject: undefined,
	});
	const [subjects, setSubjects] = useState<SubjectProps[]>([]);
	const [posting, setPosting] = useState(false);

	useEffect(() => {
		axios.get(SUBJECT_BASE_URL).then((response) => {
			setSubjects(response.data);
		});
	}, []);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setAgendaItem((prevAgendaItem) => ({
			...prevAgendaItem,
			[name]: name === 'subject' ? Number(value) : value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setPosting(true);
		try {
			await axios.post(AGENDA_BASE_URL, agendaItem);
			alert("Item da agenda cadastrado com sucesso!");
			router.push("/agenda");
		} catch (error: any) {
			alert(`Erro ao cadastrar item da agenda: ${error.message}`);
		} finally {
			setPosting(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center m-20">
			<h1 className="title">Adicionar Item na Agenda</h1>
			<div className="form-container ">
				<form
					onSubmit={handleSubmit}
					className="form flex-col p-6 border border-[var(--divide)] rounded max-w-sm"
				>
					<div className="mb-4">
						<label htmlFor="title" className="block mb-2 font-bold">
							Título
						</label>
						<input
							type="text"
							id="title"
							name="title"
							value={agendaItem.title}
							onChange={handleChange}
							className="form input"
							required
						/>
					</div>
					<div className="mb-4">
						<label
							htmlFor="description"
							className="block mb-2 font-bold"
						>
							Descrição
						</label>
						<textarea
							id="description"
							name="description"
							value={agendaItem.description}
							onChange={handleChange}
							className="form textarea"
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="date" className="block mb-2 font-bold">
							Data
						</label>
						<input
							type="date"
							id="date"
							name="date"
							value={agendaItem.date}
							onChange={handleChange}
							className="form input"
							required
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="time" className="block mb-2 font-bold">
							Hora
						</label>
						<input
							type="time"
							id="time"
							name="time"
							value={agendaItem.time}
							onChange={handleChange}
							className="form input"
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="subject" className="block mb-2 font-bold">
							Matéria
						</label>
						<select
							id="subject"
							name="subject"
							value={agendaItem.subject}
							onChange={handleChange}
							className="form select"
						>
							<option value="">Selecione a matéria</option>
							{subjects.map((subject) => (
								<option key={subject.id} value={subject.id}>
									{subject.full_name}
								</option>
							))}
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