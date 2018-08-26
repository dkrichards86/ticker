from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from django.utils.translation import ugettext_lazy as _
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.schemas import AutoSchema
import coreapi
import coreschema

from rest_auth.app_settings import PasswordChangeSerializer
from rest_auth.views import UserDetailsView
from user.serializers import UserDetailsSerializer

from allauth.account.models import EmailConfirmation, EmailConfirmationHMAC
from rest_auth.registration.serializers import VerifyEmailSerializer
from rest_framework import status
from rest_framework.decorators import api_view, APIView
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet


@api_view()
def django_rest_auth_null(*args):
    return Response(status=status.HTTP_400_BAD_REQUEST)


class VerifyEmailView(APIView):
    permission_classes = (AllowAny,)
    allowed_methods = ('POST', 'OPTIONS', 'HEAD')

    def get_serializer(self, *args, **kwargs):
        return VerifyEmailSerializer(*args, **kwargs)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.kwargs['key'] = serializer.validated_data['key']
        try:
            confirmation = self.get_object()
            confirmation.confirm(self.request)
            return Response({'detail': _('Successfully confirmed email.')}, status=status.HTTP_200_OK)
        except EmailConfirmation.DoesNotExist:
            return Response({'detail': _('Error. Incorrect key.')}, status=status.HTTP_404_NOT_FOUND)

    def get_object(self, queryset=None):
        key = self.kwargs['key']
        emailconfirmation = EmailConfirmationHMAC.from_key(key)
        if not emailconfirmation:
            if queryset is None:
                queryset = self.get_queryset()
            try:
                emailconfirmation = queryset.get(key=key.lower())
            except EmailConfirmation.DoesNotExist:
                raise EmailConfirmation.DoesNotExist
        return emailconfirmation

    def get_queryset(self):
        qs = EmailConfirmation.objects.all_valid()
        qs = qs.select_related("email_address__user")
        return qs


class CustomPasswordChangeView(GenericAPIView):
    serializer_class = PasswordChangeSerializer
    permission_classes = (IsAuthenticated,)

    schema = AutoSchema(
        manual_fields=[
            coreapi.Field("curr_password", description="Current Password",
                          location="form", required=True,
                          schema=coreschema.String())
        ]
    )

    def post(self, request, *args, **kwargs):
        data = {
            'new_password1': request.data.get('new_password1'),
            'new_password2': request.data.get('new_password2')
        }
        if (check_password(request.data.get('curr_password'),
                           self.request.user.password)):
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({"detail": _("New password has been saved.")})
        else:
            return Response({"detail": _("New password has not been saved.")})


class UserProfileView(UserDetailsView):
    serializer_class = UserDetailsSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        queryset = get_user_model().objects.select_related('profile').first()
        return queryset
