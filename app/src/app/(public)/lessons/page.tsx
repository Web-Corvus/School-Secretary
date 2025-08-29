"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

import SelectObject from "@/components/SelectObject";
import { GROUP_BASE_URL } from "@/config";
import { DailyLessonsViewProps, GroupProps } from "@/types/group";

export default function LessonsPage() {
	const [data, setData] = useState<DailyLessonsViewProps[]>([]);
	const [update, setUpdate] = useState(false);
	const [groups, setGroups] = useState<GroupProps[]>();
	const [selectedGroup, setSelectedGroup] = useState<number>();

	useEffect(() => {
		if (!selectedGroup) return;
		axios
			.get<DailyLessonsViewProps[]>(
				`${GROUP_BASE_URL}${selectedGroup}/get-lessons/`
			)
			.then((response) => {
				setData(response.data);
			})
			.catch((error) => {
				alert(`Erro ao carregar aulas: ${error}`);
			});

		setUpdate(false);
	}, [update]);

	useEffect(() => {
		axios
			.get(GROUP_BASE_URL)
			.then((response) => {
				setGroups(response.data);
			})
			.catch((error) => {
				alert(`Erro ao carregar grupos: ${error}`);
			});
	}, []);

	const handleSelectedGroup = (value: number | undefined) => {
		setSelectedGroup(value);
		setUpdate(true);
	};

	return (
		<div>
			<div className="flex justify-center">
				<div className="title-container">
					<h1 className="title">Horários da Turma</h1>
				</div>
			</div>

			<div className="w-full flex justify-center items-center">
				<SelectObject options={groups} onSelect={handleSelectedGroup} />
			</div>

			<div className="flex justify-center m-3">
				<Link className="btn w-35 text-center" href="/lessons/add">
					Adicionar
				</Link>
			</div>
			<div>
				<div className="flex justify-center items-center">
					<div className="table-container">
						<table className="m-3 table table-border">
							<thead>
								<tr>
									<th>Dia</th>
									<th>1° Horário</th>
									<th>2° Horário</th>
									<th>3° Horário</th>
									<th>4° Horário</th>
									<th>5° Horário</th>
									<th>6° Horário</th>
								</tr>
							</thead>
							<tbody>
								{data.map(({ day, lessons }) => (
									<tr key={day}>
										<td>{day}</td>
										{lessons.map((lesson, idx) => (
											<td key={idx}>
												{lesson?.subject_details
													?.short_name || "-"}
											</td>
										))}
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
