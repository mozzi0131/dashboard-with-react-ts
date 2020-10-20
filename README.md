# DashBoard with React and TypeScript

Nginx, Docker를 이용하여 서비스하는 것을 목적으로 작성된 프로젝트입니다.

## How to run the project

 ```c
 // for a development server
 $ yarn
 $ yarn start

 // or
 $ npm install
 $ npm start
 ```

  ```c
 // for a production server
 $ yarn
 $ yarn build

 // or
 $ npm install
 $ npm build
 ```

 If you make sure that the image is successfully build, then serve the file as below.

### Using Dockerfile (Using nginx)

If you don't have docker-compose on your PC, please refer to [Docker Official Docs](https://docs.docker.com/compose/install/)

 ```c
 // if the image's name looks too long, please edit the docer-compose.yml
 $ sudo docker-compose -f docker-compose.yml up -d --build
 $ sudo docker run -it --rm -p 1337:80 dashboard-with-react-ts_dashboard-prod

 // after running the docker, you can view the app by navigating http://localhost:1337/
 ```

## Remained TO-DO

 1. Timeout 등을 이용한 proxy error 해결
 2. Error 팝업 발생할 수 있도록 작업
 3. Module 검색 가능하도록 검색창 작업 및 개선]
 4. yarn으로 Dockerfile 변경
 5. Node.js 추가해서 기능 추가하기(서버 kill되면 다시 올리기.. etc)
 6. Nginx 기능 추가하기 (proxy_pass, load balancing.. etc)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
