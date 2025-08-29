from rest_framework import serializers
from .models import User, StudentProfile, GuardianProfile, ProfessorProfile


class StudentProfileSerializer(serializers.ModelSerializer):
    from students.serializers import StudentSerializer

    student_data = StudentSerializer(read_only=True)

    class Meta:
        model = StudentProfile
        fields = ["user", "student_data"]


class GuardianProfileSerializer(serializers.ModelSerializer):
    from students.serializers import GuardianSerializer

    guardian_data = GuardianSerializer(read_only=True)

    class Meta:
        model = GuardianProfile
        fields = ["user", "guardian_data"]


class ProfessorProfileSerializer(serializers.ModelSerializer):
    from school.serializers import ProfessorSerializer

    professor_data = ProfessorSerializer(read_only=True)

    class Meta:
        model = ProfessorProfile
        fields = ["user", "professor_data"]


class UserSerializer(serializers.ModelSerializer):
    student_profile = StudentProfileSerializer(read_only=True)
    guardian_profile = GuardianProfileSerializer(read_only=True)
    professor_profile = ProfessorProfileSerializer(read_only=True)
    groups = serializers.SlugRelatedField(many=True, read_only=True, slug_field='name')

    class Meta:
        model = User
        fields = [
            "id", "username", "email", "first_name", "last_name",
            "user_type", "is_staff", "is_active", "date_joined",
            "groups",
            "student_profile", "guardian_profile", "professor_profile",
            "password",
        ]
        read_only_fields = ("date_joined",)
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        # Usa o manager do User para criar o usuário, que lida com o hash da senha
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user