import random
import string

def generate_random_password(length=12):
    chars = string.ascii_letters + string.digits + '!@#$%^&*()_+-='
    return ''.join(random.choice(chars) for _ in range(length))
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.contrib.auth.models import UserManager
from students.models import Student, Guardian
from school.models import Professor

User = get_user_model()

# Função utilitária para criar usuário

def create_related_user(instance, role):
    if not instance.user:
        password = generate_random_password()
        user = User.objects.create(
            email=instance.email,
            name=instance.full_name,
            role=role,
        )
        user.set_password(password)
        user.save()
        instance.user = user
        instance.save(update_fields=["user"])

# Função utilitária para deletar usuário

def delete_related_user(instance):
    # Evita erro se o user já foi deletado
    try:
        user = getattr(instance, 'user', None)
        if user and user.pk:
            user.delete()
    except User.DoesNotExist:
        pass

# Student
@receiver(post_save, sender=Student)
def create_user_for_student(sender, instance, created, **kwargs):
    if created:
        create_related_user(instance, User.Role.STUDENT)

@receiver(post_delete, sender=Student)
def delete_user_for_student(sender, instance, **kwargs):
    delete_related_user(instance)

# Guardian
@receiver(post_save, sender=Guardian)
def create_user_for_guardian(sender, instance, created, **kwargs):
    if created:
        create_related_user(instance, User.Role.GUARDIAN)

@receiver(post_delete, sender=Guardian)
def delete_user_for_guardian(sender, instance, **kwargs):
    delete_related_user(instance)

# Professor
@receiver(post_save, sender=Professor)
def create_user_for_professor(sender, instance, created, **kwargs):
    if created:
        create_related_user(instance, User.Role.PROFESSOR)

@receiver(post_delete, sender=Professor)
def delete_user_for_professor(sender, instance, **kwargs):
    delete_related_user(instance)

# Se o User for deletado, deleta o perfil relacionado
@receiver(post_delete, sender=User)
def delete_profile_for_user(sender, instance, **kwargs):
    for model in [Student, Guardian, Professor]:
        try:
            profile = model.objects.get(user=instance)
            # Só deleta se o perfil ainda existe e o campo user_id está preenchido
            if profile and getattr(profile, 'user_id', None):
                profile.delete()
        except model.DoesNotExist:
            pass
