from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import TodoSerializer
from django.contrib.auth.models import User
from .models import Todo

# Create your views here.
def HomeView(request):
    return render(request, "index.html")

class UserView(APIView):
    authentication_classes = [JWTAuthentication,]
    permission_classes = []

    def get(self, request):
        if request.user.is_authenticated:
            return Response({"username": request.user.username}, 200)
        else:
            return Response({}, 401)

class RegisterView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        data = {}
        if request.data["username"] and not User.objects.filter(username=request.data["username"]).exists():
            if request.data["email"] and not User.objects.filter(email=request.data["email"]).exists():
                User.objects.create_user(request.data["username"], request.data["email"], request.data["password"])
                return Response(data)
            else:
                data["error"] = "emailExists"
                return Response(data, 409)
        else:
            data["error"] = "usernameExists"
            return Response(data, 409)

class TodoView(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    authentication_classes = [JWTAuthentication,]
    
    def get_queryset(self):
        user = self.request.user
        return Todo.objects.filter(user=user)
    
    def create(self, request):
        user = self.request.user
        serializer = TodoSerializer(data=self.request.data)
        if user.is_authenticated:
            if serializer.is_valid():
                Todo.objects.create(user=user, title=serializer.validated_data.get("title"), description=serializer.validated_data.get("description"), completed=serializer.validated_data.get("completed"))
                return Response({}, 200)
            else:
                return Response({}, 400)
        else:
            return Response({}, 401)
