from django.urls import path, include
from rest_auth.views import (
    LoginView, LogoutView, PasswordResetView, PasswordResetConfirmView
)
from rest_auth.registration.views import RegisterView

from user.views import CustomPasswordChangeView, UserProfileView, django_rest_auth_null, VerifyEmailView

app_name = 'user'

urlpatterns = [
    path('login/', LoginView.as_view(), name='rest_login'),
    path('logout/', LogoutView.as_view(), name='rest_logout'),
    path('password/change/', CustomPasswordChangeView.as_view(),
         name='rest_password_change'),
    path('password/reset/', PasswordResetView.as_view(),
         name='rest_password_reset'),
    # path('password/reset/confirm/', PasswordResetConfirmView.as_view(),
    #      name='password_reset_confirm'),
    # path('password/reset/confirm/', django_rest_auth_null,
    #      name='password_reset_confirm'),
    path('registration/', include('rest_auth.registration.urls')),
    path('registration/account-email-verification-sent/', django_rest_auth_null, name='account_email_verification_sent'),
    path('password-reset/confirm/<str:uidb64>)/<str:token>/', django_rest_auth_null, name='password_reset_confirm'),
    path('user/', UserProfileView.as_view(), name='rest_user_details'),
]
