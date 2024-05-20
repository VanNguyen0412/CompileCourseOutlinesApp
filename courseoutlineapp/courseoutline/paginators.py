from rest_framework import pagination


class ItemPaginator(pagination.PageNumberPagination):
<<<<<<< HEAD
    page_size = 4
=======
    page_size = 5
>>>>>>> 5d0ca0573ab2456c38c12986f1a769647c6f4ca5


class CommentPaginator(pagination.PageNumberPagination):
    page_size = 3