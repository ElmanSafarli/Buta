from modeltranslation.translator import register, TranslationOptions
from .models import Category, Subcategory, MenuItem, MenuItemDIP


@register(Category)
class CategoryTranslationOptions(TranslationOptions):
    fields = ('name',)


@register(Subcategory)
class ActorTranslationOptions(TranslationOptions):
    fields = ('name',)


@register(MenuItem)
class GenreTranslationOptions(TranslationOptions):
    fields = ('name', 'description')


