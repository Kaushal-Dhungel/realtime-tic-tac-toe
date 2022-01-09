from django.db import models

# Create your models here.
class Game(models.Model):
    room_code = models.CharField(max_length=100)
    game_creator = models.CharField(max_length=100)
    game_opponent = models.CharField(max_length=100 , blank=True , null=True)
    is_over = models.BooleanField(default=False)

    def __str__(self) -> str:
        if self.game_opponent:
            return self.game_creator + "----" + self.game_opponent + "----" + self.room_code
        
        return self.game_creator + "----" + self.room_code
        
    