from django.db import models

# Create your models here.
class Book(models.Model):
    # id = models.AutoField(primary_key = True)
    title = models.CharField(max_length=32)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    pub_date = models.DateField()
    publish = models.CharField(max_length=32)
    # xx = models.CharField(max_length=32, null=True, blank=True)
    # xx2 = models.CharField(max_length=32, default='xx2')
    def __str__(self):
        return self.title