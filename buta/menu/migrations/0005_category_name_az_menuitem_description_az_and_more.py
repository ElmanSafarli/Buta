# Generated by Django 4.2.7 on 2023-12-09 16:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('menu', '0004_category_name_en_category_name_ru_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='name_az',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='menuitem',
            name='description_az',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='menuitem',
            name='name_az',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='subcategory',
            name='name_az',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
