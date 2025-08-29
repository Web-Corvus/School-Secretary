from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings


class User(AbstractUser):
    """
    Custom user model that extends Django's AbstractUser.
    Includes a user type to differentiate roles within the system.
    """

    class UserType(models.TextChoices):
        STUDENT = "STUDENT", "Aluno"
        GUARDIAN = "GUARDIAN", "Responsável"
        STAFF = "STAFF", "Professor"
        COORDINATOR = "COORDINATOR", "Coordenação"
        ADMIN = "ADMIN", "Adm"

    user_type = models.CharField(
        max_length=20,
        choices=UserType.choices,
        default=UserType.STUDENT,
        verbose_name="Tipo de Usuário",
    )


class StudentProfile(models.Model):
    """Links a User account to a Student data record."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="student_profile",
    )
    student_data = models.OneToOneField(
        "students.Student", on_delete=models.CASCADE, related_name="user_profile"
    )

    def __str__(self):
        return self.user.username


class GuardianProfile(models.Model):
    """Links a User account to a Guardian data record."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="guardian_profile",
    )
    guardian_data = models.OneToOneField(
        "students.Guardian", on_delete=models.CASCADE, related_name="user_profile"
    )

    def __str__(self):
        return self.user.username


class ProfessorProfile(models.Model):
    """Links a User account to a Professor data record."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="professor_profile",
    )
    professor_data = models.OneToOneField(
        "school.Professor", on_delete=models.CASCADE, related_name="user_profile"
    )

    def __str__(self):
        return self.user.username


# Simple profiles for users without existing data models
class CoordinatorProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, primary_key=True
    )

    def __str__(self):
        return self.user.username


class DeveloperProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, primary_key=True
    )

    def __str__(self):
        return self.user.username