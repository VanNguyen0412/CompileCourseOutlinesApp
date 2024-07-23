from django.contrib import admin
from courseoutline.models import *
from django import forms
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from oauth2_provider.models import Application, AccessToken, Grant, IDToken, RefreshToken
import cloudinary


class OutlineAppAdminSite(admin.AdminSite):
    site_header = "HỆ THỐNG QUẢN LÝ BIÊN SOẠN ĐỀ CƯƠNG"


admin_site = OutlineAppAdminSite('myapartment')


class OutlineForm(forms.ModelForm):
    overview = forms.CharField(widget=CKEditorUploadingWidget)

    class Meta:
        model = Outline
        fields = "__all__"


class LecturerAdmin(admin.ModelAdmin):
    list_display = ['id', 'first_name', 'last_name', 'age', 'code', 'position', 'account']
    search_fields = ['last_name']
    list_filter = ['last_name']


class OutlineAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'credit', 'lecturer', 'is_approved']
    search_fields = ['name', 'credit']
    list_filter = ['name']
    form = OutlineForm
    actions = ['approve_outline']

    def evaluation_list(self, obj):
        return ", ".join([f"{eval.method} ({eval.percentage}%)" for eval in obj.evaluation.all()])

    evaluation_list.short_description = 'Evaluation'

    list_display.append('evaluation_list')

    def approve_outline(self, request, querry):
        querry.update(is_approved=True)
        self.message_user(request, "Selected proposals have been approved.")

    approve_outline.short_description = "Approve selected proposals"


class StudentAdmin(admin.ModelAdmin):
    list_display = ['id', 'first_name', 'last_name', 'age', 'code', 'account']
    search_fields = ['last_name']
    list_filter = ['last_name', 'age']


class EvaluationAdmin(admin.ModelAdmin):
    list_display = ['id', 'percentage', 'method']
    search_fields = ['method']
    list_filter = ['percentage']


class LessonAdmin(admin.ModelAdmin):
    list_display = ['id', 'subject', 'active', 'created_date']
    search_fields = ['subject']
    list_filter = ['subject']


class CommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'content', 'outline', 'created_date', 'student_name']
    search_fields = ['student_name']

    def student_name(self, obj):
        return obj.student.last_name

    student_name.short_description = 'Student'


class CourseAdmin(admin.ModelAdmin):
    list_display = ['id', 'year']

class AccountAdmin(admin.ModelAdmin):
    list_display = ['id', 'username']

admin_site.register(Course, CourseAdmin)
admin_site.register(Category)
admin_site.register(Account, AccountAdmin)
admin_site.register(Outline, OutlineAdmin)
admin_site.register(Lesson, LessonAdmin)
admin_site.register(Lecturer, LecturerAdmin)
admin_site.register(Evaluation, EvaluationAdmin)
admin_site.register(Student, StudentAdmin)
admin_site.register(Comment, CommentAdmin)
admin_site.register(Application)
admin_site.register(AccessToken)
admin_site.register(Grant)
admin_site.register(IDToken)
admin_site.register(RefreshToken)
