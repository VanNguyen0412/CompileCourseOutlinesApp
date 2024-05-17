from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from rest_framework import serializers
from courseoutline.models import *
from django.contrib.auth import get_user_model


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['year']


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


class OutlineSerializer(serializers.ModelSerializer):
    course = CourseSerializer(many=True)
    evaluation = EvaluationSerializer(many=True)

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


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'
        read_only_fields = ['lecturer', 'created_date', 'updated_date']


class CommentSerializer(serializers.ModelSerializer):
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
                  'lesson']
        read_only_fields = ['lecturer']
