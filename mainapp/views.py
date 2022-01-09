from django.shortcuts import render, redirect
from django.contrib import messages
from .models import *
from django.db.models import Q

# Create your views here.
def homeview(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        option = request.POST.get('option')
        room_code = request.POST.get('room_code')

        if option == '1':    # have room code
            game = Game.objects.filter(room_code = room_code).first()
            print(game.game_creator)
            
            # print(game) 
            print(username, game.game_creator)
            if username == game.game_creator:
                messages.error(request,f"{username} is your opponent's name. Please choose a unique name.")
                return redirect('/')

            if game is None:
                messages.success(request,'Room not found')
                return redirect('/')

            if game.is_over:
                messages.success(request , "Game is over")
                return redirect('/')

            # set yourself the opponent
            game.game_opponent = username
            game.save()
            return redirect('/play/' + room_code + '?username=' + username + '&symbol=X' )   #passing username as a query, redirect to the play


        else:   # create room code
            game = Game(game_creator = username,room_code = room_code)
            game.save()
            return redirect('/play/' + room_code + '?username=' + username + '&symbol=O')   #passing username as a query, redirect to the play

    return render(request,'home.html')


def play(request,room_code):
    username = request.GET.get('username')  # this username we passed in the url as a query
    symbol = request.GET.get('symbol')

    if Game.objects.filter(Q(game_creator=username) | Q(game_opponent=username) ,room_code = room_code).exists():
        print(username,symbol)
        context = {'room_code': room_code, 'username':username,'symbol':symbol}
        return render(request,'play.html',context)

    # elif Game.objects.filter(game_opponent = username,room_code = room_code).exists():
    #     print(username,symbol)
    #     context = {'room_code': room_code, 'username':username,'symbol':symbol}
    #     return render(request,'play.html',context)

    else:
        return render(request,'home.html')
