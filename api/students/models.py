from django.db import models
from datetime import datetime

from django.utils import timezone
from django.contrib.auth import get_user_model

from utils.validators import phone_validator, cep_validator, cpf_validator
from utils.subject_utils import get_subject_names

BIMESTER_CHOICES = [
    ("1B", "1º Bimestre"),
    ("2B", "2º Bimestre"),
    ("3B", "3º Bimestre"),
    ("4B", "4º Bimestre"),
]


class Student(models.Model):
    # user = models.OneToOneField(#preciso que seja nome e não user nome
    #     get_user_model(),
    #     on_delete=models.CASCADE,
    #     related_name="student_profile",
    #     null=True,
    #     blank=True,
    # )
    from django.contrib.auth import get_user_model
    user = models.OneToOneField(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name="student_profile",
        null=True,
        blank=True,
    )
    full_name = models.CharField(
        max_length=200, verbose_name="Student's full name", null=True
    )

    registration_number = models.CharField(
        max_length=6, unique=True, verbose_name="Student's registration"
    )
    phone_number = models.CharField(
        max_length=15,
        verbose_name="Student's phone number (XX) 9XXXX-XXXX",
        validators=[phone_validator],
    )
    email = models.EmailField(max_length=100, verbose_name="Student's email")
    cpf = models.CharField(
        max_length=11,
        verbose_name="Student's CPF",
        unique=True,
        validators=[cpf_validator],
    )
    birthday = models.DateField(max_length=10)
    address = models.CharField(max_length=100, validators=[cep_validator])
    group = models.ForeignKey(
        "school.Group",
        on_delete=models.SET_NULL,
        verbose_name="Student's group",
        related_name="student",
        blank=False,
        null=True,
    )

    created_at = models.DateTimeField(
        default=timezone.now,
        editable=False,
    )

    def __str__(self):
        return self.full_name


class Guardian(models.Model):
    from django.contrib.auth import get_user_model
    user = models.OneToOneField(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name="guardian_profile",
        null=True,
        blank=True,
    )
    full_name = models.CharField(
        max_length=200, verbose_name="Guardian's full name", null=True
    )
    student = models.ForeignKey(
        Student,
        on_delete=models.SET_NULL,
        verbose_name="Guardian's student",
        related_name="guardian",
        blank=False,
        null=True,
    )
    phone_number = models.CharField(
        max_length=15,
        verbose_name="Guardian's phone number (XX) 9XXXX-XXXX",
        validators=[phone_validator],
    )
    email = models.EmailField(max_length=100, verbose_name="Guardian's email")
    cpf = models.CharField(
        max_length=11,
        verbose_name="Guardian's CPF",
        unique=True,
        validators=[cpf_validator],
    )
    birthday = models.DateField(max_length=10)
    address = models.CharField(max_length=100, validators=[cep_validator])

    created_at = models.DateTimeField(
        default=timezone.now,
        editable=False,
    )

    def __str__(self):
        return self.full_name


class Contract(models.Model):
    guardian = models.ForeignKey(
        Guardian,
        on_delete=models.SET_NULL,
        verbose_name="Guardian's name",
        related_name="contract",
        blank=False,
        null=True,
    )

    student = models.ForeignKey(
        Student,
        on_delete=models.SET_NULL,
        verbose_name="Student's name",
        related_name="contract",
        blank=False,
        null=True,
    )

    created_at = models.DateTimeField(
        default=timezone.now,
        editable=False,
    )

    def __str__(self):
        return f"Contract: {self.guardian.full_name.upper()} e {self.student.full_name.upper()}"


class Grade(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.SET_NULL,
        verbose_name="Student's name",
        related_name="grade",
        blank=False,
        null=True,
    )

    subject = models.ForeignKey(
        "school.Subject",
        on_delete=models.SET_NULL,
        verbose_name="Grade's Subject",
        related_name="grade",
        blank=False,
        null=True,
    )

    year = models.IntegerField(
        blank=False,
        null=True,
    )

    bimester = models.CharField(
        max_length=20,
        choices=BIMESTER_CHOICES,
        blank=False,
        null=True,
    )

    value = models.FloatField(blank=False, null=True)

    created_at = models.DateTimeField(
        default=timezone.now,
        editable=False,
    )

    def __str__(self):
        if self.student:
            return f"{self.student.full_name}'s Bulletin"
        return "Grade sem estudante"

    class Meta:
        verbose_name_plural = "Grades"


class Presence(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.SET_NULL,
        verbose_name="Student's name",
        related_name="presence",
        blank=False,
        null=True,
    )
    date = models.DateField()
    presence = models.BooleanField()
    created_at = models.DateTimeField(
        default=timezone.now,
        editable=False,
    )

    def __str__(self):
        return f"Presence_{self.student}"
