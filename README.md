# Multiplayer Jigsaw Game
[Demo](#demo)

## Overview
This project is a multiplayer jigsaw puzzle game built using Spring Boot and Angular. The game utilizes WebSockets to provide real-time communication between players, allowing them to collaboratively solve puzzles together. User authentication is implemented using JSON Web Tokens (JWT) to ensure secure and personalized gaming experiences. Players can create and join to custom puzzles even without authentication.

## Features
- **Multiplayer experience**: Play the jigsaw game with friends or other online players in real-time.
- **WebSockets integration**: Utilizes websockets to enable seamless and fast communication between players.
- **JWT Authentication**: Secure user authentication using JSON Web Tokens.
- **Lobby**: Players can browse and join various jigsaw games.
- **Custom Puzzles**: Players can create custom puzzles, then with the given ID can invite friends or other players can join from the lobby.

## Work In Progress :warning:
Please note that this project was created for personal demo purposes. It is in the early stages of development, so some parts may be non-functional, minimally functional, or awaiting modification.

## Demo
Click [here](https://multiplayer-jigsaw-frontend.onrender.com) to try it out.
> :warning: Please be aware that this demo is hosted on a low performance service - delays and interruptions may occur.

Pre-made accounts:
| Username | Password |
| --- | --- |
| user1 | pass |
| user2 | pass |

## Technologies Used
### Backend
- Spring Boot (3.2)
- Java (17)
- Redis
- PostgreSQL
- JWT
- SockJS, STOMP

### Frontend
- Angular (17.2)
- TypeScript (5.3)
- Angular Material
- PixiJS

## Documentation
[Frontend](https://github.com/marcellbld/multiplayer-jigsaw-frontend)
[Backend](https://github.com/marcellbld/multiplayer-jigsaw-backend)
