# backend/users/forms.py

from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    """Form for creating new users by admin."""

    class Meta:
        model = CustomUser
        fields = ('email', 'role')

class CustomUserChangeForm(UserChangeForm):
    """Form for updating existing users by admin."""

    class Meta:
        model = CustomUser
        fields = ('email', 'role', 'is_active', 'is_staff')