from django.db import models

# Create your models here.
class Link(models.Model):
    link=models.CharField(max_length=200)
    #path=models.CharField(max_length=200)
    def __str__(self):
        return self.link
    