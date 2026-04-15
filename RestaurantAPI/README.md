# RestaurantAPI


clear  
mvn clean install -DskipTests  
docker build -t ming-house-backend .  
docker run -p 8080:8080 ming-house-backend