import asyncio
import websockets
from tinydb import TinyDB, Query
import json  

db = TinyDB('db.json')

# Define a list to keep track of connected clients
connected_clients = set()

async def handler(websocket, path):
    connected_clients.add(websocket)

    # Send all documents from the database to the newly connected client as JSON
    documents = [doc for doc in db.all()]
    if documents:
        await websocket.send(json.dumps(documents))  # Convert to JSON
    try:
        async for message in websocket:
            data = json.loads(message)
            if data.get("action") == "delete":
                document_id = data.get("id")
                print(document_id)
                query=Query()
                db.remove(query.id == document_id)
                await asyncio.gather(*[client.send(json.dumps(documents)) for client in connected_clients])
            else:
                db.insert(data)
                from pprint import pprint
                pprint(data)
            documents = [doc for doc in db.all()]
            await asyncio.gather(*[client.send(json.dumps(documents)) for client in connected_clients])
    except websockets.exceptions.ConnectionClosedOK:
        pass  # Client disconnected gracefully
    finally:
        connected_clients.remove(websocket)


async def main():
    async with websockets.serve(handler, "0.0.0.0", 9000):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
