## Websocket TODO

A simple example of a TODO app currently utilized at my company for tracking and assigning tasks among team members. Initially, we utilized a Docker image deployed on an Azure Container App. However, over time, we opted to transition to a Raspberry Pi as the WebSocket server. Now, users of the app only require the 'client.js' and 'index.html' files on their devices connected to the internal network to communicate with the WebSocket server and utilize the application.


## Raspberry Setup

* Set up a Raspberry Pi with a static IP address on the same network as the clients who want to use the app.
* Boot the Raspberry Pi using SSH.
* Create a systemd service.

```console
sudo nano /etc/systemd/system/webapp.service
```
Config file: 

```console
[Unit]
Description=WebApp
After=network.target

[Service]
User=marco
WorkingDirectory=/home/marco/code/webapp
ExecStart=python server.py
Restart=always

[Install]
WantedBy=multi-user.target
```

then execute,

```console
sudo systemctl daemon-reload
sudo systemctl enable webapp.service
sudo reboot
```

After the reboot, you can check the status of the service with the command:

```console
sudo systemctl status teose.service
```

You have to check if the service is "enabled."