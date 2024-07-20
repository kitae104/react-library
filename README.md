### HTTPS 설정 

openssl req -x509 -out ssl-localhost\localhost.crt -keyout ssl-localhost\localhost.key -newkey rsa:2048 -nodes -sha256 -days 365 -config localhost.conf

openssl x509 -noout -text -in ssl-localhost/localhost.crt

"start": "set HTTPS=true&&react-scripts start",