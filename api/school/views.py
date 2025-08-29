from rest_framework import viewsets, filters, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from utils.day_util import get_day_name
from django.utils import timezone

from .models import (
    Professor,
    Subject,
    Itinerary,
    Group,
    SchoolRecord,
    Book,
    Lesson,
    AgendaItem,
    Event,
)
from .serializers import (
    ProfessorSerializer,
    SubjectSerializer,
    ItinerarySerializer,
    GroupSerializer,
    SchoolRecordSerializer,
    BookSerializer,
    LessonSerializer,
    AgendaItemSerializer,
    EventSerializer,
)
from .models import LESSONS_PER_DAY
from users.permissions import HasGroupPermission


class ProfessorViewSet(viewsets.ModelViewSet):
    queryset = Professor.objects.all().order_by("full_name")
    serializer_class = ProfessorSerializer
    permission_classes = [permissions.IsAuthenticated, HasGroupPermission]

    # Define as permissões necessárias para acessar este ViewSet.
    # O formato é 'app_label.action_model'
    required_permissions = [
        "school.view_professor",  # Para list e retrieve (GET)
        "school.add_professor",   # Para create (POST)
        "school.change_professor",# Para update (PUT/PATCH)
        "school.delete_professor",# Para destroy (DELETE)
    ]

    filter_backends = [filters.SearchFilter]
    search_fields = [
        "full_name",
        "phone_number",
        "email",
        "cpf",
        "birthday",
        "address",
        "subject__full_name",
        "subject__short_name",
    ]


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all().order_by("full_name")
    serializer_class = SubjectSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "full_name",
        "short_name",
        "created_at",
    ]


class ItineraryViewSet(viewsets.ModelViewSet):
    queryset = Itinerary.objects.all().order_by("full_name")
    serializer_class = ItinerarySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "full_name",
        "short_name",
        "created_at",
    ]


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all().order_by("full_name")
    serializer_class = GroupSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "full_name",
        "short_name",
        "itinerary__full_name",
        "itinerary__short_name",
        "created_at",
    ]

    @action(detail=True, methods=["get"], url_path="get-lessons")
    def get_lessons(self, request, pk=None):
        group = self.get_object()
        group_lessons = Lesson.objects.filter(group=group)
        week_lessons = []
        for day in range(7):
            day_lessons = []
            for time in range(LESSONS_PER_DAY):
                lesson = group_lessons.filter(day=day, time=time).first()
                if lesson:
                    day_lessons.append(LessonSerializer(lesson).data)
                else:
                    day_lessons.append(None)
            week_lessons.append(
                {
                    "day": get_day_name(day),
                    "lessons": day_lessons,
                }
            )
        return Response(week_lessons)


class SchoolRecordViewSet(viewsets.ModelViewSet):
    queryset = SchoolRecord.objects.all().order_by("-created_at")
    serializer_class = SchoolRecordSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "student__full_name",
        "student__registration_number",
        "descrition",
        "created_at",
    ]


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by("name")
    serializer_class = BookSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "name",
        "tenant__full_name",
        "tenant__registration_number",
        "author",
        "summary",
        "created_at",
    ]


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all().order_by("day", "time")
    serializer_class = LessonSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "group__full_name",
        "group__short_name",
        "professor__full_name",
        "professor__email",
        "subject__full_name",
        "subject__short_name",
        "time",
        "day",
        "created_at",
    ]


class AgendaItemViewSet(viewsets.ModelViewSet):
    queryset = AgendaItem.objects.all().order_by("-date", "-time")
    serializer_class = AgendaItemSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "title",
        "description",
        "date",
    ]

    @action(detail=False, methods=["get"], url_path="pendents")
    def get_pendents(self, request):
        pendents = self.get_queryset().filter(date__gte=timezone.now().date()).order_by("date", "time")
        serializer = self.get_serializer(pendents, many=True)
        return Response(serializer.data)


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by("-start_date", "-start_time")
    serializer_class = EventSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "title",
        "description",
        "location",
        "start_date",
    ]

    @action(detail=False, methods=["get"], url_path="pendents")
    def get_pendents(self, request):
        pendents = self.get_queryset().filter(start_date__gte=timezone.now().date()).order_by("start_date", "start_time")
        serializer = self.get_serializer(pendents, many=True)
        return Response(serializer.data)
