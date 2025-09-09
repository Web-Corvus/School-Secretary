"use client";

import Link from "next/link";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import React, { useEffect, useState } from "react";
import api from "@/services/api";

import SearchField from "@/components/SearchField";

import { ProfessorProps } from "@/types/professor";
import { PROFESSOR_BASE_URL } from "@/config";

export default function ProfessorsPage() {
	useAuthRedirect();
	const [data, setData] = useState<ProfessorProps[]>([]);
	const [search, setSearch] = useState("");
	const [update, setUpdate] = useState(false);

	useEffect(() => {
	       api
		       .get(`${PROFESSOR_BASE_URL}?search=${search}`)
		       .then((response) => setData(response.data))
		       .finally(() => setUpdate(false));
	}, [update]);

	const handleSearch = (value: string) => {
		setUpdate(true);
		setSearch(value);
	};

	const handleDelete = (value: number) => {
		api.delete(`${PROFESSOR_BASE_URL}${value}/`);
		setUpdate(true);
	};

	return (
		<div>
			<div className="flex justify-center">
				<div className="title-container">
					<h1 className="title">Dados dos Professores Cadastrados</h1>
				</div>
			</div>

			<div className="flex flex-row items-center justify-center">
				<SearchField
					placeholder="Buscar professor..."
					onSearch={handleSearch}
				/>
			</div>
			<div className="flex justify-center m-3">
				<Link className="btn w-50 text-center" href="/professors/add">
					Adicionar
				</Link>
			</div>
			<div className="flex justify-center items-center">
				<div className="table-container">
					<table className="m-3 table table-border">
						<thead>
							<tr>
								<th>Nome</th>
								<th>Telefone</th>
								<th>Email</th>
								<th>CPF</th>
								<th>Data de Nascimento</th>
								<th>Endereço</th>
								<th>Matéria</th>
								<th>Remover</th>
							</tr>
						</thead>
						<tbody>
							{data.map((professor) => (
								<tr key={professor.id}>
									<td>{professor.full_name}</td>
									<td>{professor.phone_number}</td>
									<td>{professor.email}</td>
									<td>{professor.cpf}</td>
									<td>{professor.birthday}</td>
									<td>{professor.address}</td>
									<td>
										{professor.subject_details?.full_name ||
											"-"}
									</td>
									<td>
										<button
											className="link-blue"
											onClick={() =>
												handleDelete(professor.id)
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
