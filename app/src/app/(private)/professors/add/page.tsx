"use client";

import api from "@/services/api";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { ProfessorPostProps } from "@/types/professor";
import { SubjectProps } from "@/types/subject";

import { SUBJECT_BASE_URL, PROFESSOR_BASE_URL } from "@/config";

export default function AddProfessor() {
	useAuthRedirect();
	const router = useRouter();
	const [subjects, setSubjects] = useState<SubjectProps[]>([]);
	const [professor, setProfessor] = useState<ProfessorPostProps>({
		full_name: "",
		phone_number: "",
		email: "",
		cpf: "",
		birthday: "",
		address: "",
		subject: 0,
	});

	useEffect(() => {
	       api
		       .get(SUBJECT_BASE_URL)
		       .then((response) => setSubjects(response.data));
	}, []);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setProfessor((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			   await api.post(PROFESSOR_BASE_URL, professor);
			alert("Professor cadastrado com sucesso!");
			setProfessor({
				full_name: "",
				phone_number: "",
				email: "",
				cpf: "",
				birthday: "",
				address: "",
				subject: 0,
			});
			router.push("/professors");
		} catch (error: any) {
			alert(`Erro ao cadastrar: ${error.message}`);
		}
	};

	return (
		<div>
			<div className="flex justify-center">
				<div className="title-container">
					<h1 className="title">Adicionar Professor</h1>
				</div>
			</div>
			<div className="flex justify-center">
				<div className="form-container">
					<form
						className="form flex-col"
						method="post"
						onSubmit={handleSubmit}
					>
						<input
							type="text"
							name="full_name"
							placeholder="Nome do professor"
							value={professor.full_name}
							onChange={handleChange}
						/>
						<input
							type="text"
							name="phone_number"
							placeholder="Telefone"
							value={professor.phone_number}
							onChange={handleChange}
						/>
						<input
							type="email"
							name="email"
							placeholder="E-mail do professor"
							value={professor.email}
							onChange={handleChange}
						/>
						<input
							type="text"
							name="cpf"
							placeholder="CPF"
							value={professor.cpf}
							onChange={handleChange}
						/>
						<input
							type="date"
							name="birthday"
							placeholder="Data de nascimento"
							value={professor.birthday}
							onChange={handleChange}
						/>
						<input
							type="text"
							name="address"
							placeholder="Endereço"
							value={professor.address}
							onChange={handleChange}
						/>
						<select
							name="subject"
							value={professor.subject}
							onChange={handleChange}
						>
							<option value="">Selecione a matéria</option>
							{subjects.map((subject) => (
								<option key={subject.id} value={subject.id}>
									{subject.full_name}
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
