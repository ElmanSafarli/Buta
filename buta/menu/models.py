from django.db import models
from django import forms

class Category(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Subcategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.category} - {self.name}"

class MenuItem(models.Model):
    subcategory = models.ForeignKey(Subcategory, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    image = models.ImageField(upload_to='menu_images/', null=True, blank=True)

    def __str__(self):
        return f"{self.subcategory} - {self.name}"


class MenuItemDIP(models.Model):
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    image1 = models.ImageField(upload_to='menu_images/')
    price1 = models.DecimalField(max_digits=5, decimal_places=2)
    image2 = models.ImageField(upload_to='menu_images/')
    price2 = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.menu_item.name} - {self.price1}"

class Review(models.Model):
    full_name = models.CharField(max_length=100, verbose_name='Ad Soyad')
    email = models.EmailField(verbose_name='e-mail')
    text = models.TextField(max_length=315, verbose_name='Mətn')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.created_at}"