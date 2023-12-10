# Generated by Django 4.2.7 on 2023-12-09 16:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('menu', '0003_remove_review_first_name_remove_review_last_name_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='name_en',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='category',
            name='name_ru',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='menuitem',
            name='description_en',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='menuitem',
            name='description_ru',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='menuitem',
            name='name_en',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='menuitem',
            name='name_ru',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='subcategory',
            name='name_en',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='subcategory',
            name='name_ru',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
