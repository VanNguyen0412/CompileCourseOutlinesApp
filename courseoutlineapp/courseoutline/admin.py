from django.contrib import admin
from django.utils.safestring import mark_safe

from courseoutline.models import Course, Category, Outline, Lesson, Lecturer, Evaluation, Student
from django import forms
from ckeditor_uploader.widgets import CKEditorUploadingWidget
import cloudinary


class CourseForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditorUploadingWidget)

    class Meta:
        model = Course
        fields = '__all__'


class CourseAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'active', 'created_date', 'updated_date']
    search_fields = ['name']
    list_filter = ['id', 'name', 'created_date']
    readonly_fields = ['my_image']
    form = CourseForm

    def my_image(self, course):
        if course.image:
            if type(course.image) is cloudinary.CloudinaryResource:
                return mark_safe(f"<img width='300' src='{course.image.url}' />")
            return mark_safe(f"<img width='300' src='/static/{course.image.name}' />")

    class Media:
        css = {
            'all': ['/static/css/style.css']
        }


admin.site.register(Course)
admin.site.register(Category)
admin.site.register(Outline)
admin.site.register(Lesson)
admin.site.register(Lecturer)
admin.site.register(Evaluation)
admin.site.register(Student)

# Register your models here.
