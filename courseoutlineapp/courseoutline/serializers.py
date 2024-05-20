<<<<<<< HEAD
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
=======
>>>>>>> 5d0ca0573ab2456c38c12986f1a769647c6f4ca5
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from rest_framework import serializers
from courseoutline.models import *
<<<<<<< HEAD

User = get_user_model()


class ItemSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        req = super().to_representation(instance)
        req['image'] = instance.image.url

        return req
=======
from django.contrib.auth import get_user_model
>>>>>>> 5d0ca0573ab2456c38c12986f1a769647c6f4ca5


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['year']
<<<<<<< HEAD


class AccountSerializer(serializers.ModelSerializer):
    code = serializers.IntegerField(required=True, write_only=True)

    # email = serializers.EmailField(required=True)

    class Meta:
        model = Account
        fields = ['id', 'email', 'username', 'password', 'avatar', 'role', 'date_joined', 'code', 'is_approved']
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


class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = ['id', 'percentage', 'method']


class StudentAccountSerializer(AccountSerializer):
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
=======
>>>>>>> 5d0ca0573ab2456c38c12986f1a769647c6f4ca5


class UserSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        data = validated_data.copy()
        u = User(**data)
        u.set_password(u.password)
        u.save()

        return u

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.avatar:
            rep['avatar'] = instance.avatar.url

        return rep

    class Meta:
        model = User
<<<<<<< HEAD
        fields = ['id', 'code', 'first_name', 'last_name', 'age', 'gender', 'created_date', 'updated_date']


class StudentSerializer(UserSerializer):
    class Meta:
        model = Student
        fields = UserSerializer.Meta.fields


class LecturerSerializer(UserSerializer):
    class Meta:
        model = Lecturer
        fields = UserSerializer.Meta.fields + ['position']


class ApprovalSerializer(AccountSerializer):
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
=======
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'password', 'avatar', 'role']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


class LecturerSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Lecturer
        fields = ['id', 'name', 'user']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data, role='lecturer')
        teacher = Lecturer.objects.create(user=user, **validated_data)
        return teacher


class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = ['id', 'percentage', 'method']
>>>>>>> 5d0ca0573ab2456c38c12986f1a769647c6f4ca5


class OutlineSerializer(serializers.ModelSerializer):
    course = CourseSerializer(many=True)
    evaluation = EvaluationSerializer(many=True)

<<<<<<< HEAD
    def to_representation(self, instance):
        req = super().to_representation(instance)
        req['image'] = instance.image.url

        return req

    class Meta:
        model = Outline
        fields = ['id', 'name', 'credit', 'overview', 'created_date', 'image', 'lecturer', 'course',
                  'lesson', 'evaluation']
        read_only_fields = ['lecturer']

    def create(self, validated_data):
        raise NotImplementedError("Use OutlineViewSet.create_outline to create outlines.")
=======
    class Meta:
        model = Outline
        fields = ['id', 'name', 'credit', 'overview', 'created_date', 'updated_date', 'lecturer', 'course',
                  'lesson', 'evaluation']
        read_only_fields = ['lecturer']

    def create(self, validated_data):
        raise NotImplementedError("Use OutlineViewSet.create_outline to create outlines.")


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'fullname', 'user', 'is_approved']
        read_only_fields = ['is_approved']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = UserSerializer.create(UserSerializer(), validated_data=user_data)
        student, created = Student.objects.update_or_create(user=user)
        return student

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user')
        user = instance.user

        instance.name = validated_data.get('name', instance.name)
        instance.is_approved = validated_data.get('is_approved', instance.is_approved)

        user.set_password(user_data['password'])
        user.avatar = user_data['avatar']
        user.save()

        instance.save()
        return instance
>>>>>>> 5d0ca0573ab2456c38c12986f1a769647c6f4ca5


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'
        read_only_fields = ['lecturer', 'created_date', 'updated_date']


<<<<<<< HEAD
=======
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'content', 'outline', 'created_date', 'updated_date', 'student']
        read_only_fields = ['student', 'outline']


>>>>>>> 5d0ca0573ab2456c38c12986f1a769647c6f4ca5
class OutlineApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Outline
        fields = ['is_approved']


class CreateOutlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Outline
        fields = ['id', 'name', 'credit', 'overview', 'created_date', 'updated_date', 'lecturer',
                  'lesson']
        read_only_fields = ['lecturer']
<<<<<<< HEAD


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'content', 'outline', 'created_date', 'updated_date', 'student']
        read_only_fields = ['student', 'outline']
=======
>>>>>>> 5d0ca0573ab2456c38c12986f1a769647c6f4ca5
