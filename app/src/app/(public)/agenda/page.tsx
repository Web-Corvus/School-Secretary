"use client";

import axios from "axios";

import Link from "next/link";
import React, { useState, useEffect } from "react";

import SearchField from "@/components/SearchField";

import { AgendaItemProps } from "@/types/agenda";
import { AGENDA_BASE_URL } from "@/config";

export default function AgendaPage() {
	const [update, setUpdate] = useState(false);
	const [data, setData] = useState<AgendaItemProps[]>([]);

	useEffect(() => {
		axios
			.get<AgendaItemProps[]>(`${AGENDA_BASE_URL}`)
			.then((response) => setData(response.data))
			.catch((error) => {
				alert(`Erro ao carregar itens da agenda: ${error}`);
			});

		setUpdate(false);
	}, [update]);

	const handleDelete = (value: number) => {
		axios.delete(`${AGENDA_BASE_URL}${value}/`);
		setUpdate(true);
	};

	return (
		<div>
			<div className="flex justify-center">
				<div className="title-container">
					<h1 className="title">Agenda</h1>
				</div>
			</div>
			<div className="flex justify-center m-3">
				<Link className="btn w-50 text-center" href="/agenda/add">
					Adicionar
				</Link>
			</div>
			<div className="flex justify-center items-center">
				<div className="table-container">
					<table className="m-3 table table-border">
						<thead>
							<tr>
								<th>Título</th>
								<th>Descrição</th>
								<th>Data</th>
								<th>Hora</th>
								<th>Matéria</th>
								<th>Remover</th>
							</tr>
						</thead>
						<tbody>
							{data.map((item) => (
								<tr key={item.id}>
									<td>{item.title}</td>
									<td>{item.description}</td>
									<td>{item.date}</td>
									<td>{item.time}</td>
									<td>{item.subject_details?.full_name}</td>
									<td>
										<button
											className="link-blue"
											onClick={() =>
												handleDelete(item.id)
											}
										>
											Remover
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
