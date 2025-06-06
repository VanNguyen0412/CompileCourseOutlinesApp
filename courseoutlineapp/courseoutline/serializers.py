from django.contrib.auth import get_user_model
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework import serializers
from courseoutline.models import *

User = get_user_model()


class LessonNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'subject']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['year']


class AccountSerializer(serializers.ModelSerializer):
    code = serializers.IntegerField(required=True, write_only=True)
    email = serializers.EmailField(required=True)

    def to_representation(self, instance):
        req = super().to_representation(instance)
        if instance.avatar:
            req['avatar'] = instance.avatar.url
        return req

    # email = serializers.EmailField(required=True)
    class Meta:
        model = Account
        fields = ['id', 'email', 'username', 'password', 'avatar', 'role', 'date_joined', 'code', 'is_approved',
                  'is_staff']
        extra_kwargs = {
            "password": {
                "write_only": True,
            },
            "role": {
                "read_only": True,
            },
            "date_joined": {
                "read_only": True,
            },
            "is_approved": {
                "read_only": True,
            }
        }


class AccountSerializer1(serializers.ModelSerializer):
    code = serializers.IntegerField(required=True, write_only=True)

    def to_representation(self, instance):
        req = super().to_representation(instance)
        if instance.avatar:
            req['avatar'] = instance.avatar.url
        return req

    # email = serializers.EmailField(required=True)
    class Meta:
        model = Account
        fields = ['id', 'email', 'username', 'password', 'avatar', 'role', 'date_joined', 'code', 'is_approved',
                  'is_staff']
        extra_kwargs = {
            "password": {
                "write_only": True,
            },
            "role": {
                "read_only": True,
            },
            "date_joined": {
                "read_only": True,
            },
            "is_approved": {
                "read_only": True,
            }
        }


class AccountSerializer2(serializers.ModelSerializer):
    code = serializers.IntegerField(required=True, write_only=True)

    # email = serializers.EmailField(required=True)
    class Meta:
        model = Account
        fields = ['id', 'email', 'username', 'password', 'avatar', 'role', 'date_joined', 'code', 'is_approved',
                  'is_staff']
        extra_kwargs = {
            "password": {
                "write_only": True,
            },
            "role": {
                "read_only": True,
            },
            "date_joined": {
                "read_only": True,
            },
            "is_approved": {
                "read_only": True,
            }
        }


class LecturerAccountSerializer(AccountSerializer):
    avatar = serializers.ImageField(required=True, allow_null=False, allow_empty_file=False)

    class Meta:
        model = AccountSerializer.Meta.model
        fields = AccountSerializer.Meta.fields
        extra_kwargs = AccountSerializer.Meta.extra_kwargs

    def create(self, validated_data):
        code = f'{validated_data.pop("code"):06d}'
        lecturer = get_object_or_404(Lecturer, code=code)
        validated_data['role'] = Account.Role.LECTURER
        account = Account(**validated_data)
        account.set_password(account.password)
        account.save()
        lecturer.account = account
        lecturer.save()
        return account


class StudentNameSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    account = AccountSerializer1()

    class Meta:
        model = Student
        fields = ['id', 'first_name', 'last_name', 'full_name', 'account', 'age', 'gender', 'code', 'avatar']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def get_avatar(self, obj):
        if obj.account:
            if obj.account.avatar:
                return obj.account.avatar.url
            return None
        return None


class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = ['id', 'percentage', 'method']


class StudentAccountSerializer(AccountSerializer1):
    class Meta:
        model = AccountSerializer.Meta.model
        fields = AccountSerializer.Meta.fields
        extra_kwargs = AccountSerializer.Meta.extra_kwargs

    def create(self, validated_data):
        code = f"{validated_data.pop('code'):06d}"
        validated_data['is_approved'] = True
        student = get_object_or_404(Student, code=code)
        account = Account(**validated_data)
        account.set_password(account.password)
        account.save()
        student.account = account
        student.save()
        return account


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'code', 'first_name', 'last_name', 'age', 'gender', 'created_date', 'updated_date']
        read_only_fields = ['id', 'created_date', 'updated_date']


class StudentSerializer(UserSerializer):
    class Meta:
        model = Student
        fields = UserSerializer.Meta.fields + ['email', 'account_id']


class LecturerSerializer(UserSerializer):
    class Meta:
        model = Lecturer
        fields = UserSerializer.Meta.fields + ['position', 'email', 'account_id']
        read_only_fields = ['account_id']


class ApprovalSerializer(AccountSerializer2):
    code = serializers.IntegerField(required=True, write_only=True)
    student = StudentSerializer(read_only=True)

    class Meta:
        model = Approval
        fields = ['id', 'is_approved', 'student', 'code']

    def create(self, validated_data):
        code = f"{validated_data.pop('code'):06d}"
        student = get_object_or_404(Student, code=code)
        try:
            approval = Approval.objects.create(student=student)
        except IntegrityError:
            raise ValidationError({"message": "Yeu cau dang duoc cho xu ly"})
        return approval


class LecturerNameSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    account = AccountSerializer1()

    class Meta:
        model = Lecturer
        fields = ['first_name', 'last_name', 'full_name', 'account', 'position', 'age', 'gender', 'code']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"


class OutlineSerializer(serializers.ModelSerializer):
    course = CourseSerializer(many=True)
    evaluation = EvaluationSerializer(many=True)
    lecturer = LecturerNameSerializer()
    lesson = LessonNameSerializer()

    def to_representation(self, instance):
        req = super().to_representation(instance)
        if instance.image:
            req['image'] = instance.image.url

        return req

    class Meta:
        model = Outline
        fields = ['id', 'name', 'credit', 'overview', 'created_date', 'image', 'lecturer', 'course',
                  'lesson', 'evaluation', 'is_approved']
        read_only_fields = ['lecturer', 'is_approved']

    def create(self, validated_data):
        raise NotImplementedError("Use OutlineViewSet.create_outline to create outlines.")


class LessonSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    outline = OutlineSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', 'subject', 'created_date', 'updated_date', 'category', 'outline']
        read_only_fields = ['lecturer', 'created_date', 'updated_date']


class LessonCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'
        read_only_fields = ['lecturer', 'created_date', 'updated_date']


class CommentSerializer(serializers.ModelSerializer):
    student = StudentNameSerializer()

    class Meta:
        model = Comment
        fields = ['id', 'content', 'outline', 'created_date', 'updated_date', 'student']
        read_only_fields = ['student', 'outline']


class AddCommentSerializer(serializers.ModelSerializer):
    # student = StudentNameSerializer()
    # account = AccountSerializer1()
    class Meta:
        model = Comment
        fields = ['id', 'content', 'outline', 'created_date', 'updated_date', 'student']
        read_only_fields = ['student', 'outline']


class OutlineApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Outline
        fields = ['is_approved']


class CreateOutlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Outline
        fields = ['id', 'name', 'credit', 'overview', 'created_date', 'updated_date', 'lecturer',
                  'lesson', 'image']
        read_only_fields = ['lecturer']


class OutlineEvaluationSerializer(serializers.ModelSerializer):
    evaluation = EvaluationSerializer(many=True)

    class Meta:
        model = Outline
        fields = ['evaluation']
