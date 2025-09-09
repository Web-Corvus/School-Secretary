import random
from django.core.management.base import BaseCommand
from faker import Faker
from students.models import Student, Guardian
from school.models import Professor, Subject, Group, Itinerary, Lesson
from users.models import User

fake = Faker('pt_BR')

class Command(BaseCommand):
    help = 'Cria dados aleatórios para estudantes, guardiões e professores.'

    def add_arguments(self, parser):
        parser.add_argument('--students', type=int, default=10)
        parser.add_argument('--guardians', type=int, default=10)
        parser.add_argument('--professors', type=int, default=5)

    def handle(self, *args, **options):
        def random_phone():
            ddd = random.randint(10, 99)
            prefix = random.randint(90000, 99999)
            suffix = random.randint(1000, 9999)
            return f"({ddd}) {prefix}-{suffix}"

        # 1. Itineraries
        itineraries = []
        for i in range(3):
            itinerary = Itinerary.objects.create(
                full_name=fake.unique.word().capitalize() + " Itinerário",
                short_name=fake.unique.word().capitalize(),
            )
            itineraries.append(itinerary)
        self.stdout.write(self.style.SUCCESS(f'{len(itineraries)} itinerários criados.'))

        # 2. Subjects
        subjects = []
        for i in range(5):
            subject = Subject.objects.create(
                full_name=fake.unique.word().capitalize() + " Subject",
                short_name=fake.unique.word().capitalize(),
            )
            subjects.append(subject)
        self.stdout.write(self.style.SUCCESS(f'{len(subjects)} disciplinas criadas.'))

        # 3. Groups
        groups = []
        for i in range(3):
            group = Group.objects.create(
                full_name=fake.unique.word().capitalize() + " Turma",
                short_name=fake.unique.word().capitalize(),
                itinerary=random.choice(itineraries),
            )
            groups.append(group)
        self.stdout.write(self.style.SUCCESS(f'{len(groups)} grupos criados.'))

        # 4. Professors (vinculados a Subjects)
        professors = []
        for _ in range(options['professors']):
            subject = random.choice(subjects)
            professor = Professor.objects.create(
                full_name=fake.name(),
                phone_number=random_phone(),
                email=fake.unique.email(),
                cpf=fake.unique.cpf().replace('.', '').replace('-', ''),
                birthday=fake.date_of_birth(minimum_age=25, maximum_age=70),
                address=fake.address(),
                subject=subject,
            )
            professors.append(professor)
        self.stdout.write(self.style.SUCCESS(f'{len(professors)} professores criados.'))

        # 5. Lessons (cada grupo recebe uma lesson para cada subject/professor)
        from school.models import Lesson
        lessons = []
        for group in groups:
            for subject in subjects:
                profs = [p for p in professors if p.subject == subject]
                if not profs:
                    continue
                professor = random.choice(profs)
                lesson = Lesson.objects.create(
                    group=group,
                    professor=professor,
                    subject=subject,
                    time=random.randint(1, 6),
                    day=random.randint(0, 5),
                )
                lessons.append(lesson)
        self.stdout.write(self.style.SUCCESS(f'{len(lessons)} aulas criadas.'))

        # 6. Students (vinculados a Groups)
        students = []
        for _ in range(options['students']):
            group = random.choice(groups)
            student = Student.objects.create(
                full_name=fake.name(),
                registration_number=str(random.randint(100000, 999999)),
                phone_number=random_phone(),
                email=fake.unique.email(),
                cpf=fake.unique.cpf().replace('.', '').replace('-', ''),
                birthday=fake.date_of_birth(minimum_age=6, maximum_age=18),
                address=fake.address(),
                group=group,
            )
            students.append(student)
        self.stdout.write(self.style.SUCCESS(f'{len(students)} estudantes criados.'))

        # 7. Grades (para cada estudante e subject)
        from students.models import Grade
        grades = []
        for student in students:
            for subject in subjects:
                for bimester in ["1B", "2B", "3B", "4B"]:
                    grade = Grade.objects.create(
                        student=student,
                        subject=subject,
                        year=2025,
                        bimester=bimester,
                        value=round(random.uniform(0, 10), 1),
                    )
                    grades.append(grade)
        self.stdout.write(self.style.SUCCESS(f'{len(grades)} notas criadas.'))

        # 8. Guardians (cada um vinculado a um estudante existente)
        guardians = []
        for _ in range(options['guardians']):
            guardian = Guardian.objects.create(
                full_name=fake.name(),
                student=random.choice(students),
                phone_number=random_phone(),
                email=fake.unique.email(),
                cpf=fake.unique.cpf().replace('.', '').replace('-', ''),
                birthday=fake.date_of_birth(minimum_age=30, maximum_age=60),
                address=fake.address(),
            )
            guardians.append(guardian)
        self.stdout.write(self.style.SUCCESS(f'{len(guardians)} guardiões criados.'))

        self.stdout.write(self.style.SUCCESS('Dados aleatórios criados com sucesso!'))
