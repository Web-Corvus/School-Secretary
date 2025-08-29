"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { AgendaItemProps } from "@/types/agenda";
import { EventProps } from "@/types/event";
import { AGENDA_PENDENTS_URL, EVENT_PENDENTS_URL } from "@/config";

export default function Home() {
	const [agenda, setAgenda] = useState<AgendaItemProps[]>([]);
	const [events, setEvents] = useState<EventProps[]>([]);

	useEffect(() => {
		async function getAgenda() {
			try {
				const agendaResponse = await axios.get(AGENDA_PENDENTS_URL);
				if (!agendaResponse) {
					throw new Error("Agenda unavaible.");
				}
				setAgenda(agendaResponse.data);
			} catch (error) {
				console.error("Error fetching agenda items on client:", error);
			}
		}

		async function getEvents() {
			try {
				const eventResponse = await axios.get(EVENT_PENDENTS_URL);
				if (!eventResponse) {
					throw new Error("Events unavaible.");
				}
				setEvents(eventResponse.data);
			} catch (error) {
				console.error("Error fetching events on client:", error);
			}
		}

		getAgenda();
		getEvents();
	}, []);

	return (
		<div className="flex flex-col flex-grow p-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">
					Bem-vindo ao School Secretary
				</h1>
				<p className="text-[var(--smooth)]">
					Sua plataforma completa para gestão escolar.
				</p>
			</div>

			<div className="mb-8">
				<h2 className="text-2xl font-semibold">
					Últimas Atualizações da Agenda
				</h2>
				<div className="p-6 rounded-lg shadow-lg">
					{agenda.length > 0 ? (
						<ul className="list-none pl-5">
							{agenda.map((item) => (
								<li
									key={item.id}
									className="flex flex-col mb-8"
								>
									<span className="font-semibold">
										{item.subject_details && (
											<span>
												{
													item.subject_details
														.short_name
												}
												:
											</span>
										)}{" "}
										{item.title}
									</span>
									<span className="text-[var(--smooth)]">
										{item.date}
										{item.time && (
											<span> ás {item.time}</span>
										)}
									</span>
									<span>
										{item.description && (
											<p className="text-sm m-2">
												{item.description}
											</p>
										)}
									</span>
								</li>
							))}
						</ul>
					) : (
						<p className="text-[var(--smooth)]">
							Nenhuma atualização recente na agenda.
						</p>
					)}
				</div>
			</div>

			<div className="mb-8">
				<h2 className="text-2xl font-semibold">Últimos Eventos</h2>
				<div className="p-6 rounded-lg shadow-lg">
					{events.length > 0 ? (
						<ul className="list-none pl-5">
							{events.map((event) => (
								<li
									key={event.id}
									className="flex flex-col mb-8"
								>
									<span className="font-semibold">
										{event.title}
									</span>
									<span className="text-[var(--smooth)]">
										{event.start_date}
										{event.end_date && (
											<span> até {event.end_date}</span>
										)}
									</span>
									<span className="text-[var(--smooth)]">
										{event.start_time}
										{event.end_time && (
											<span> até {event.end_time}</span>
										)}
									</span>
									{event.location && (
										<p className="text-sm m-2">
											Localização: {event.location}
										</p>
									)}
									{event.description && (
										<p className="text-sm m-2">
											{event.description}
										</p>
									)}
								</li>
							))}
						</ul>
					) : (
						<p className="text-[var(--smooth)]">
							Nenhum evento recente.
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
