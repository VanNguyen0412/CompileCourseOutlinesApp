from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField
from ckeditor.fields import RichTextField


class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True
        ordering = ['-id']


class User(AbstractUser):
    avatar = CloudinaryField(null=True)


class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Outline(BaseModel):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Evaluation(BaseModel):
    percentage = models.CharField(max_length=255)
    method = models.CharField(max_length=255)
    note = models.CharField(max_length=255)


class Lecture(models.Model):
    name = models.CharField(max_length=255)
    position = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    avatar = CloudinaryField()
    evaluation = models.ForeignKey(Evaluation, on_delete=models.CASCADE)
    outline = models.ForeignKey(Outline, on_delete=models.CASCADE)
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Lesson(BaseModel):
    subject = models.CharField(max_length=255)
    credit = models.IntegerField()
    overview = RichTextField()
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE)

    def __str__(self):
        return self.subject


class Course(BaseModel):
    name = models.CharField(max_length=255)
    description = RichTextField()
    year = models.IntegerField()
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    outline = models.ForeignKey(Outline, on_delete=models.PROTECT)
    lessons = models.ManyToManyField(Lesson)


class Student(models.Model):
    fullname = models.CharField(max_length=255)
    age = models.CharField(max_length=2)
    sex = models.BooleanField(default=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.PROTECT)
    lessons = models.ManyToManyField(Lesson)


class Interaction(BaseModel):
    outline = models.ForeignKey(Outline, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class Comment(Interaction):
    content = models.CharField(max_length=255)


class Chat(BaseModel):
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
