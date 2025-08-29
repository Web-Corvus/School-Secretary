"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { EventPostProps } from "@/types/event";
import { EVENT_BASE_URL } from "@/config";

export default function AddEvent() {
	const router = useRouter();
	const [event, setEvent] = useState<EventPostProps>({
		title: "",
		description: "",
		start_date: "",
		end_date: "",
		start_time: "",
		end_time: "",
		location: "",
	});
	const [posting, setPosting] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setEvent((prevEvent) => ({
			...prevEvent,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setPosting(true);
		try {
			await axios.post(EVENT_BASE_URL, event);
			alert("Evento cadastrado com sucesso!");
			router.push("/events");
		} catch (error: any) {
			alert(`Erro ao cadastrar evento: ${error.message}`);
		} finally {
			setPosting(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center m-20">
			<h1 className="title">Adicionar Evento</h1>
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
							value={event.title}
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
							value={event.description}
							onChange={handleChange}
							className="form textarea"
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="start_date" className="block mb-2 font-bold">
							Data de Início
						</label>
						<input
							type="date"
							id="start_date"
							name="start_date"
							value={event.start_date}
							onChange={handleChange}
							className="form input"
							required
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="end_date" className="block mb-2 font-bold">
							Data de Fim
						</label>
						<input
							type="date"
							id="end_date"
							name="end_date"
							value={event.end_date}
							onChange={handleChange}
							className="form input"
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="start_time" className="block mb-2 font-bold">
							Hora de Início
						</label>
						<input
							type="time"
							id="start_time"
							name="start_time"
							value={event.start_time}
							onChange={handleChange}
							className="form input"
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="end_time" className="block mb-2 font-bold">
							Hora de Fim
						</label>
						<input
							type="time"
							id="end_time"
							name="end_time"
							value={event.end_time}
							onChange={handleChange}
							className="form input"
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="location" className="block mb-2 font-bold">
							Local
						</label>
						<input
							type="text"
							id="location"
							name="location"
							value={event.location}
							onChange={handleChange}
							className="form input"
						/>
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