from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator
from rest_framework.serializers import (ModelSerializer, EmailField, CharField)


class UserDetailsSerializer(ModelSerializer):
    location = CharField(source="profile.location", required=False)
    email = EmailField(validators=[UniqueValidator(queryset=get_user_model().objects.all())])

    class Meta:
        model = get_user_model()
        fields = ('username', 'email', 'first_name', 'last_name', 'location',)

    def _update_profile(self, instance, profile_data):
        location = profile_data.pop('location', None)
        if location:
            instance.location = location

        instance.save()

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})

        self._update_profile(instance.profile, profile_data)

        return super(UserDetailsSerializer, self).update(instance, validated_data)
