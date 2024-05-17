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
    avatar = CloudinaryField()
    ROLE_CHOICES = (
        ('admin', 'Quản trị viên'),
        ('lecturer', 'Giảng viên'),
        ('student', 'Sinh viên'),
    )

    # Trường mở rộng để lưu vai trò của người dùng
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    # Xác định xem người dùng có phải là quản trị viên hay không
    def is_admin(self):
        return self.role == 'admin'

    # Xác định xem người dùng có phải là giảng viên hay không
    def is_lecturer(self):
        return self.role == 'lecturer'

    def is_student(self):
        return self.role == 'student'


class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Evaluation(BaseModel):
    percentage = models.FloatField()
    method = models.CharField(max_length=255)
    note = models.CharField(max_length=255)


class Lecturer(models.Model):
    name = models.CharField(max_length=255)
    position = models.CharField(max_length=255)
    is_approved = models.BooleanField(default=False) # nhớ thêm vào
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Lesson(BaseModel):
    subject = models.CharField(max_length=255)
    lecturer = models.ForeignKey(Lecturer, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)

    def __str__(self):
        return self.subject


class Course(BaseModel):
    year = models.IntegerField(unique=True)

    lessons = models.ManyToManyField(Lesson)


class Outline(BaseModel):
    name = models.CharField(max_length=255)
    credit = models.IntegerField()
    overview = RichTextField()
    is_approved = models.BooleanField(default=False) # nhớ thêm vào
    evaluation = models.ManyToManyField(Evaluation)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    lecturer = models.ForeignKey(Lecturer, on_delete=models.CASCADE)
    course = models.ManyToManyField(Course)

    def __str__(self):
        return self.name


class Student(models.Model):
    fullname = models.CharField(max_length=255)
    age = models.CharField(max_length=2)
    sex = models.BooleanField(default=True) #true is female, false is male
    is_approved = models.BooleanField(default=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.PROTECT)
    lessons = models.ManyToManyField(Lesson)
    outline = models.ManyToManyField(Outline)


class Interaction(BaseModel):
    outline = models.ForeignKey(Outline, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class Comment(Interaction):
    content = models.TextField()


class Chat(BaseModel):
    lecturer= models.ForeignKey(Lecturer, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
