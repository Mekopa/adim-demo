# backend/users/views.py

from rest_framework import generics
from .models import CustomUser
from .serializers import UserSerializer
from rest_framework.permissions import IsAdminUser

class UserListCreateView(generics.ListCreateAPIView):
    """View for listing all users and creating a new user (admin only)."""
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]