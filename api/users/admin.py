from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    User,
    StudentProfile,
    GuardianProfile,
    ProfessorProfile,
    CoordinatorProfile,
    DeveloperProfile,
)


class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ("username", "email", "first_name", "last_name", "is_staff", "user_type")
    fieldsets = UserAdmin.fieldsets + (("User Type", {"fields": ("user_type",)}),)
    add_fieldsets = UserAdmin.add_fieldsets + (("User Type", {"fields": ("user_type",)}),)


admin.site.register(User, CustomUserAdmin)
admin.site.register(StudentProfile)
admin.site.register(GuardianProfile)
admin.site.register(ProfessorProfile)
admin.site.register(CoordinatorProfile)
admin.site.register(DeveloperProfile)
