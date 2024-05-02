from rest_framework import viewsets, generics, parsers, permissions, status
from courseoutline.models import Course, Category, User, Outline, Student, Lesson, Lecturer
from courseoutline import serializers
from rest_framework.decorators import action
from rest_framework.response import Response


class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = serializers.CategorySerializer


class CourseViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Course.objects.filter(active=True)
    serializer_class = serializers.CourseSerializer


class LessonViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Lesson.objects.filter(active=True)
    serializer_class = serializers.LessonSerializer


class OutlineViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Outline.objects.filter(active=True)
    serializer_class = serializers.OutlineSerializer

    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__('list'):
            q = self.request.query_params.get('q')  # tìm đề cương theo tên
            if q:
                queryset = queryset.filter(name__icontains=q)

            credit = self.request.query_params.get('credit')  # tìm đề cương theo tín chỉ
            if credit:
                queryset = queryset.filter(credit__icontains=credit)

            lecturer = self.request.query_params.get('lecturer') #tìm đề cương theo tên giảng viên
            if lecturer:
                queryset = queryset.filter(lecturer_id=lecturer)

            course = self.request.query_params.get('course') #tìm đề cương theo khóa học
            if course:
                queryset = queryset.filter(course=course)
        return queryset

    @action(methods=['get'], url_path='comments', detail=True)
    def add_comment(self):
        pass

    @action(methods=['post'], url_path='add', detail=False)
    def add_outline(self):
        pass

    @action(methods=['post'], url_path='evaluation', detail=True)
    def add_evaluation(self):
        pass


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser, ]


class StudentViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Student.objects.all()
    serializer_class = serializers.StudentSerializer

    @action(methods=['get'], url_path='outline', detail=False)
    def download_outline(self):
        pass