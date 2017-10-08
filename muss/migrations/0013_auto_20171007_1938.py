# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2017-10-07 22:38
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('muss', '0012_auto_20171002_0834'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='likecomment',
            name='comment',
        ),
        migrations.AddField(
            model_name='comment',
            name='users_likes',
            field=django.contrib.postgres.fields.jsonb.JSONField(default=dict),
            preserve_default=False,
        ),
        migrations.DeleteModel(
            name='LikeComment',
        ),
    ]
