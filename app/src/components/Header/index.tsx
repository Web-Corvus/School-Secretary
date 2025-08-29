import Link from "next/link";

export default function Header() {
	return (
		<div className="header-vertical">
			<ul>
				<li>
					<Link href="/">Início</Link>
				</li>
				<li>
					<Link href="/students">Estudantes</Link>
				</li>
				<li>
					<Link href="/professors">Professores</Link>
				</li>
				<li>
					<Link href="/subjects">Matérias</Link>
				</li>
				<li>
					<Link href="/itineraries">Itinerários</Link>
				</li>
				<li>
					<Link href="/groups">Turmas</Link>
				</li>
				<li>
					<Link href="/lessons">Horários</Link>
				</li>
				<li>
					<Link href="/events">Eventos</Link>
				</li>
				<li>
					<Link href="/agenda">Agenda</Link>
				</li>
			</ul>
		</div>
	);
}
