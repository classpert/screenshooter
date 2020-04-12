VERSION=1.3.0

docker:
	docker build -t classpert/screenshooter:${VERSION} ./

docker-push: docker
	docker push classpert/screenshooter:${VERSION}