from django.contrib import admin
from django.views.generic.base import TemplateView
from django.urls import include, path, re_path
from rest_framework.documentation import include_docs_urls
from allauth.account.views import confirm_email

from user.views import CustomPasswordChangeView, UserProfileView, django_rest_auth_null, VerifyEmailView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('docs/', include_docs_urls(title='Ticker webapp', public=False)),
    path('api/', include('api.urls', namespace='api')),
    path('api/auth/', include('rest_auth.urls')),
    path('api/auth/registration/', include('rest_auth.registration.urls')),
    path('api/auth/registration/account-email-verification-sent/', django_rest_auth_null, name='account_email_verification_sent'),
    path('api/auth/password-reset/confirm/<str:uidb64>)/<str:token>/', django_rest_auth_null, name='password_reset_confirm'),
    path('api/auth/user/', UserProfileView.as_view(), name='rest_user_details'),
]
