"use client";

import api from "@/services/api";

import Link from "next/link";
import React, { useState, useEffect } from "react";

import SearchField from "@/components/SearchField";

import { ItineraryProps } from "@/types/itinerary";
import { ITINERARY_BASE_URL } from "@/config";

export default function ItinerariesPage() {
	const [search, setSearch] = useState("");
	const [update, setUpdate] = useState(false);
	const [data, setData] = useState<ItineraryProps[]>([]);

	useEffect(() => {

	       api
		       .get<ItineraryProps[]>(`${ITINERARY_BASE_URL}?search=${search}`)
		       .then((response) => setData(response.data))
		       .catch((error) => {
			       alert(`Erro ao carregar itinerários: ${error}`);
		       });

		setUpdate(false);
	}, [update]);

	const handleSearch = (value: string) => {
		setSearch(value);
		setUpdate(true);
	};

	const handleDelete = (value: number) => {
		api.delete(`${ITINERARY_BASE_URL}${value}/`);
		setUpdate(true);
	};

	return (
		<div>
			<div className="flex justify-center">
				<div className="title-container">
					<h1 className="title">Itinerários</h1>
				</div>
			</div>

			<div className="flex flex-row items-center justify-center">
				<SearchField
					placeholder="Buscar itinerário..."
					onSearch={handleSearch}
				/>
			</div>
			<div className="flex justify-center m-3">
				<Link className="btn w-50 text-center" href="/itineraries/add">
					Adicionar
				</Link>
			</div>
			<div>
				<div className="flex justify-center items-center">
					<div className="table-container">
						<table className="m-3 table table-border">
							<thead>
								<tr>
									<th>Abreviação</th>
									<th>Nome completo</th>
									<th>Remover</th>
								</tr>
							</thead>
							<tbody>
								{data.map((itinerary) => (
									<tr key={itinerary.id}>
										<td>{itinerary.short_name}</td>
										<td>{itinerary.full_name}</td>
										<td>
											<button
												className="link-blue"
												onClick={() =>
													handleDelete(itinerary.id)
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
		</div>
	);
}
