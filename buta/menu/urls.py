from django.urls import path
from .views import MenuPage, HomePage, send_to_telegram, send_to_telegram_view

urlpatterns = [
    path('', HomePage.as_view(), name='home'),
    path('menu/', MenuPage.as_view(), name='menu'),
    path('send-to-telegram/', send_to_telegram_view, name='send_to_telegram'),
    # path('submit_review/', ReviewSubmissionView.as_view(), name='submit_review'),
]
