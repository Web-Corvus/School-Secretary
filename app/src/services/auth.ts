import axios from "axios";
import { LOGIN_BASE_URL } from "@/config";

interface LoginResponse {
	access: string;
	refresh: string;
}

export async function login(
	email: string,
	password: string
): Promise<LoginResponse> {
	try {
		const response = await axios.post(LOGIN_BASE_URL, {
			email,
			password,
		});

		const { access, refresh } = response.data;

		if (typeof window !== "undefined") {
			localStorage.setItem("access", access);
			localStorage.setItem("refresh", refresh);
		}

		return { access, refresh };
	} catch (error) {
		throw new Error("Login falhou. Verifique email e senha.");
	}
}

export function logout() {
	if (typeof window !== "undefined") {
		localStorage.removeItem("access");
		localStorage.removeItem("refresh");
	}
}
