# Generated by Django 4.2.7 on 2023-12-06 21:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('menu', '0002_review'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='review',
            name='first_name',
        ),
        migrations.RemoveField(
            model_name='review',
            name='last_name',
        ),
        migrations.AddField(
            model_name='review',
            name='full_name',
            field=models.CharField(default=1, max_length=100, verbose_name='Ad Soyad'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='review',
            name='email',
            field=models.EmailField(max_length=254, verbose_name='e-mail'),
        ),
        migrations.AlterField(
            model_name='review',
            name='text',
            field=models.TextField(max_length=315, verbose_name='Mətn'),
        ),
    ]
