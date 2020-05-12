--Dependencies-- 
    Node version 14+
    yarn

Run locally using dev build without compression (Build much faster): 
  run: yarn
    start server in a terminal: npm run start-dev
    goto localhost:8080

Run locally using production build: 
  run: yarn
    start server in a terminal: npm run start
    goto localhost:8080

Run in Docker container using dev build:
  Install Docker and Docker Compose: 
    sudo apt install docker docker-compose 
  build with: 
    sudo docker build -t champions-area .
  view build images to get image-id: 
    sudo docker images
  run dev: 
    sudo docker run -p 80:8080 {image-id}
  view app in local host at: http://localhost/
  check running containers: 
    sudo docker container ls
  stop running docker containers: 
    sudo docker stop {container id}

Run App using Docker container for prod build:
  start app using:
    sudo docker-compose up
  find container id: 
    sudo docker container ls
  stop container: 
    sudo docker stop {container id}

