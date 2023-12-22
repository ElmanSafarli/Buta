from django.urls import path
from .views import MenuPage, HomePage, ContactPage, send_to_telegram_view, send_contact_form_to_telegram

urlpatterns = [
    path('', HomePage.as_view(), name='home'),
    path('menu/', MenuPage.as_view(), name='menu'),
    path('contact/', ContactPage.as_view(), name='contact'),
    path('send-to-telegram/', send_to_telegram_view, name='send_to_telegram'),
    path('contact/send-contact-form-to-telegram/', send_contact_form_to_telegram, name='send_contact_form_to_telegram'),
    # path('submit_review/', ReviewSubmissionView.as_view(), name='submit_review'),
]
