"use client";

import api from "@/services/api";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { StudentPostProps } from "@/types/student";
import { GroupProps } from "@/types/group";

import { STUDENT_BASE_URL, GROUP_BASE_URL } from "@/config";

export default function AddStudents() {
	useAuthRedirect();
	const router = useRouter();
	const [groups, setGroups] = useState<GroupProps[]>([]);
	const [student, setStudent] = useState<StudentPostProps>({
		full_name: "",
		email: "",
		registration_number: "",
		phone_number: "",
		cpf: "",
		birthday: "",
		address: "",
		group: 0,
	});

	useEffect(() => {
	       api.get(GROUP_BASE_URL).then((response) => {
		       setGroups(response.data);
	       });
	}, []);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setStudent((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			   await api.post(STUDENT_BASE_URL, student);
			alert("Aluno cadastrado com sucesso!");
			setStudent({
				full_name: "",
				registration_number: "",
				phone_number: "",
				email: "",
				cpf: "",
				birthday: "",
				address: "",
				group: 0,
			});
			router.push("/students");
		} catch (error: any) {
			alert(`Erro ao cadastrar: ${error.message}`);
		}
	};

	return (
		<div className="m-10">
			<div className="flex justify-center">
				<div className="title-container">
					<h1 className="title">Adicionar Aluno</h1>
				</div>
			</div>
			<div className="flex justify-center items-center">
				<div className="form-container ">
					<form
						className="form flex-col"
						method="post"
						onSubmit={handleSubmit}
					>
						<input
							type="text"
							name="full_name"
							placeholder="Nome do aluno"
							value={student.full_name}
							onChange={handleChange}
						/>
						<input
							type="text"
							name="registration_number"
							placeholder="Matrícula"
							value={student.registration_number}
							onChange={handleChange}
						/>
						<input
							type="text"
							name="phone_number"
							placeholder="Telefone"
							value={student.phone_number}
							onChange={handleChange}
						/>
						<input
							type="email"
							name="email"
							placeholder="E-mail do aluno"
							value={student.email}
							onChange={handleChange}
						/>
						<input
							type="text"
							name="cpf"
							placeholder="CPF"
							value={student.cpf}
							onChange={handleChange}
						/>
						<input
							type="date"
							name="birthday"
							placeholder="Data de nascimento"
							value={student.birthday}
							onChange={handleChange}
						/>
						<input
							type="text"
							name="address"
							placeholder="Endereço"
							value={student.address}
							onChange={handleChange}
						/>
						<select
							name="group"
							value={student.group}
							onChange={handleChange}
						>
							<option value="">Selecione a turma</option>
							{groups.map((group) => (
								<option key={group.id} value={group.id}>
									{group.short_name}
								</option>
							))}
						</select>
						<button type="submit" className="btn w-full">
							Concluir
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
