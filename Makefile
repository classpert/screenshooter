VERSION=0.0.1

docker:
	docker build -t classpert/screenshooter:${VERSION} ./

docker-push: docker
	docker push classpert/screenshooter:${VERSION}