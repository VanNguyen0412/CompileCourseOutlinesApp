from rest_framework import permissions
from rest_framework.permissions import BasePermission


<<<<<<< HEAD
class IsAdminPerms(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.is_admin()


class IsLecturerPerms(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user


class IsStudentPerms(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.is_student()


=======
>>>>>>> 5d0ca0573ab2456c38c12986f1a769647c6f4ca5
class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_student()


class CommentOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, comment):
        return super().has_permission(request, view) and request.user == comment.user


class IsOwnerOrReadOnly(BasePermission):
<<<<<<< HEAD
    def has_object_permission(self, request, view, obj):
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True

=======
    """
    Custom permission to only allow owners of an object to delete it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True

        # Write permissions are only allowed to the owner of the comment.
>>>>>>> 5d0ca0573ab2456c38c12986f1a769647c6f4ca5
        return obj.student.user == request.user


class IsLecturerAndOwner(BasePermission):
<<<<<<< HEAD

    def has_permission(self, request, view):
        if view.action in ['list', 'retrieve']:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.get_lecturer_profile()

    def has_object_permission(self, request, view, obj):
        return request.user.is_lecturer() and obj.lecturer == request.user.lecturer
=======
    """
    Custom permission to only allow lecturers who are the owners of an outline to edit it.
    """
    def has_permission(self, request, view):
        # Allow access to list view for authenticated users
        if view.action in ['list', 'retrieve']:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.is_lecturer()

    def has_object_permission(self, request, view, obj):
        # Only lecturers who are the owners can edit
        return request.user.is_lecturer() and obj.lecturer == request.user.lecturer
>>>>>>> 5d0ca0573ab2456c38c12986f1a769647c6f4ca5
