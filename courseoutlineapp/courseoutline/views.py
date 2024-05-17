from rest_framework import viewsets, generics, parsers, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from courseoutline import perms
from courseoutline import serializers
from courseoutline.models import Course, Category, Outline, Lesson, Account, Approval


# from rest_framework.permissions import IsAdminUser


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

            lecturer = self.request.query_params.get('lecturer')  # tìm đề cương theo tên giảng viên
            if lecturer:
                queryset = queryset.filter(lecturer_id=lecturer)

            course = self.request.query_params.get('course')  # tìm đề cương theo khóa học
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


class AccountViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView):
    queryset = Account.objects.filter(is_active=True)
    serializer_class = serializers.AccountSerializer
    parser_classes = [parsers.MultiPartParser, ]

    def get_permissions(self):
        if self.action in ['get_pending', 'approve_account_lecturer']:
            return [perms.IsAdminPerms()]
        return [permissions.AllowAny()]

    @action(methods=['get'], detail=False, url_path='pending')
    def get_pending(self, request):  # Quan tri vien
        accounts = self.queryset.filter(is_approved=False)
        return Response(serializers.AccountSerializer(accounts, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['post'], detail=False, url_path='lecturer')
    def create_account_lecturer(self, request):  # Giang vien
        serializer = serializers.LecturerAccountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(data={"message": "Dang ky thanh cong, cho xet duyet", "account": serializer.data},
                        status=status.HTTP_201_CREATED)

    @action(methods=['post'], detail=True, url_path='confirm')
    def approve_account_lecturer(self, request, pk=None):  # Quan tri vien
        account = self.get_object()
        account.is_approved = True
        account.save()
        return Response(data={'message': f'Tài khoản của {account.username} đã được xét duyệt thành công.'},
                        status=status.HTTP_200_OK)


class ApprovalViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Approval.objects.filter(active=True)
    serializer_class = serializers.ApprovalSerializer

    def get_permissions(self):
        if self.action in ['approve_student_request']:
            return [perms.IsAdminPerms()]
        return [permissions.AllowAny()]

    @action(methods=['post'], detail=False, url_path='student')
    def student_request(self, request):  # Sinh vien
        serializer = serializers.ApprovalSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(data={"message": "Gui yeu cau thanh cong", "approval": serializer.data},
                        status=status.HTTP_200_OK)

    @action(methods=['post'], detail=True, url_path='confirm')
    def approve_student_request(self, request, pk=None):  # Quan tri vien
        data = {
            "email": request.data.get('email'),
            "username": request.data.get('username'),
            "password": request.data.get('password'),
        }
        approve = self.get_object()
        code = approve.student.code
        data['code'] = code
        serializer = serializers.StudentAccountSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        approve.is_approved = True
        approve.save()
        return Response(data={"message": "Xet duyet thanh cong", "account": serializer.data})

# class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
#     queryset = User.objects.filter(is_active=True)
#     serializer_class = serializers.UserSerializer
#     parser_classes = [parsers.MultiPartParser]
#
#     # parser_classes = (FormParser, MultiPartParser, JSONParser)
#
#     @action(methods=['put'], detail=True)
#     def upload_avatar(self, request, pk=None):
#         user = self.get_object()
#         avatar = request.data.get('avatar')
#         if avatar:
#             # Xử lý tải lên avatar và lưu thông tin vào student
#             user.avatar = avatar
#             user.save()
#             return Response({'message': 'Avatar uploaded successfully.'})
#         else:
#             return Response({'message': 'Avatar field is required.'})


# class StudentAccountViewSet(UserViewSet, viewsets.ViewSet):
#     queryset = Student.objects.all()
#     serializer_class = serializers.StudentSerializer
#
#     def get_permissions(self):
#         if self.action in ['upload_avatar', 'update_password']:
#             return [permissions.IsAuthenticated()]
#         return [permissions.AllowAny()]
#
#     class StudentIsApproved(permissions.BasePermission):
#         def has_object_permission(self, request, view, obj):
#             return obj.is_approved
#
#     @action(methods=['put'], detail=True)
#     def update_password(self, request, pk=None):
#         student = self.get_object()
#         password = request.data.get('password')
#         if password:
#             student.user.set_password(password)
#             student.user.save()
#             return Response({'message': 'Password updated successfully.'})
#         else:
#             return Response({'message': 'Password field is required.'})
#
#     @action(methods=['get'], url_path='outline', detail=False)
#     def download_outline(self):
#         pass
#
#
# class StudentViewSet(viewsets.ViewSet, generics.ListAPIView):
#     queryset = Student.objects.all()
#     serializer_class = serializers.StudentSerializer
#
#     @action(methods=['post'], detail=False)
#     def create_student(self, request):
#         student = Student.objects.create(is_approved=False)
#         # Thông báo thành công cho sinh viên
#         return Response({'message': 'Yêu cầu tạo tài khoản đã được gửi.'})
#
#
# class LecturerAccountViewSet(UserViewSet, viewsets.ViewSet):
#     queryset = Lecturer.objects.all()
#     serializer_class = serializers.LecturerSerializer
#
#     def get_permissions(self):
#         if self.action in ['upload_avatar']:
#             return [permissions.IsAuthenticated()]
#         return [permissions.AllowAny()]
#
#     class LecturerIsApproved(permissions.BasePermission):
#         def has_object_permission(self, request, view, obj):
#             return obj.is_approved
#
#
# class LecturerViewSet(viewsets.ViewSet, generics.CreateAPIView):
#     queryset = Lecturer.objects.all()
#     serializer_class = serializers.LecturerSerializer
#
#     def create(self, request):
#         serializer = self.get_serializer(data=request.data)
#         if serializer.is_valid():
#             lecturer = serializer.save(is_approved=False)
#             # Thông báo cho quản trị viên về yêu cầu tạo tài khoản giảng viên
#             return Response({'status': 'success', 'message': 'Yêu cầu tạo tài khoản giảng viên đã được gửi.'})
#         return Response({'status': 'error', 'message': serializer.errors})
