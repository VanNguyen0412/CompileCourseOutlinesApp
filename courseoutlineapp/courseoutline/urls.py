from django.urls import path, include
from rest_framework import routers
from courseoutline import views

r = routers.DefaultRouter()
r.register('accounts', views.AccountViewSet, 'accounts')
r.register('approve', views.ApprovalViewSet, 'approve')
r.register('categories', views.CategoryViewSet, 'categories')
r.register('courses', views.CourseViewSet, 'courses')
r.register('lecturers', views.LecturerViewSet, 'lecturers')
r.register('students', views.StudentViewSet, 'students')
r.register('outlines', views.OutlineViewSet, 'outlines')
r.register('lessons', views.LessonViewSet, 'lessons')
r.register('comments', views.CommentViewSet, 'comments')
r.register('lessonname', views.LessonNameViewSet, 'lessonname')

# r.register('evaluation', views.RemoveEvaluationFromOutlineView, 'evaluation')

urlpatterns = [
    path('', include(r.urls)),
]
