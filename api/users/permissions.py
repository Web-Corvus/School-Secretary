from rest_framework import permissions


class HasGroupPermission(permissions.BasePermission):
    """
    Garante que o usuário está em um grupo que tem as permissões necessárias.
    """

    def has_permission(self, request, view):
        # Obtém as permissões necessárias da view.
        required_permissions = getattr(view, "required_permissions", [])

        # Se não houver permissões necessárias, permite o acesso.
        if not required_permissions:
            return True

        # Verifica se o usuário tem TODAS as permissões necessárias.
        # As permissões podem ser concedidas diretamente ou através de um grupo.
        if request.user and request.user.is_authenticated:
            # O método has_perms verifica as permissões do usuário e de seus grupos.
            if request.user.has_perms(required_permissions):
                return True

        return False