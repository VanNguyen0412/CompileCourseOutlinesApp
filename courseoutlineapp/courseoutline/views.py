from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import viewsets, generics, parsers, permissions, status
from rest_framework.exceptions import PermissionDenied
from courseoutline.models import *
from courseoutline import serializers, paginators, perms
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated


class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = serializers.CategorySerializer


class CourseViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Course.objects.filter(active=True)
    serializer_class = serializers.CourseSerializer


class LessonViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Lesson.objects.filter(active=True)
    serializer_class = serializers.LessonSerializer
    pagination_class = paginators.ItemPaginator
    def get_permissions(self):
        if self.action in ['create_lesson']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @action(methods=['post'], url_path='create', detail=False)
    def create_lesson(self, request):
        if not request.user.is_lecturer():
            return Response({"error": "Only lecturers can create lessons."},
                            status=status.HTTP_403_FORBIDDEN)
        lecturer = request.user.lecturer

        mutable_data = request.data.copy()
        mutable_data['lecturer'] = lecturer.id

        serializer = serializers.LessonSerializer(data=mutable_data)
        if serializer.is_valid():
            serializer.save(lecturer=lecturer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OutlineViewSet(viewsets.ViewSet, generics.ListAPIView, generics.UpdateAPIView):
    queryset = Outline.objects.filter(active=True)
    serializer_class = serializers.OutlineSerializer
    pagination_class = paginators.ItemPaginator

    def get_permissions(self):
        if self.action in ['add_comment', 'add_evaluation', 'create_outline', 'add_course']:
            return [IsAuthenticated()]
        elif self.action in ['update', 'partial_update']:
            return [IsAuthenticated(), perms.IsLecturerAndOwner()]
        return [permissions.AllowAny()]

    @action(methods=['post'], url_path='create', detail=False)
    def create_outline(self, request):
        if not request.user.is_lecturer():
            return Response({"error": "Only lecturers can create outlines."},
                            status=status.HTTP_403_FORBIDDEN)
        lecturer = request.user.lecturer

        serializer = serializers.CreateOutlineSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            outline = Outline.objects.create(**validated_data, lecturer=lecturer)

            return Response(serializers.CreateOutlineSerializer(outline).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__('list'):
            q = self.request.query_params.get('q')  # tìm đề cương theo tên
            if q:
                queryset = queryset.filter(name__icontains=q)

            credit = self.request.query_params.get('credit')  # tìm đề cương theo tín chỉ
            if credit:
                queryset = queryset.filter(credit__icontains=credit)

            lecturer = self.request.query_params.get('lecturer')  # tìm đề cương theo tên giảng viên
            if lecturer:
                queryset = queryset.filter(lecturer__name__icontains=lecturer)

            course = self.request.query_params.get('course')  # tìm đề cương theo khóa học
            if course:
                queryset = queryset.filter(course__year__icontains=course)
        return queryset

    @action(methods=['get'], url_path='comment', detail=True)
    def get_comment(self, request, pk):
        comments = self.get_object().comment_set.select_related('student').all()

        paginator = paginators.CommentPaginator()
        page = paginator.paginate_queryset(comments, request)
        if page is not None:
            serializer = serializers.CommentSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        return Response(serializers.CommentSerializer(comments, many=True).data,
                        status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='comments', detail=True)
    def add_comment(self, request, pk):
        # Kiểm tra xem người dùng có phải là sinh viên không
        if not request.user.is_student():
            raise PermissionDenied("Only students can add comments.")

        # Lấy thông tin sinh viên hiện đang đăng nhập từ đối tượng request.user
        student = request.user.student

        outline = self.get_object()
        mutable_data = request.data.copy()

        # Thêm trường student vào dữ liệu request trước khi tạo comment
        mutable_data['student'] = student.id
        # Tạo một serializer mới và truyền đối tượng Student vào trường student
        serializer = serializers.CommentSerializer(data=mutable_data)
        if serializer.is_valid():
            # Lưu comment với đối tượng Student đã được tạo
            serializer.save(outline=outline, student=student)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['post'], url_path='evaluation', detail=True)
    def add_evaluation(self, request, pk):
        outline = self.get_object()
        # Kiểm tra xem người dùng là giảng viên hay không
        if not request.user.is_lecturer():
            return Response({"error": "Only lecturers can add evaluations."},
                            status=status.HTTP_403_FORBIDDEN)

        # Lấy thông tin giảng viên hiện đang đăng nhập
        lecturer = request.user

        if outline.lecturer != request.user.lecturer:
            return Response({"error": "You can only add evaluation to outlines you have created."},
                            status=status.HTTP_403_FORBIDDEN)

        evaluations = request.data.get('evaluation', [])

        if not evaluations:
            return Response({"error": "No evaluations provided."},
                            status=status.HTTP_400_BAD_REQUEST)

        total_new_percentage = 0
        for evaluation in evaluations:
            percentage = evaluation.get('percentage')
            if percentage is None:
                return Response({"error": "Each evaluation must have a percentage."},
                                status=status.HTTP_400_BAD_REQUEST)
            try:
                total_new_percentage += float(percentage)
            except (ValueError, TypeError):
                return Response({"error": "Percentage must be a number."},
                                status=status.HTTP_400_BAD_REQUEST)

        if total_new_percentage <= 0 or total_new_percentage > 100:
            return Response({"error": "Total percentage of new evaluations must be between 0 and 100."},
                            status=status.HTTP_400_BAD_REQUEST)

        existing_evaluations = outline.evaluation.all()
        current_total_percentage = sum(evaluation.percentage for evaluation in existing_evaluations)

        new_total_percentage = current_total_percentage + total_new_percentage

        if new_total_percentage != 100:
            return Response({"error": "Total percentage of all evaluations must equal 100."},
                            status=status.HTTP_400_BAD_REQUEST)

        if not (2 <= len(existing_evaluations) + len(evaluations) <= 5):
            return Response({"error": "Total number of evaluations must be between 2 and 5."},
                            status=status.HTTP_400_BAD_REQUEST)

        new_evaluations = []
        for evaluation_data in evaluations:
            # Lấy thông tin của đánh giá từ dữ liệu yêu cầu
            percentage = evaluation_data.get('percentage')
            method = evaluation_data.get('method')

            # Kiểm tra xem đánh giá đã tồn tại trong cơ sở dữ liệu hay chưa
            existing_evaluation = Evaluation.objects.filter(percentage=percentage, method=method).first()

            if existing_evaluation:
                # Nếu đánh giá đã tồn tại, thêm vào danh sách mới mà không cần tạo mới
                new_evaluations.append(existing_evaluation)
            else:
                evaluation_data['lecturer'] = lecturer.id
                evaluation_serializer = serializers.EvaluationSerializer(data=evaluation_data)
                if evaluation_serializer.is_valid():
                    new_evaluations.append(evaluation_serializer.save())
                else:
                    return Response(evaluation_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            for evaluation in new_evaluations:
                outline.evaluation.add(evaluation)

        return Response(serializers.EvaluationSerializer(new_evaluations, many=True).data,
                        status=status.HTTP_201_CREATED)

    @action(methods=['post'], detail=True, url_path='course')
    def add_course(self, request, pk):
        outline = self.get_object()
        # Kiểm tra xem người dùng là giảng viên hay không
        if not request.user.is_lecturer():
            return Response({"error": "Only lecturers can add course."},
                            status=status.HTTP_403_FORBIDDEN)

        # Lấy thông tin giảng viên hiện đang đăng nhập
        lecturer = request.user

        if outline.lecturer != request.user.lecturer:
            return Response({"error": "You can only add course to outlines you have created."},
                            status=status.HTTP_403_FORBIDDEN)

        courses = request.data.get('course', [])
        if not courses:
            return Response({"error": "No course provided."}, status=status.HTTP_400_BAD_REQUEST)

        new_course = []
        for course_data in courses:
            # Lấy thông tin của đánh giá từ dữ liệu yêu cầu
            year = course_data.get('year')

            # Kiểm tra xem đánh giá đã tồn tại trong cơ sở dữ liệu hay chưa
            existing_course = Course.objects.filter(year=year).first()

            if existing_course:
                # Nếu đánh giá đã tồn tại, thêm vào danh sách mới mà không cần tạo mới
                new_course.append(existing_course)
            else:
                course_data['lecturer'] = lecturer.id
                course_serializer = serializers.CourseSerializer(data=course_data)
                if course_serializer.is_valid():
                    new_course.append(course_serializer.save())
                else:
                    return Response(course_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            for course in new_course:
                outline.course.add(course)

        return Response(serializers.CourseSerializer(new_course, many=True).data,
                        status=status.HTTP_201_CREATED)

    @action(methods=['post'], detail=True, url_path='approve', permission_classes=[IsAdminUser])
    def approve_outline(self, request, pk):
        try:
            outline = self.get_object()
        except Outline.DoesNotExist:
            return Response({"error": "Outline not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = serializers.OutlineApprovalSerializer(outline, data={'is_approved': True}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Outline approved successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], url_path='download', detail=False)
    def download_outline(self, request):
        # Lấy danh sách các đề cương đã được xét duyệt
        approved_outlines = self.queryset.filter(is_approved=True)
        serializer = self.get_serializer(approved_outlines, many=True)
        return Response(serializer.data)


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser, ]

    def get_permissions(self):
        if self.action in ['current_user']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    def current_user(self, request):
        user = request.user
        if request.method.__eq__('PATCH'):
            for k, v in request.data.items():
                setattr(user, k, v)
            user.save()

        return Response(serializers.UserSerializer(user).data)


class StudentViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Student.objects.all()
    serializer_class = serializers.StudentSerializer


class CommentViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    permission_classes = [IsAuthenticated, perms.IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user.student)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.student.user != request.user:
            return Response({"error": "You do not have permission to delete this comment."},
                            status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.student.user != request.user:
            return Response({"error": "You do not have permission to edit this comment."},
                            status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
