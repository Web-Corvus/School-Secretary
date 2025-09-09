from django.contrib import admin
from django.http import HttpResponseRedirect
from django.urls import path
from django.utils.html import format_html

from .models import (
    Student,
    Guardian,
    Contract,
    Grade,
    Presence,
)


class StudentsAdmin(admin.ModelAdmin):
    list_display = (
        "full_name",
        "registration_number",
        "phone_number",
        "email",
        "address",
        "cpf",
        "birthday",
        "group",
        "download_presence_pdf",
        "download_grades_pdf",
    )
    exclude = ("user",)
    list_display_links = (
        "full_name",
        "email",
        "address",
    )
    search_fields = (
        "full_name",
        "registration_number",
    )
    list_filter = ("full_name",)

    def generate_presence_pdf(self, request, student_id):
        try:
            student = Student.objects.get(pk=student_id)
            return student.generate_presence_pdf()
        except Student.DoesNotExist:
            self.message_user(request, "Student not found.")
            return HttpResponseRedirect(request.META.get("HTTP_REFERER"))

    def generate_grades_pdf(self, request, student_id):
        try:
            student = Student.objects.get(pk=student_id)
            return student.generate_grades_pdf()
        except Student.DoesNotExist:
            self.message_user(request, "Student not found.")
            return HttpResponseRedirect(request.META.get("HTTP_REFERER"))

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "<int:student_id>/generate-presence-pdf/",
                self.admin_site.admin_view(self.generate_presence_pdf),
                name="generate-presence-pdf",
            ),
            path(
                "<int:student_id>/generate-grades-pdf/",
                self.admin_site.admin_view(self.generate_grades_pdf),
                name="generate-grades-pdf",
            ),
        ]
        return custom_urls + urls

    def download_presence_pdf(self, obj):
        return format_html(
            f"<a href=/admin/students/student/{obj.id}/generate-presence-pdf/>Download</a>",
        )

    def download_grades_pdf(self, obj):
        return format_html(
            f"<a href=/admin/students/student/{obj.id}/generate-grades-pdf/>Download</a>",
        )

    download_presence_pdf.short_description = "Download Presence"
    download_grades_pdf.short_description = "Download Grades"


class GuardiansAdmin(admin.ModelAdmin):
    list_display = (
        "full_name",
        "student",
        "phone_number",
        "email",
        "cpf",
        "birthday",
        "address",
    )
    exclude = ("user",)
    list_display_links = (
        "full_name",
        "email",
        "address",
    )
    search_fields = ("full_name",)
    list_filter = ("full_name",)


class ContractsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "guardian",
        "student",
        "download_contract",
    )
    list_display_links = (
        "guardian",
        "student",
    )
    search_fields = (
        "guardian",
        "student",
    )

    def generate_pdf(self, request, contract_id):
        try:
            contract = Contract.objects.get(pk=contract_id)
            return contract.generate_contract_pdf()
        except Contract.DoesNotExist:
            self.message_user(request, "Contract not found.")
            return HttpResponseRedirect(request.META.get("HTTP_REFERER"))

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "<int:contract_id>/generate-pdf/",
                self.admin_site.admin_view(self.generate_pdf),
                name="generate-contract-pdf",
            ),
        ]
        return custom_urls + urls

    def download_contract(self, obj):
        return format_html(
            f"<a href=/admin/students/contract/{obj.id}/generate-pdf/>Download</a>",
        )

    download_contract.short_description = "Download Contract"


class GradeAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "student",
        "subject",
        "year",
    )
    list_display_links = ("student",)
    search_fields = ("student",)
    list_filter = ("student", "subject", "year")


class PresencesAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "student",
        "date",
        "presence",
    )
    list_display_links = (
        "student",
        "date",
        "presence",
    )
    search_fields = (
        "student",
        "date",
        "presence",
    )
    list_filter = ("student", "date")


admin.site.register(
    Student,
    StudentsAdmin,
)

admin.site.register(
    Guardian,
    GuardiansAdmin,
)

admin.site.register(
    Contract,
    ContractsAdmin,
)

admin.site.register(
    Grade,
    GradeAdmin,
)

admin.site.register(
    Presence,
    PresencesAdmin,
)
