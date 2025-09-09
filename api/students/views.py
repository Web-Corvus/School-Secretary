
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from users.permissions import IsStaff, IsProfessor

from .models import Student, Grade, Guardian, Contract, Presence
from .serializers import (
    StudentSerializer,
    GradeSerializer,
    GuardianSerializer,
    ContractSerializer,
    PresenceSerializer,
)
from utils.pdfgen import pdfgen
from utils.subject_utils import get_subject_names


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all().order_by("full_name")
    serializer_class = StudentSerializer
    permission_classes = [IsStaff]
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "user__name",
        "user__email",
        "registration_number",
        "phone_number",
        "cpf",
        "birthday",
        "address",
        "group__full_name",
        "group__short_name",
        "group__itinerary__full_name",
        "group__itinerary__short_name",
        "created_at",
    ]

    from rest_framework.response import Response
    from rest_framework.permissions import IsAuthenticated
    from students.models import Guardian

    def _can_download(self, request, student):
        # Staff, superuser, o próprio aluno ou o guardião podem baixar
        if request.user.is_staff or request.user.is_superuser:
            return True
        if hasattr(student, 'user') and student.user == request.user:
            return True
        # Guardião: usuário é guardião e está vinculado ao estudante
        try:
            guardian = Guardian.objects.get(user=request.user)
            if guardian.student_id == student.id:
                return True
        except Guardian.DoesNotExist:
            pass
        return False

    @action(detail=True, methods=["get"], url_path="download-grades", permission_classes=[IsAuthenticated])
    def download_grades_pdf(self, request, pk=None):
        student = self.get_object()
        if not self._can_download(request, student):
            return Response({"detail": "Proibido."}, status=403)
        subjects = get_subject_names()
        data = {}
        for subject in subjects:
            data[subject] = Grade.objects.filter(
                student=student,
                subject__full_name=subject,
            )
        return pdfgen(
            "grades.html",
            {
                "student": student,
                "data": data,
            },
            f"Grades_{student.full_name}.pdf",
        )

    @action(detail=True, methods=["get"], url_path="download-presence", permission_classes=[IsAuthenticated])
    def download_presence_pdf(self, request, pk=None):
        student = self.get_object()
        if not self._can_download(request, student):
            return Response({"detail": "Proibido."}, status=403)
        presence_records = Presence.objects.filter(student=student)
        return pdfgen(
            "presence.html",
            {
                "student": student,
                "data": presence_records,
            },
            f"Presence_{student.full_name}.pdf",
        )


class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all().order_by(
        "student__full_name", "subject__full_name", "year", "bimester"
    )
    serializer_class = GradeSerializer
    permission_classes = [IsProfessor]
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "student__user__name",
        "student__registration_number",
        "subject__full_name",
        "subject__short_name",
        "year",
        "bimester",
        "value",
        "created_at",
    ]


class GuardianViewSet(viewsets.ModelViewSet):
    #queryset = Guardian.objects.all().order_by("full_name")
    serializer_class = GuardianSerializer
    permission_classes = [IsStaff]
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "user__name",
        "user__email",
        "student__user__name",
        "student__registration_number",
        "phone_number",
        "cpf",
        "birthday",
        "address",
        "created_at",
    ]


class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all().order_by("-created_at")
    serializer_class = ContractSerializer
    permission_classes = [IsStaff]
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "guardian__user__name",
        "guardian__cpf",
        "student__user__name",
        "student__registration_number",
        "created_at",
    ]

    @action(detail=True, methods=["get"], url_path="download-contract")
    def download_contract_pdf(self, request, pk=None):
        contract = self.get_object()
        return pdfgen(
            "contract.html",
            {
                "data": contract,
            },
            f"Contract_{contract.id}_{contract.guardian.full_name}-{contract.student.full_name}.pdf",
        )


class PresenceViewSet(viewsets.ModelViewSet):
    queryset = Presence.objects.all().order_by("student__full_name", "date")
    serializer_class = PresenceSerializer
    permission_classes = [IsProfessor]
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "student__user__name",
        "student__registration_number",
        "date",
        "presence",
        "created_at",
    ]