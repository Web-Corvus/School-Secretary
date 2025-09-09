from django.contrib import admin
from django.contrib import admin
from school.models import (
    Subject,
    Itinerary,
    Group,
    Professor,
    SchoolRecord,
    Book,
    Lesson,
)


class SubjectsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "full_name",
        "short_name",
    )
    list_display_links = (
        "full_name",
        "short_name",
    )
    search_fields = (
        "full_name",
        "short_name",
    )
    list_filter = (
        "full_name",
        "short_name",
    )


class ItinerariesAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "full_name",
        "short_name",
    )
    list_display_links = (
        "full_name",
        "short_name",
    )
    search_fields = (
        "full_name",
        "short_name",
    )
    list_filter = (
        "full_name",
        "short_name",
    )


class GroupsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "full_name",
        "short_name",
        "itinerary",
    )
    list_display_links = (
        "full_name",
        "short_name",
    )
    search_fields = (
        "full_name",
        "short_name",
    )
    list_filter = (
        "full_name",
        "short_name",
        "itinerary",
    )


class ProfessorsAdmin(admin.ModelAdmin):
    list_display = (
        "full_name",
        "phone_number",
        "email",
        "cpf",
        "birthday",
        "address",
        "subject",
    )
    list_display_links = (
        "full_name",
        "email",
        "address",
    )
    search_fields = ("user__name", "user__email", "cpf")
    list_filter = ("subject",)

    @admin.display(description="Full Name", ordering="user__name")
    def get_full_name(self, obj):
        if obj.user:
            return obj.user.name

    @admin.display(description="Email", ordering="user__email")
    def get_email(self, obj):
        if obj.user:
            return obj.user.email


class SchoolRecordsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "student",
        "descrition",
    )
    list_display_links = ("student",)
    search_fields = ("student",)
    list_filter = ("student",)


class BooksAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "tenant",
        "name",
        "author",
        "summary",
    )
    list_display_links = (
        "tenant",
        "name",
        "author",
        "summary",
    )
    search_fields = (
        "tenant",
        "name",
        "author",
        "summary",
    )
    list_filter = ("tenant",)


class LessonsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "professor",
        "subject",
        "time",
        "day",
    )
    list_display_links = (
        "professor",
        "subject",
    )
    search_fields = (
        "professor",
        "subject",
        "time",
        "day",
    )
    list_filter = ("professor", "subject", "time", "day")


admin.site.register(
    Subject,
    SubjectsAdmin,
)

admin.site.register(
    Itinerary,
    ItinerariesAdmin,
)

admin.site.register(
    Group,
    GroupsAdmin,
)

admin.site.register(
    Professor,
    ProfessorsAdmin,
)

admin.site.register(
    SchoolRecord,
    SchoolRecordsAdmin,
)

admin.site.register(
    Book,
    BooksAdmin,
)

admin.site.register(
    Lesson,
    LessonsAdmin,
)
