from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import transaction
from .models import Student, Grade, Guardian, Contract, Presence
from users.serializers import UserSerializer

User = get_user_model()


class StudentSerializer(serializers.ModelSerializer):
    from school.serializers import GroupSerializer

    # user não é exposto para criação manual
    group_details = GroupSerializer(source="group", read_only=True)

    class Meta:
        model = Student
        fields = "__all__"
        extra_fields = ["group_details"]


class GradeSerializer(serializers.ModelSerializer):
    from school.serializers import SubjectSerializer

    student_details = StudentSerializer(source="student", read_only=True)
    subject_details = SubjectSerializer(source="subject", read_only=True)

    class Meta:
        model = Grade
        fields = "__all__"
        extra_fields = ["student_details", "subject_details"]


class GuardianSerializer(serializers.ModelSerializer):
    # user não é exposto para criação manual
    student_details = StudentSerializer(source="student", read_only=True)

    class Meta:
        model = Guardian
        fields = "__all__"
        extra_fields = ["student_details"]


class ContractSerializer(serializers.ModelSerializer):
    guardian_details = GuardianSerializer(source="guardian", read_only=True)
    student_details = StudentSerializer(source="student", read_only=True)

    class Meta:
        model = Contract
        fields = "__all__"
        extra_fields = ["guardian_details", "student_details"]


class PresenceSerializer(serializers.ModelSerializer):
    student_details = StudentSerializer(source="student", read_only=True)

    class Meta:
        model = Presence
        fields = "__all__"
        extra_fields = ["student_details"]
