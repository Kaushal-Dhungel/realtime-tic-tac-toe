# Realtime Tic Tac Toe and Chat Using Django Channels.

[watch the demo here](https://www.youtube.com/watch?v=6QPgdUGcoZA)

## About

This is a `two-playered` tic tac toe game. Firstly a room has to be created by the `first player` along with a `room code` and the code should be provided to the `second player`. Using the room code, the `second player` can join the room and play the game.

## Installation 

**Manual Installation**

*This requires Redis server to be installed on your Device*

1. Clone the repo.
```sh
$ git clone https://github.com/Kaushal-Dhungel/realtime-tic-tac-toe.git
```

2. Install the dependencies
```sh
$ pip install -r requirements.txt
```

3. Start the Redis Server
```sh
$ redis-server
```

4. Check if the Redis Server is working
```sh
$ redis-cli ping
PONG
```

5. Run the program
```sh
$ python3 manage.py runserver
```

**Docker Installation**

*This requires Docker to be installed on your Device*

1. Clone the repo.
```sh
$ git clone https://github.com/Kaushal-Dhungel/realtime-tic-tac-toe.git
```

2. Run the docker.
```sh
$ docker-compose up
```

## Have a great day ..  :blush: :heart: :)