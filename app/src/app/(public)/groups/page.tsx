"use client";

import api from "@/services/api";

import Link from "next/link";
import React, { useState, useEffect } from "react";

import SearchField from "@/components/SearchField";

import { GroupProps } from "@/types/group";
import { GROUP_BASE_URL } from "@/config";

export default function GroupsPage() {
	const [search, setSearch] = useState("");
	const [update, setUpdate] = useState(false);
	const [data, setData] = useState<GroupProps[]>([]);

	useEffect(() => {

	       api
		       .get<GroupProps[]>(`${GROUP_BASE_URL}?search=${search}`)
		       .then((response) => setData(response.data))
		       .catch((error) => {
			       alert(`Erro ao carregar alunos: ${error}`);
		       });

		setUpdate(false);
	}, [update]);

	const handleSearch = (value: string) => {
		setSearch(value);
		setUpdate(true);
	};

	const handleDelete = (value: number) => {
		api.delete(`${GROUP_BASE_URL}${value}/`);
		setUpdate(true);
	};

	return (
		<div>
			<div className="flex justify-center">
				<div className="title-container">
					<h1 className="title">Turmas</h1>
				</div>
			</div>

			<div className="flex flex-row items-center justify-center">
				<SearchField
					placeholder="Buscar turma..."
					onSearch={handleSearch}
				/>
			</div>
			<div className="flex justify-center m-3">
				<Link className="btn w-50 text-center" href="/groups/add">
					Adicionar
				</Link>
			</div>
			<div className="flex justify-center items-center">
				<div className="table-container">
					<table className="m-3 table table-border">
						<thead>
							<tr>
								<th>Abreviação</th>
								<th>Nome completo</th>
								<th>Itinerário</th>
								<th>Remover</th>
							</tr>
						</thead>
						<tbody>
							{data.map((group) => (
								<tr key={group.id}>
									<td>{group.short_name}</td>
									<td>{group.full_name}</td>
									<td>
										{group.itinerary_details?.full_name ||
											"-"}
									</td>
									<td>
										<button
											className="link-blue"
											onClick={() =>
												handleDelete(group.id)
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
