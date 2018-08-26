from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class CustomPagination(PageNumberPagination):
    def get_paginated_response(self, data):
        return Response({
            'num_pages': self.page.paginator.num_pages,
            'count': self.page.paginator.count,
            'results': data
        })


class PostsPagination(CustomPagination):
    page_size = 12
