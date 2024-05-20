from django.urls import path, include
from rest_framework import routers
from courseoutline import views

r = routers.DefaultRouter()
r.register('accounts', views.AccountViewSet, 'accounts')
r.register('approve', views.ApprovalViewSet, 'approve')
r.register('categories', views.CategoryViewSet, 'categories')
r.register('courses', views.CourseViewSet, 'courses')
<<<<<<< HEAD
r.register('outlines', views.OutlineViewSet, 'outlines')
r.register('lessons', views.LessonViewSet, 'lessons')
r.register('comments', views.CommentViewSet, 'comments')
=======
r.register('users', views.UserViewSet, 'users')
r.register('outlines',views.OutlineViewSet, 'outlines')
r.register('students', views.StudentViewSet,'students')
r.register('lessons', views.LessonViewSet,'lessons')
r.register('comments', views.CommentViewSet,'comments')
>>>>>>> 5d0ca0573ab2456c38c12986f1a769647c6f4ca5

urlpatterns = [
    path('', include(r.urls)),
]
