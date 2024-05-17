from django.urls import path, include
from rest_framework import routers
from courseoutline import views

r = routers.DefaultRouter()
r.register('accounts', views.AccountViewSet, 'accounts')
r.register('approve', views.ApprovalViewSet, 'approve')
r.register('categories', views.CategoryViewSet, 'categories')
r.register('course', views.CourseViewSet, 'course')
r.register('outline', views.OutlineViewSet, 'outline')
r.register('lesson', views.LessonViewSet, 'lesson')
# r.register('user', views.UserViewSet, 'user')
# r.register('students', views.StudentViewSet, 'students')
# r.register('lecturer', views.LecturerViewSet, 'lecturer')

urlpatterns = [
    path('', include(r.urls)),
]
