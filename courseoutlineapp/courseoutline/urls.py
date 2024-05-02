from django.urls import path, include
from rest_framework import routers
from courseoutline import views

r = routers.DefaultRouter()
r.register('categories', views.CategoryViewSet, 'categories')
r.register('course', views.CourseViewSet, 'course')
r.register('user', views.UserViewSet, 'user')
r.register('outline',views.OutlineViewSet, 'outline')
r.register('students', views.StudentViewSet,'students')
r.register('lesson', views.LessonViewSet,'lesson')

urlpatterns = [
    path('', include(r.urls)),
]