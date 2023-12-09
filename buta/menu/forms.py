# forms.py
from django import forms
from .models import Review

class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['full_name', 'email', 'text']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['full_name'].widget.attrs.update({'placeholder': 'Ad Soyad'})
        self.fields['email'].widget.attrs.update({'placeholder': 'e-mail'})
        self.fields['text'].widget.attrs.update({'placeholder': 'Mətn'})
