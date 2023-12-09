from django.contrib import admin
from .models import Category, Subcategory, MenuItem, Review

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Subcategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')
    search_fields = ('name',)

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'description','price')
    search_fields = ('name',)

@admin.register(Review)
class ReviewItemAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email','created_at')
    search_fields = ('full_name',)


