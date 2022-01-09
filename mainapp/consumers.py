from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import json

class Gameroom(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_code']   # accessing the room code from the url
        # self.room_group_name = f'room_{self.room_name}'
        self.room_group_name = 'room_%s' %  self.room_name


        print(self.room_group_name,self.channel_name)   # channel_name is provided automatically

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self,close_code):   # close_code must be passed else shows an error, plus in documentation it is passed
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self,text_data):  # text data is received
        print(text_data)
        async_to_sync(self.channel_layer.group_send) (
            self.room_group_name , {
                'type': 'run_game',   # custom function
                'payload': text_data  # passing to the function, text_data is in json format
            }
        )

    def run_game(self,event):
        data = event['payload']   # this payload was passed in the receive,
        data = json.loads(data)  # data is in json format, convert json to python
        print(data['data'])

        self.send(text_data= json.dumps({    # convert python to json and send
            'payload'  : data['data']
        }))
