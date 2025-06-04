# RestaurantAPI


clear  
mvn clean install -DskipTests  
docker build -t api-image .  
docker run -t --link mysql-docker:mysql -p 8080:8080 api-image
